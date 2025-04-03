import os
from typing import List, Optional, Dict, Any
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache

# Load environment variables from .env file
try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass  # dotenv not installed, ignore


class MongoSettings(BaseSettings):
    """MongoDB configuration settings."""

    uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name: str = os.getenv("MONGODB_DB_NAME", "archspec")

    model_config = {"env_prefix": "MONGODB_"}


class AnthropicSettings(BaseSettings):
    """Anthropic API configuration settings."""

    api_key: str = Field("", env="ANTHROPIC_API_KEY")
    model: str = "claude-3-7-sonnet-20250219"
    max_tokens: int = 4000
    temperature: float = 0.7

    model_config = {"env_prefix": "ANTHROPIC_"}


class OpenRouterSettings(BaseSettings):
    """OpenRouter API configuration settings."""

    api_key: str = Field("", env="OPENROUTER_API_KEY")
    referer: str = Field("https://archspec.dev", env="OPENROUTER_REFERER")
    title: str = Field("ArchSpec", env="OPENROUTER_TITLE")

    model_config = {"env_prefix": "OPENROUTER_"}


class LLMSettings(BaseSettings):
    """LLM provider configuration settings."""

    preferred_provider: str = Field("anthropic", env="LLM_PREFERRED_PROVIDER")
    enable_failover: bool = Field(True, env="LLM_ENABLE_FAILOVER")

    model_config = {"env_prefix": "LLM_"}


class LemonSqueezySettings(BaseSettings):
    """LemonSqueezy API configuration settings."""

    api_key: str = os.getenv("LEMONSQUEEZY_API_KEY", "")
    store_id: str = os.getenv("LEMONSQUEEZY_STORE_ID", "")
    webhook_secret: str = os.getenv("LEMONSQUEEZY_WEBHOOK_SECRET", "")

    model_config = {"env_prefix": "LEMONSQUEEZY_"}


class FirebaseSettings(BaseSettings):
    """Firebase configuration settings."""

    type: str = Field("", env="FIREBASE_TYPE")
    project_id: str = Field("", env="FIREBASE_PROJECT_ID")
    private_key_id: str = Field("", env="FIREBASE_PRIVATE_KEY_ID")
    private_key: str = Field("", env="FIREBASE_PRIVATE_KEY")
    client_email: str = Field("", env="FIREBASE_CLIENT_EMAIL")
    client_id: str = Field("", env="FIREBASE_CLIENT_ID")
    auth_uri: str = Field("https://accounts.google.com/o/oauth2/auth", env="FIREBASE_AUTH_URI")
    token_uri: str = Field("https://oauth2.googleapis.com/token", env="FIREBASE_TOKEN_URI")
    auth_provider_x509_cert_url: str = Field(
        "https://www.googleapis.com/oauth2/v1/certs", env="FIREBASE_AUTH_PROVIDER_X509_CERT_URL"
    )
    client_x509_cert_url: str = Field("", env="FIREBASE_CLIENT_X509_CERT_URL")
    universe_domain: str = Field("googleapis.com", env="FIREBASE_UNIVERSE_DOMAIN")
    storage_bucket: str = Field("", env="FIREBASE_STORAGE_BUCKET")

    model_config = {"env_prefix": "FIREBASE_"}


class Settings(BaseSettings):
    """Application configuration settings."""

    app_name: str = "ArchSpec API"
    version: str = "0.1.0"
    description: str = "AI-driven software specification system"
    environment: str = "development"

    # CORS settings
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Frontend URL for redirects
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # MongoDB settings
    mongo: MongoSettings = MongoSettings()

    # Anthropic settings
    anthropic: AnthropicSettings = AnthropicSettings()

    # LemonSqueezy settings
    lemonsqueezy: LemonSqueezySettings = LemonSqueezySettings()

    # OpenRouter settings
    openrouter: OpenRouterSettings = OpenRouterSettings()

    # LLM provider settings
    llm: LLMSettings = LLMSettings()

    # Firebase settings
    firebase: FirebaseSettings = FirebaseSettings()

    # Firebase credentials and storage bucket - define as proper fields
    firebase_credentials: Optional[Dict[str, Any]] = None
    firebase_storage_bucket: str = ""

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",  # Important: allow extra fields from environment
    }

    def get_firebase_credentials(self) -> Optional[Dict[str, Any]]:
        """Get Firebase credentials as a dictionary."""
        if not self.firebase.private_key:
            return None

        return {
            "type": self.firebase.type,
            "project_id": self.firebase.project_id,
            "private_key_id": self.firebase.private_key_id,
            "private_key": self.firebase.private_key.replace("\\n", "\n"),
            "client_email": self.firebase.client_email,
            "client_id": self.firebase.client_id,
            "auth_uri": self.firebase.auth_uri,
            "token_uri": self.firebase.token_uri,
            "auth_provider_x509_cert_url": self.firebase.auth_provider_x509_cert_url,
            "client_x509_cert_url": self.firebase.client_x509_cert_url,
            "universe_domain": self.firebase.universe_domain,
        }


# Create a settings instance
@lru_cache()
def get_settings():
    """Get a cached instance of settings."""
    settings = Settings()
    # Properly update the declared fields
    firebase_creds = settings.get_firebase_credentials()
    if firebase_creds:
        settings = settings.model_copy(update={"firebase_credentials": firebase_creds})
    if settings.firebase.storage_bucket:
        settings = settings.model_copy(
            update={"firebase_storage_bucket": settings.firebase.storage_bucket}
        )
    return settings


settings = get_settings()
