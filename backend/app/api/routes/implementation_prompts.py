"""
Implementation prompts API routes.
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, Response
from motor.motor_asyncio import AsyncIOMotorDatabase

from ...db.base import db
from ...schemas.project_specs import ImplementationPromptsSpec

router = APIRouter()


# Use the db instance and its get_db method
def get_db():
    """Get database instance."""
    return db.get_db()


@router.get("/sample", response_model=Dict[str, Any])
async def get_sample_implementation_prompts(database: AsyncIOMotorDatabase = Depends(get_db)):
    """Get sample implementation prompts that can be imported into projects."""
    sample_prompts_collection = database.get_collection("sample_implementation_prompts")
    sample_prompts = await sample_prompts_collection.find_one({})

    if not sample_prompts:
        return {"data": {}}

    # Return just the data part of the document
    return {"data": sample_prompts.get("data", {})}
