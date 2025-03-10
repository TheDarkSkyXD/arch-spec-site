from typing import Dict, List, Optional, Union, Any
from pydantic import BaseModel, Field

# Common compatibility models for different technology types
class FrameworkCompatibility(BaseModel):
    """Compatibility options for frontend frameworks."""
    stateManagement: Optional[List[str]] = Field(default_factory=list)
    uiLibraries: Optional[List[str]] = Field(default_factory=list)
    formHandling: Optional[List[str]] = Field(default_factory=list)
    routing: Optional[List[str]] = Field(default_factory=list)
    apiClients: Optional[List[str]] = Field(default_factory=list)
    metaFrameworks: Optional[List[str]] = Field(default_factory=list)
    hosting: Optional[List[str]] = Field(default_factory=list)
    testing: Optional[List[str]] = Field(default_factory=list)
    languages: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class BackendFrameworkCompatibility(BaseModel):
    """Compatibility options for backend frameworks."""
    databases: Optional[List[str]] = Field(default_factory=list)
    orms: Optional[List[str]] = Field(default_factory=list)
    auth: Optional[List[str]] = Field(default_factory=list)
    hosting: Optional[List[str]] = Field(default_factory=list)
    testing: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class BaaSCompatibility(BaseModel):
    """Compatibility options for Backend as a Service."""
    databases: Optional[List[str]] = Field(default_factory=list)
    auth: Optional[List[str]] = Field(default_factory=list)
    storage: Optional[List[str]] = Field(default_factory=list)
    functions: Optional[List[str]] = Field(default_factory=list)
    frontendFrameworks: Optional[List[str]] = Field(default_factory=list)
    realtime: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class DatabaseCompatibility(BaseModel):
    """Compatibility options for databases."""
    hosting: Optional[List[str]] = Field(default_factory=list)
    orms: Optional[List[str]] = Field(default_factory=list)
    frameworks: Optional[List[str]] = Field(default_factory=list)
    baas: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class SimpleCompatibility(BaseModel):
    """Simple compatibility list for many technology types."""
    compatibleWith: Optional[Union[List[str], Dict[str, List[str]]]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class HostingCompatibility(BaseModel):
    """Compatibility options for hosting services."""
    frontend: Optional[List[str]] = Field(default_factory=list)
    backend: Optional[List[str]] = Field(default_factory=list)
    database: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class TestingCompatibility(BaseModel):
    """Compatibility options for testing tools."""
    frameworks: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class StorageCompatibility(BaseModel):
    """Compatibility options for storage solutions."""
    frameworks: Optional[List[str]] = Field(default_factory=list)
    baas: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class ServerlessCompatibility(BaseModel):
    """Compatibility options for serverless solutions."""
    frameworks: Optional[List[str]] = Field(default_factory=list)
    baas: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class RealtimeCompatibility(BaseModel):
    """Compatibility options for realtime solutions."""
    frameworks: Optional[List[str]] = Field(default_factory=list)
    baas: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

# Technology models for different types
class FrontendFramework(BaseModel):
    """Frontend framework details."""
    type: str = "frontend"
    description: str
    languages: Optional[List[str]] = Field(default_factory=list)
    compatibleWith: FrameworkCompatibility
    
    class Config:
        populate_by_name = True

class BackendFramework(BaseModel):
    """Backend framework details."""
    type: str = "backend"
    description: str
    language: Optional[str] = None
    compatibleWith: BackendFrameworkCompatibility
    
    class Config:
        populate_by_name = True

class BaaS(BaseModel):
    """Backend as a Service details."""
    type: str = "backend"
    description: str
    compatibleWith: BaaSCompatibility
    
    class Config:
        populate_by_name = True

class Database(BaseModel):
    """Database details."""
    type: str
    description: str
    compatibleWith: DatabaseCompatibility
    
    class Config:
        populate_by_name = True

class StateManagement(BaseModel):
    """State management library details."""
    description: str
    compatibleWith: Union[List[str], Dict[str, List[str]]]
    
    class Config:
        populate_by_name = True

class UILibrary(BaseModel):
    """UI library details."""
    description: str
    compatibleWith: Union[List[str], Dict[str, List[str]]]
    
    class Config:
        populate_by_name = True

class FormHandling(BaseModel):
    """Form handling library details."""
    description: str
    compatibleWith: Union[List[str], Dict[str, List[str]]]
    
    class Config:
        populate_by_name = True

class Routing(BaseModel):
    """Routing library details."""
    description: str
    compatibleWith: Union[List[str], Dict[str, List[str]]]
    
    class Config:
        populate_by_name = True

class APIClient(BaseModel):
    """API client details."""
    description: str
    compatibleWith: Union[List[str], Dict[str, List[str]]]
    
    class Config:
        populate_by_name = True

class MetaFramework(BaseModel):
    """Meta framework details."""
    description: str
    compatibleWith: Union[List[str], Dict[str, List[str]]]
    
    class Config:
        populate_by_name = True

class ORM(BaseModel):
    """ORM details."""
    description: str
    compatibleWith: Dict[str, List[str]]
    
    class Config:
        populate_by_name = True

class Auth(BaseModel):
    """Authentication method details."""
    description: str
    compatibleWith: Dict[str, List[str]]
    
    class Config:
        populate_by_name = True

class Hosting(BaseModel):
    """Hosting service details."""
    type: str
    description: str
    compatibleWith: Union[List[str], Dict[str, List[str]]]
    
    class Config:
        populate_by_name = True

class Testing(BaseModel):
    """Testing tool details."""
    type: str
    description: str
    compatibleWith: Dict[str, List[str]]
    
    class Config:
        populate_by_name = True

class Storage(BaseModel):
    """Storage solution details."""
    type: str
    description: str
    compatibleWith: Dict[str, List[str]]
    
    class Config:
        populate_by_name = True

class Serverless(BaseModel):
    """Serverless solution details."""
    type: str
    description: str
    compatibleWith: Dict[str, List[str]]
    
    class Config:
        populate_by_name = True

class Realtime(BaseModel):
    """Realtime solution details."""
    type: str
    description: str
    compatibleWith: Dict[str, List[str]]
    
    class Config:
        populate_by_name = True

# Categories for hierarchical navigation
class FrontendCategories(BaseModel):
    """Frontend technology categories."""
    frameworks: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    stateManagement: List[str] = Field(default_factory=list)
    uiLibraries: List[str] = Field(default_factory=list)
    formHandling: List[str] = Field(default_factory=list)
    routing: List[str] = Field(default_factory=list)
    apiClients: List[str] = Field(default_factory=list)
    metaFrameworks: List[str] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class BackendCategories(BaseModel):
    """Backend technology categories."""
    frameworks: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    baas: List[str] = Field(default_factory=list)
    serverless: List[str] = Field(default_factory=list)
    realtime: List[str] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class DatabaseCategories(BaseModel):
    """Database technology categories."""
    sql: List[str] = Field(default_factory=list)
    nosql: List[str] = Field(default_factory=list)
    providers: List[str] = Field(default_factory=list)
    clients: List[str] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class AuthenticationCategories(BaseModel):
    """Authentication technology categories."""
    providers: List[str] = Field(default_factory=list)
    methods: List[str] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class DeploymentCategories(BaseModel):
    """Deployment technology categories."""
    platforms: List[str] = Field(default_factory=list)
    containerization: List[str] = Field(default_factory=list)
    ci_cd: List[str] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class StorageCategories(BaseModel):
    """Storage technology categories."""
    objectStorage: List[str] = Field(default_factory=list)
    fileSystem: List[str] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class HostingCategories(BaseModel):
    """Hosting technology categories."""
    frontend: List[str] = Field(default_factory=list)
    backend: List[str] = Field(default_factory=list)
    database: List[str] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class TestingCategories(BaseModel):
    """Testing technology categories."""
    unitTesting: List[str] = Field(default_factory=list)
    e2eTesting: List[str] = Field(default_factory=list)
    apiTesting: List[str] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class Categories(BaseModel):
    """All technology categories for hierarchical navigation."""
    frontend: FrontendCategories = Field(default_factory=FrontendCategories)
    backend: BackendCategories = Field(default_factory=BackendCategories)
    database: DatabaseCategories = Field(default_factory=DatabaseCategories)
    authentication: AuthenticationCategories = Field(default_factory=AuthenticationCategories)
    deployment: DeploymentCategories = Field(default_factory=DeploymentCategories)
    storage: StorageCategories = Field(default_factory=StorageCategories)
    hosting: HostingCategories = Field(default_factory=HostingCategories)
    testing: TestingCategories = Field(default_factory=TestingCategories)
    
    class Config:
        populate_by_name = True

# Technologies detailed information with compatibility
class Technologies(BaseModel):
    """Detailed technology information with compatibility relationships."""
    frameworks: Dict[str, Union[FrontendFramework, BackendFramework]] = Field(default_factory=dict)
    baas: Dict[str, BaaS] = Field(default_factory=dict)
    stateManagement: Dict[str, StateManagement] = Field(default_factory=dict)
    uiLibraries: Dict[str, UILibrary] = Field(default_factory=dict)
    formHandling: Dict[str, FormHandling] = Field(default_factory=dict)
    routing: Dict[str, Routing] = Field(default_factory=dict)
    apiClients: Dict[str, APIClient] = Field(default_factory=dict)
    metaFrameworks: Dict[str, MetaFramework] = Field(default_factory=dict)
    databases: Dict[str, Database] = Field(default_factory=dict)
    orms: Dict[str, ORM] = Field(default_factory=dict)
    auth: Dict[str, Auth] = Field(default_factory=dict)
    hosting: Dict[str, Hosting] = Field(default_factory=dict)
    testing: Dict[str, Testing] = Field(default_factory=dict)
    storage: Dict[str, Storage] = Field(default_factory=dict)
    serverless: Dict[str, Serverless] = Field(default_factory=dict)
    realtime: Dict[str, Realtime] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

# Main tech stack data model
class TechStackData(BaseModel):
    """Complete tech stack data with categories and technologies."""
    categories: Categories = Field(default_factory=Categories)
    technologies: Technologies = Field(default_factory=Technologies)
    
    class Config:
        populate_by_name = True
