from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union

from .shared_schemas import ProjectTechStack, Requirements

class FeatureModule(BaseModel):
    """Feature module configuration."""
    name: str
    description: str
    enabled: bool = True
    optional: bool = False
    providers: List[str] = Field(default_factory=list)

class Features(BaseModel):
    """Features configuration."""
    coreModules: List[FeatureModule] = Field(default_factory=list, alias="coreModules")

    class Config:
        populate_by_name = True

class PageComponent(BaseModel):
    """Page component."""
    name: str
    path: str
    components: List[str] = Field(default_factory=list)
    enabled: bool = True

class Pages(BaseModel):
    """Application pages."""
    public: List[PageComponent] = Field(default_factory=list)
    authenticated: List[PageComponent] = Field(default_factory=list)
    admin: List[PageComponent] = Field(default_factory=list)

class EntityField(BaseModel):
    """Data model entity field."""
    name: str
    type: str
    primary_key: bool = False
    generated: bool = False
    unique: bool = False
    required: bool = False
    default: Optional[Union[str, int, float, bool]] = None
    enum: Optional[List[str]] = None
    foreign_key: Optional[Dict[str, Any]] = None

class Entity(BaseModel):
    """Data model entity."""
    name: str
    description: str
    fields: List[EntityField] = Field(default_factory=list)

class Relationship(BaseModel):
    """Data model relationship."""
    type: str
    from_entity: str
    to_entity: str
    field: str

    class Config:
        populate_by_name = True

class DataModel(BaseModel):
    """Application data model."""
    entities: List[Entity] = Field(default_factory=list)
    relationships: List[Relationship] = Field(default_factory=list)

    class Config:
        populate_by_name = True

class ApiEndpoint(BaseModel):
    """API endpoint configuration."""
    path: str
    description: str
    methods: List[str] = Field(default_factory=list)
    auth: bool = False
    roles: List[str] = Field(default_factory=list)

class Api(BaseModel):
    """API configuration."""
    endpoints: List[ApiEndpoint] = Field(default_factory=list)

class TestingFramework(BaseModel):
    """Testing framework configuration."""
    framework: str
    coverage: int = 0
    directories: Optional[List[str]] = None
    focus: Optional[List[str]] = None
    scenarios: Optional[List[str]] = None

class Testing(BaseModel):
    """Testing configuration."""
    unit: TestingFramework
    integration: TestingFramework
    e2e: TestingFramework

class ProjectStructure(BaseModel):
    """Project structure configuration."""
    frontend: Dict[str, List[str]]

class DeploymentEnvironment(BaseModel):
    """Deployment environment configuration."""
    name: str
    url: str
    variables: List[Dict[str, Any]] = Field(default_factory=list)

class CICD(BaseModel):
    """CI/CD configuration."""
    provider: str
    steps: List[str] = Field(default_factory=list)

class Deployment(BaseModel):
    """Deployment configuration."""
    environments: List[DeploymentEnvironment] = Field(default_factory=list)
    cicd: CICD

class Diagram(BaseModel):
    """Documentation diagram."""
    name: str
    type: str
    template: str

class Documentation(BaseModel):
    """Documentation configuration."""
    specs: List[str] = Field(default_factory=list)
    diagrams: List[Diagram] = Field(default_factory=list)
    
class Colors(BaseModel):
    """Colors schema for UI design."""
    primary: str
    secondary: str
    accent: str
    background: str
    text_primary: str = Field(alias="textPrimary")
    text_secondary: str = Field(alias="textSecondary")
    success: str
    warning: str
    error: str
    info: str
    surface: str
    border: str


class HeadingSizes(BaseModel):
    """Heading sizes schema for typography."""
    h1: str
    h2: str
    h3: str
    h4: str
    h5: str
    h6: str


class Typography(BaseModel):
    """Typography schema for UI design."""
    font_family: str = Field(alias="fontFamily")
    heading_font: str = Field(alias="headingFont")
    font_size: str = Field(alias="fontSize")
    line_height: float = Field(alias="lineHeight")
    font_weight: int = Field(alias="fontWeight")
    heading_sizes: HeadingSizes = Field(alias="headingSizes")


class Spacing(BaseModel):
    """Spacing schema for UI design."""
    unit: str
    scale: List[int]


class BorderRadius(BaseModel):
    """Border radius schema for UI design."""
    small: str
    medium: str
    large: str
    xl: str
    pill: str


class Shadows(BaseModel):
    """Shadows schema for UI design."""
    small: str
    medium: str
    large: str
    xl: str


class Layout(BaseModel):
    """Layout schema for UI design."""
    container_width: str = Field(alias="containerWidth")
    responsive: bool
    sidebar_width: str = Field(alias="sidebarWidth")
    topbar_height: str = Field(alias="topbarHeight")
    grid_columns: int = Field(alias="gridColumns")
    gutter_width: str = Field(alias="gutterWidth")


class Components(BaseModel):
    """Components schema for UI design."""
    button_style: str = Field(alias="buttonStyle")
    input_style: str = Field(alias="inputStyle")
    card_style: str = Field(alias="cardStyle")
    table_style: str = Field(alias="tableStyle")
    nav_style: str = Field(alias="navStyle")


class DarkModeColors(BaseModel):
    """Dark mode colors schema."""
    background: str
    text_primary: str = Field(alias="textPrimary")
    text_secondary: str = Field(alias="textSecondary")
    surface: str
    border: str


class DarkMode(BaseModel):
    """Dark mode schema."""
    enabled: bool
    colors: DarkModeColors


class Animations(BaseModel):
    """Animations schema."""
    transition_duration: str = Field(alias="transitionDuration")
    transition_timing: str = Field(alias="transitionTiming")
    hover_scale: float = Field(alias="hoverScale")
    enable_animations: bool = Field(alias="enableAnimations")


class UIDesign(BaseModel):
    """UI design schema."""
    colors: Colors
    typography: Typography
    spacing: Spacing
    border_radius: BorderRadius = Field(alias="borderRadius")
    shadows: Shadows
    layout: Layout
    components: Components
    dark_mode: DarkMode = Field(alias="darkMode")
    animations: Animations

class ProjectTemplate(BaseModel):
    """Project template schema."""
    name: str
    version: str
    description: str
    business_goals: List[str] = Field(default_factory=list, alias="businessGoals")
    target_users: str = Field(default="", alias="targetUsers")
    domain: str = Field(default="")
    tech_stack: ProjectTechStack = Field(alias="techStack")
    requirements: Requirements = Field(alias="requirements")
    features: Features
    ui_design: UIDesign = Field(alias="uiDesign")
    pages: Pages
    data_model: DataModel = Field(alias="dataModel")
    api: Api
    testing: Testing
    project_structure: ProjectStructure = Field(alias="projectStructure")
    deployment: Deployment
    documentation: Documentation

    class Config:
        populate_by_name = True

class ProjectTemplateResponse(BaseModel):
    """Response schema for a project template."""
    id: str
    template: ProjectTemplate

class ProjectTemplateList(BaseModel):
    """Response schema for a list of project templates."""
    templates: List[ProjectTemplateResponse] = Field(default_factory=list) 