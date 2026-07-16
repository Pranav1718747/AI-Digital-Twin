import requests
import time
import sys

KEYCLOAK_URL = "http://localhost:8080"
ADMIN_USER = "admin"
ADMIN_PASS = "admin"
REALM_NAME = "sentinelos"

def get_admin_token():
    url = f"{KEYCLOAK_URL}/realms/master/protocol/openid-connect/token"
    payload = {
        "client_id": "admin-cli",
        "username": ADMIN_USER,
        "password": ADMIN_PASS,
        "grant_type": "password"
    }
    for _ in range(30):
        try:
            resp = requests.post(url, data=payload)
            if resp.status_code == 200:
                return resp.json()["access_token"]
        except Exception:
            pass
        print("Waiting for Keycloak to be ready...")
        time.sleep(2)
    
    print("Failed to get admin token. Keycloak might not be running.")
    sys.exit(1)

def create_realm(token):
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # 1. Create Realm
    realm_payload = {
        "realm": REALM_NAME,
        "enabled": True,
        "registrationAllowed": True,
        "loginWithEmailAllowed": True,
        "accessTokenLifespan": 3600
    }
    
    resp = requests.post(f"{KEYCLOAK_URL}/admin/realms", json=realm_payload, headers=headers)
    if resp.status_code == 201:
        print(f"✅ Realm '{REALM_NAME}' created.")
    elif resp.status_code == 409:
        print(f"⚠️ Realm '{REALM_NAME}' already exists.")
    else:
        print(f"❌ Failed to create realm: {resp.text}")
        
    # 2. Create Next.js Client
    client_payload = {
        "clientId": "sentinel-frontend",
        "enabled": True,
        "publicClient": True,
        "directAccessGrantsEnabled": True,
        "redirectUris": ["http://localhost:3000/*"],
        "webOrigins": ["http://localhost:3000"]
    }
    
    resp = requests.post(f"{KEYCLOAK_URL}/admin/realms/{REALM_NAME}/clients", json=client_payload, headers=headers)
    if resp.status_code == 201:
        print("✅ Client 'sentinel-frontend' created.")
    elif resp.status_code == 409:
        print("⚠️ Client 'sentinel-frontend' already exists.")
    
    # 3. Create Admin User
    user_payload = {
        "username": "admin_user",
        "email": "admin@sentinelos.com",
        "enabled": True,
        "credentials": [{"type": "password", "value": "password123", "temporary": False}],
        "attributes": {
            "tenant_id": "703489c2-45bd-443d-b31b-987a3d5d3e74",
            "security_clearance": "Level 5",
            "system_role": "admin"
        }
    }
    
    resp = requests.post(f"{KEYCLOAK_URL}/admin/realms/{REALM_NAME}/users", json=user_payload, headers=headers)
    if resp.status_code == 201:
        print("✅ User 'admin_user' created.")
    elif resp.status_code == 409:
        print("⚠️ User 'admin_user' already exists.")

if __name__ == "__main__":
    print("Starting Keycloak bootstrap...")
    token = get_admin_token()
    create_realm(token)
    print("Bootstrap complete!")
