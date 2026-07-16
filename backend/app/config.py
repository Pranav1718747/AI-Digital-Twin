import logging
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("sentinel.config")

class Settings(BaseSettings):
    # Core Service Configurations
    APP_ENV: str = "development"
    SECRET_KEY: str = "9478f10ea82b450c9dc8a10bcdef56a7984cd12345e67890f1e2d3c4b5a6d7e8"
    TOKEN_EXPIRE_MINUTES: int = 15

    # Relational Database Credentials (PostgreSQL 16)
    DB_HOST: str = "localhost"
    DB_PORT: int = 5433
    DB_NAME: str = "sentinel_db"
    DB_USER: str = "sentinel_user"
    DB_PASSWORD: str = "secure_pass"

    # Graph Database Credentials (Neo4j 5 Enterprise)
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "secure_neo_pass"

    # Vector Database Credentials (Qdrant)
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333

    # Caching and Message Brokers (Redis & RabbitMQ)
    REDIS_URL: str = "redis://localhost:6380/0"
    RABBITMQ_URL: str = "amqp://guest:guest@localhost:5672//"

    # External API Gateways (LLM Providers)
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "openrouter/free"
    EMBEDDING_MODEL: str = "openai/text-embedding-3-small"
    COHERE_API_KEY: str = ""

    # Enterprise SSO Identity Provider (Keycloak)
    DISABLE_AUTH: bool = False
    KEYCLOAK_REALM_URL: str = "http://localhost:8080/realms/sentinelos"
    KEYCLOAK_AUDIENCE: str = "sentinel-gateway-api"

    # Settings config mapping to look for local .env files
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
print(f"OpenRouter API key loaded: {'yes' if settings.OPENROUTER_API_KEY else 'no'}")
print(f"Selected OpenRouter model: {settings.OPENROUTER_MODEL}")
