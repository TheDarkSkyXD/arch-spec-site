from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
import uuid


class TechStack(BaseModel):
    """Tech stack specification."""
    frontend: str
    backend: str
    database: str


class Requirements(BaseModel):
    """Requirements specification."""
    project_type: str
    functional_requirements: List[str]
    non_functional_requirements: List[str]
    tech_stack: TechStack


class EntityAttribute(BaseModel):
    """Data model entity attribute."""
    name: str
    type: str
    constraints: List[str]


class Entity(BaseModel):
    """Data model entity."""
    name: str
    attributes: List[EntityAttribute]
    relationships: List[str]


class DataModel(BaseModel):
    """Data model specification."""
    entities: List[Entity]


class ApiEndpoint(BaseModel):
    """API endpoint specification."""
    path: str
    method: str
    request_body: Optional[str] = None
    response: Optional[str] = None
    description: str


class Architecture(BaseModel):
    """Architecture specification."""
    pattern: str
    components: List[str]
    data_flow: List[str]
    diagram: Optional[str] = None


class Implementation(BaseModel):
    """Implementation specification."""
    file_structure: List[str]
    key_components: Optional[List[str]] = None


class SpecificationBase(BaseModel):
    """Base model for Specification data."""
    project_id: str
    requirements: Requirements
    architecture: Architecture
    data_model: DataModel
    api_endpoints: List[ApiEndpoint]
    implementation: Implementation


class SpecificationCreate(SpecificationBase):
    """Model for creating a new Specification."""
    pass


class SpecificationUpdate(BaseModel):
    """Model for updating an existing Specification."""
    requirements: Optional[Requirements] = None
    architecture: Optional[Architecture] = None
    data_model: Optional[DataModel] = None
    api_endpoints: Optional[List[ApiEndpoint]] = None
    implementation: Optional[Implementation] = None


class SpecificationInDB(SpecificationBase):
    """Model for Specification data stored in the database."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Specification(SpecificationInDB):
    """Model for Specification data returned to clients."""
    pass 