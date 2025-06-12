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

    primary: str = "#3b82f6"
    secondary: str = "#6366f1"
    accent: str = "#f59e0b"
    background: str = "#ffffff"
    text_primary: str = Field(alias="textPrimary", default="#1f2937")
    text_secondary: str = Field(alias="textSecondary", default="#4b5563")
    success: str = "#10b981"
    warning: str = "#f59e0b"
    error: str = "#ef4444"
    info: str = "#3b82f6"
    surface: str = "#ffffff"
    border: str = "#e5e7eb"

    class Config:
        populate_by_name = True


class HeadingSizes(BaseModel):
    """Heading sizes schema for typography."""

    h1: str = "2.5rem"
    h2: str = "2rem"
    h3: str = "1.75rem"
    h4: str = "1.5rem"
    h5: str = "1.25rem"
    h6: str = "1rem"

    class Config:
        populate_by_name = True


class Typography(BaseModel):
    """Typography schema for UI design."""

    font_family: str = Field(alias="fontFamily", default="Inter, sans-serif")
    heading_font: str = Field(alias="headingFont", default="Inter, sans-serif")
    font_size: str = Field(alias="fontSize", default="16px")
    line_height: float = Field(alias="lineHeight", default=1.5)
    font_weight: int = Field(alias="fontWeight", default=400)
    heading_sizes: HeadingSizes = Field(alias="headingSizes", default_factory=HeadingSizes)

    class Config:
        populate_by_name = True


class Spacing(BaseModel):
    """Spacing schema for UI design."""

    unit: str = "4px"
    scale: List[int] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]

    class Config:
        populate_by_name = True


class BorderRadius(BaseModel):
    """Border radius schema for UI design."""

    small: str = "2px"
    medium: str = "4px"
    large: str = "8px"
    xl: str = "12px"
    pill: str = "9999px"

    class Config:
        populate_by_name = True


class Shadows(BaseModel):
    """Shadows schema for UI design."""

    small: str = "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    medium: str = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    large: str = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    xl: str = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"

    class Config:
        populate_by_name = True


class Layout(BaseModel):
    """Layout schema for UI design."""

    container_width: str = Field(alias="containerWidth", default="1280px")
    responsive: bool = True
    sidebar_width: str = Field(alias="sidebarWidth", default="240px")
    topbar_height: str = Field(alias="topbarHeight", default="64px")
    grid_columns: int = Field(alias="gridColumns", default=12)
    gutter_width: str = Field(alias="gutterWidth", default="16px")

    class Config:
        populate_by_name = True


class Components(BaseModel):
    """Components schema for UI design."""

    button_style: str = Field(alias="buttonStyle", default="rounded")
    input_style: str = Field(alias="inputStyle", default="outline")
    card_style: str = Field(alias="cardStyle", default="shadow")
    table_style: str = Field(alias="tableStyle", default="bordered")
    nav_style: str = Field(alias="navStyle", default="pills")

    class Config:
        populate_by_name = True


class DarkModeColors(BaseModel):
    """Dark mode colors schema."""

    background: str = "#1f2937"
    text_primary: str = Field(alias="textPrimary", default="#f9fafb")
    text_secondary: str = Field(alias="textSecondary", default="#e5e7eb")
    surface: str = "#374151"
    border: str = "#4b5563"

    class Config:
        populate_by_name = True


class DarkMode(BaseModel):
    """Dark mode schema."""

    enabled: bool = True
    colors: DarkModeColors = Field(default_factory=DarkModeColors)

    class Config:
        populate_by_name = True


class Animations(BaseModel):
    """Animations schema."""

    transition_duration: str = Field(alias="transitionDuration", default="150ms")
    transition_timing: str = Field(alias="transitionTiming", default="ease-in-out")
    hover_scale: float = Field(alias="hoverScale", default=1.05)
    enable_animations: bool = Field(alias="enableAnimations", default=True)

    class Config:
        populate_by_name = True


class UIDesign(BaseModel):
    """UI design schema."""

    colors: Colors = Field(default_factory=Colors)
    typography: Typography = Field(default_factory=Typography)
    spacing: Spacing = Field(default_factory=Spacing)
    border_radius: BorderRadius = Field(alias="borderRadius", default_factory=BorderRadius)
    shadows: Shadows = Field(default_factory=Shadows)
    layout: Layout = Field(default_factory=Layout)
    components: Components = Field(default_factory=Components)
    dark_mode: DarkMode = Field(alias="darkMode", default_factory=DarkMode)
    animations: Animations = Field(default_factory=Animations)

    class Config:
        populate_by_name = True


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
