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
    model: str = os.getenv("ANTHROPIC_MODEL", "claude-3-7-sonnet-20250219")
    max_tokens: int = int(os.getenv("ANTHROPIC_MAX_TOKENS", "4000"))
    temperature: float = float(os.getenv("ANTHROPIC_TEMPERATURE", "0.7"))


class Settings(BaseSettings):
    """Application configuration settings."""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
    
    app_name: str = "ArchSpec API"
    version: str = "0.1.0"
    description: str = "AI-driven software specification system"
    environment: str = "development"
    
    # CORS settings
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # MongoDB settings
    mongo: MongoSettings = MongoSettings()
    
    # Anthropic settings
    anthropic: AnthropicSettings = AnthropicSettings()


settings = Settings() 