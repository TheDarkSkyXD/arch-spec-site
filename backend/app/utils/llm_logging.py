"""
Utility for logging LLM responses.

This module provides functions for logging LLM responses to both file and database
for future retrieval and analysis.
"""
import os
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from app.db.base import db
from abc import ABC, abstractmethod

class LLMLogger(ABC):
    @abstractmethod
    def log_response(
        self,
        response_type: str,
        raw_response: Any,
        project_id: Optional[str] = None,
        category: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Log an LLM response with associated metadata."""
        pass


# Set up a dedicated logger for LLM responses
llm_logger = logging.getLogger("llm_responses")
llm_logger.setLevel(logging.INFO)

# Ensure we have a directory for logs
os.makedirs("logs/llm_responses", exist_ok=True)
file_handler = logging.FileHandler("logs/llm_responses/llm_responses.log")
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
llm_logger.addHandler(file_handler)

# Custom encoder to handle non-serializable objects
class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        # Handle any objects that need custom serialization
        if hasattr(obj, "model_dump"):
            # For Pydantic models
            return obj.model_dump()
        elif hasattr(obj, "__dict__"):
            # For regular Python classes
            return obj.__dict__
        # Let the base class handle the rest or fail
        return super().default(obj)


class DefaultLLMLogger(LLMLogger):
    def log_response(
        self,
        response_type: str,
        raw_response: Any,
        project_id: Optional[str] = None,
        category: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Log LLM response to both file and database."""
        timestamp = datetime.now().isoformat()
        
        # Ensure raw_response is a string
        if not isinstance(raw_response, str):
            raw_response = json.dumps(raw_response, cls=CustomEncoder)
        
        # Create the log entry
        log_entry = {
            "timestamp": timestamp,
            "project_id": project_id or "unknown",
            "type": response_type,
            "raw_response": raw_response,
        }
        
        # Add optional fields if they exist
        if category:
            log_entry["category"] = category
        
        # Process metadata to ensure all objects are serializable
        if metadata:
            # Create a deep copy of metadata to avoid modifying the original
            processed_metadata = {}
            for key, value in metadata.items():
                # Handle special case for Usage objects from Anthropic
                if hasattr(value, "__class__") and value.__class__.__name__ == "Usage":
                    # Convert Usage object to dictionary
                    processed_metadata[key] = {
                        k: v for k, v in value.__dict__.items() 
                        if not k.startswith('_')
                    }
                # Handle other non-serializable objects
                elif not isinstance(value, (str, int, float, bool, list, dict, type(None))):
                    try:
                        # Try to convert to dictionary if possible
                        processed_metadata[key] = json.loads(json.dumps(value, cls=CustomEncoder))
                    except:
                        # If conversion fails, store as string representation
                        processed_metadata[key] = str(value)
                else:
                    processed_metadata[key] = value
            
            log_entry["metadata"] = processed_metadata
        
        # Log to file
        llm_logger.info(json.dumps(log_entry, cls=CustomEncoder))
        
        # Log to database if available
        try:
            database = db.get_db()
            if database is not None:
                # Store in a collection for LLM responses
                database.llm_responses.insert_one(log_entry)
        except Exception as e:
            llm_logger.error(f"Error logging LLM response to database: {str(e)}")
