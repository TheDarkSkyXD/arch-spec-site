from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
import uuid


class ArtifactBase(BaseModel):
    """Base model for Artifact data."""
    specification_id: str
    type: str  # diagram, schema, document
    format: str  # mermaid, json, markdown
    content: str


class ArtifactCreate(ArtifactBase):
    """Model for creating a new Artifact."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))


class ArtifactUpdate(BaseModel):
    """Model for updating an existing Artifact."""
    type: Optional[str] = None
    format: Optional[str] = None
    content: Optional[str] = None


class ArtifactInDB(ArtifactBase):
    """Model for Artifact data stored in the database."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Artifact(ArtifactInDB):
    """Model for Artifact data returned to clients."""
    pass 