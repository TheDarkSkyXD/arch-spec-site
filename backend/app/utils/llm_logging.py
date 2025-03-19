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

def log_llm_response(
    project_id: str, 
    response_type: str,
    response: str, 
    parsed_data: Optional[Dict[str, Any]] = None,
    category: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
):
    """
    Log LLM response to both file and database for later retrieval.
    
    Args:
        project_id: The project ID
        response_type: The type of response (e.g., 'implementation_prompt', 'requirements', etc.)
        response: The raw LLM response
        parsed_data: The parsed data extracted from the response
        category: Optional category (e.g., implementation prompt category)
        metadata: Optional additional metadata
    """
    timestamp = datetime.now().isoformat()
    
    # Create the log entry
    log_entry = {
        "timestamp": timestamp,
        "project_id": project_id,
        "type": response_type,
        "raw_response": response,
    }
    
    # Add optional fields if they exist
    if parsed_data:
        log_entry["parsed_data"] = parsed_data
    if category:
        log_entry["category"] = category
    if metadata:
        log_entry["metadata"] = metadata
    
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