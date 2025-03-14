import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class MongoSettings(BaseSettings):
    """MongoDB configuration settings."""
    uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name: str = os.getenv("MONGODB_DB_NAME", "archspec")
    

class AnthropicSettings(BaseSettings):
    """Anthropic API configuration settings."""
    api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    model: str = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
    max_tokens: int = int(os.getenv("ANTHROPIC_MAX_TOKENS", "8192"))
    temperature: float = float(os.getenv("ANTHROPIC_TEMPERATURE", "0.7"))


class LemonSqueezySettings(BaseSettings):
    """LemonSqueezy API configuration settings."""
    api_key: str = os.getenv("LEMONSQUEEZY_API_KEY", "")
    store_id: str = os.getenv("LEMONSQUEEZY_STORE_ID", "")
    webhook_secret: str = os.getenv("LEMONSQUEEZY_WEBHOOK_SECRET", "")


class Settings(BaseSettings):
    """Application configuration settings."""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
    
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
    LEMONSQUEEZY_API_KEY: str = os.getenv("LEMONSQUEEZY_API_KEY", "")
    LEMONSQUEEZY_STORE_ID: str = os.getenv("LEMONSQUEEZY_STORE_ID", "")
    LEMONSQUEEZY_WEBHOOK_SECRET: str = os.getenv("LEMONSQUEEZY_WEBHOOK_SECRET", "")


settings = Settings() 