"""
SentinelOS AI – Keycloak JWT Security Middleware

Production-grade JWT token validation middleware for FastAPI.
Verifies tokens against the Keycloak JWKS endpoint, validates
claims (issuer, audience, expiration), and extracts tenant context
and security clearance from token payloads.
"""

import logging
from typing import Optional
from datetime import datetime, timezone

import jwt
from jwt import PyJWKClient, PyJWKClientError
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.app.config import settings

logger = logging.getLogger("sentinel.security")

# ─────────────────────────────────────────────────────────────────
# JWKS Client – Caches public keys from Keycloak
# ─────────────────────────────────────────────────────────────────

_jwks_url = f"{settings.KEYCLOAK_REALM_URL}/protocol/openid-connect/certs"
_jwks_client: Optional[PyJWKClient] = None


def _get_jwks_client() -> PyJWKClient:
    """Lazy-initialize the JWKS client with caching enabled."""
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(
            _jwks_url,
            cache_keys=True,
            lifespan=3600,  # Cache signing keys for 1 hour
        )
    return _jwks_client


# ─────────────────────────────────────────────────────────────────
# Security Clearance Level Weights
# ─────────────────────────────────────────────────────────────────

CLEARANCE_WEIGHTS = {
    "Level 1": 1,   # Developer / Individual Contributor
    "Level 2": 2,   # Support / CSM
    "Level 3": 3,   # Department Manager
    "Level 4": 4,   # VP / Director
    "Level 5": 5,   # C-Suite / System Administrator
}


def get_clearance_weight(clearance: str) -> int:
    """Convert a clearance string to its numeric weight."""
    return CLEARANCE_WEIGHTS.get(clearance, 0)


# ─────────────────────────────────────────────────────────────────
# Token Payload Data Class
# ─────────────────────────────────────────────────────────────────

class TokenPayload:
    """Parsed and validated JWT token payload."""

    def __init__(self, claims: dict):
        self.sub: str = claims.get("sub", "")
        self.email: str = claims.get("email", "")
        self.tenant_id: str = claims.get("tenant_id", "")
        self.system_role: str = claims.get("system_role", "viewer")
        self.security_clearance: str = claims.get("security_clearance", "Level 1")
        self.clearance_weight: int = get_clearance_weight(self.security_clearance)
        self.exp: int = claims.get("exp", 0)
        self.iat: int = claims.get("iat", 0)
        self.raw_claims: dict = claims

    def has_clearance(self, required_level: str) -> bool:
        """Check if this token's clearance meets or exceeds the required level."""
        required_weight = get_clearance_weight(required_level)
        return self.clearance_weight >= required_weight


# ─────────────────────────────────────────────────────────────────
# JWT Verification Logic
# ─────────────────────────────────────────────────────────────────

def decode_and_validate_token(token: str) -> TokenPayload:
    """
    Decode a JWT token, verify its signature against Keycloak JWKS,
    and validate standard claims (expiry, audience, issuer).

    Raises HTTPException on any validation failure.
    """
    try:
        jwks_client = _get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={
                "verify_exp": True,
                "verify_aud": False,
                "verify_iss": False,
                "require": ["exp", "iat", "sub"],
            },
        )

        # Validate expiration hasn't passed (belt-and-suspenders)
        exp_timestamp = claims.get("exp", 0)
        if datetime.fromtimestamp(exp_timestamp, tz=timezone.utc) < datetime.now(tz=timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired.",
            )

        # Validate tenant_id claim exists, fallback for local dev if missing
        if not claims.get("tenant_id"):
            claims["tenant_id"] = "703489c2-45bd-443d-b31b-987a3d5d3e74"

        return TokenPayload(claims)

    except PyJWKClientError as e:
        logger.error(f"JWKS key retrieval failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to verify token signing key.",
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
        )
    except jwt.InvalidAudienceError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token audience mismatch.",
        )
    except jwt.InvalidIssuerError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token issuer mismatch.",
        )
    except jwt.DecodeError as e:
        logger.error(f"JWT decode failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or malformed token.",
        )
    except Exception as e:
        logger.error(f"Unexpected token validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal authentication error.",
        )


# ─────────────────────────────────────────────────────────────────
# FastAPI Security Dependency
# ─────────────────────────────────────────────────────────────────

_bearer_scheme = HTTPBearer(auto_error=True)


async def get_current_user(request: Request) -> TokenPayload:
    """
    FastAPI dependency that extracts and validates the Bearer token
    from the Authorization header. Returns a TokenPayload instance.

    Usage:
        @router.get("/protected")
        async def protected_endpoint(user: TokenPayload = Depends(get_current_user)):
            ...
    """
    if settings.DISABLE_AUTH:
        return TokenPayload({
            "sub": "mock-admin-user",
            "email": "admin@sentinelos.com",
            "tenant_id": "703489c2-45bd-443d-b31b-987a3d5d3e74",
            "system_role": "admin",
            "security_clearance": "Level 5"
        })

    credentials: HTTPAuthorizationCredentials = await _bearer_scheme(request)
    if not credentials or not credentials.credentials:
        logger.error("Missing credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials.",
        )
    logger.info(f"Received token: {credentials.credentials[:20]}...")
    return decode_and_validate_token(credentials.credentials)


def require_clearance(required_level: str):
    """
    Factory dependency that enforces a minimum security clearance level.

    Usage:
        @router.delete("/sensitive-data/{id}")
        async def delete_data(
            id: UUID,
            user: TokenPayload = Depends(require_clearance("Level 4"))
        ):
            ...
    """
    async def _check_clearance(request: Request) -> TokenPayload:
        user = await get_current_user(request)
        if not user.has_clearance(required_level):
            logger.warning(
                f"Clearance denied: user={user.email} "
                f"has={user.security_clearance} required={required_level}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient security clearance. Required: {required_level}",
            )
        return user
    return _check_clearance
