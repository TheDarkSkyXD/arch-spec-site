def print_ui_design_input_schema():
    return {
        "name": "print_ui_design",
        "description": "Formats and displays the UI design system recommendations",
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "description": "The structured UI design system recommendations",
                    "properties": {
                        "colors": {
                            "type": "object",
                            "description": "Color palette for the application",
                            "properties": {
                                "primary": {"type": "string", "description": "Primary brand color"},
                                "secondary": {
                                    "type": "string",
                                    "description": "Secondary brand color",
                                },
                                "accent": {
                                    "type": "string",
                                    "description": "Accent color for highlights",
                                },
                                "background": {
                                    "type": "string",
                                    "description": "Main background color",
                                },
                                "textPrimary": {
                                    "type": "string",
                                    "description": "Primary text color",
                                },
                                "textSecondary": {
                                    "type": "string",
                                    "description": "Secondary text color",
                                },
                                "success": {"type": "string", "description": "Success state color"},
                                "warning": {"type": "string", "description": "Warning state color"},
                                "error": {"type": "string", "description": "Error state color"},
                                "info": {
                                    "type": "string",
                                    "description": "Information state color",
                                },
                                "surface": {
                                    "type": "string",
                                    "description": "Surface elements color",
                                },
                                "border": {"type": "string", "description": "Border color"},
                            },
                            "required": [
                                "primary",
                                "secondary",
                                "accent",
                                "background",
                                "textPrimary",
                                "textSecondary",
                            ],
                        },
                        "typography": {
                            "type": "object",
                            "description": "Typography settings for the application",
                            "properties": {
                                "fontFamily": {"type": "string", "description": "Main font family"},
                                "headingFont": {
                                    "type": "string",
                                    "description": "Font family for headings",
                                },
                                "fontSize": {"type": "string", "description": "Base font size"},
                                "lineHeight": {"type": "number", "description": "Base line height"},
                                "fontWeight": {
                                    "type": "integer",
                                    "description": "Base font weight",
                                },
                                "headingSizes": {
                                    "type": "object",
                                    "description": "Sizes for heading elements",
                                    "properties": {
                                        "h1": {"type": "string", "description": "h1 font size"},
                                        "h2": {"type": "string", "description": "h2 font size"},
                                        "h3": {"type": "string", "description": "h3 font size"},
                                        "h4": {"type": "string", "description": "h4 font size"},
                                        "h5": {"type": "string", "description": "h5 font size"},
                                        "h6": {"type": "string", "description": "h6 font size"},
                                    },
                                    "required": ["h1", "h2", "h3"],
                                },
                            },
                            "required": ["fontFamily", "fontSize", "lineHeight"],
                        },
                        "spacing": {
                            "type": "object",
                            "description": "Spacing system for the application",
                            "properties": {
                                "unit": {
                                    "type": "string",
                                    "description": "Base spacing unit (e.g., '4px', '0.25rem')",
                                },
                                "scale": {
                                    "type": "array",
                                    "description": "Spacing scale multipliers",
                                    "items": {"type": "integer"},
                                },
                            },
                            "required": ["unit", "scale"],
                        },
                        "borderRadius": {
                            "type": "object",
                            "description": "Border radius values for different elements",
                            "properties": {
                                "small": {"type": "string", "description": "Small border radius"},
                                "medium": {"type": "string", "description": "Medium border radius"},
                                "large": {"type": "string", "description": "Large border radius"},
                                "xl": {
                                    "type": "string",
                                    "description": "Extra large border radius",
                                },
                                "pill": {
                                    "type": "string",
                                    "description": "Pill-shaped border radius",
                                },
                            },
                            "required": ["small", "medium", "large"],
                        },
                        "shadows": {
                            "type": "object",
                            "description": "Shadow values for different elements",
                            "properties": {
                                "small": {"type": "string", "description": "Small shadow"},
                                "medium": {"type": "string", "description": "Medium shadow"},
                                "large": {"type": "string", "description": "Large shadow"},
                                "xl": {"type": "string", "description": "Extra large shadow"},
                            },
                            "required": ["small", "medium", "large"],
                        },
                        "layout": {
                            "type": "object",
                            "description": "Layout settings for the application",
                            "properties": {
                                "containerWidth": {
                                    "type": "string",
                                    "description": "Maximum width of the content container",
                                },
                                "responsive": {
                                    "type": "boolean",
                                    "description": "Whether the design is responsive",
                                },
                                "sidebarWidth": {
                                    "type": "string",
                                    "description": "Width of the sidebar if applicable",
                                },
                                "topbarHeight": {
                                    "type": "string",
                                    "description": "Height of the top navigation bar",
                                },
                                "gridColumns": {
                                    "type": "integer",
                                    "description": "Number of columns in the grid system",
                                },
                                "gutterWidth": {
                                    "type": "string",
                                    "description": "Width of gutters between grid columns",
                                },
                            },
                            "required": ["containerWidth", "responsive"],
                        },
                        "components": {
                            "type": "object",
                            "description": "Component-specific design settings",
                            "properties": {
                                "buttonStyle": {
                                    "type": "string",
                                    "description": "General button styling approach",
                                },
                                "inputStyle": {
                                    "type": "string",
                                    "description": "General input styling approach",
                                },
                                "cardStyle": {
                                    "type": "string",
                                    "description": "General card styling approach",
                                },
                                "tableStyle": {
                                    "type": "string",
                                    "description": "General table styling approach",
                                },
                                "navStyle": {
                                    "type": "string",
                                    "description": "General navigation styling approach",
                                },
                            },
                            "required": ["buttonStyle", "inputStyle", "cardStyle"],
                        },
                        "darkMode": {
                            "type": "object",
                            "description": "Dark mode configuration",
                            "properties": {
                                "enabled": {
                                    "type": "boolean",
                                    "description": "Whether dark mode is supported",
                                },
                                "colors": {
                                    "type": "object",
                                    "description": "Dark mode specific colors",
                                    "properties": {
                                        "background": {
                                            "type": "string",
                                            "description": "Dark mode background color",
                                        },
                                        "textPrimary": {
                                            "type": "string",
                                            "description": "Dark mode primary text color",
                                        },
                                        "textSecondary": {
                                            "type": "string",
                                            "description": "Dark mode secondary text color",
                                        },
                                        "surface": {
                                            "type": "string",
                                            "description": "Dark mode surface elements color",
                                        },
                                        "border": {
                                            "type": "string",
                                            "description": "Dark mode border color",
                                        },
                                    },
                                    "required": ["background", "textPrimary"],
                                },
                            },
                            "required": ["enabled"],
                        },
                        "animations": {
                            "type": "object",
                            "description": "Animation and transition settings",
                            "properties": {
                                "transitionDuration": {
                                    "type": "string",
                                    "description": "Default transition duration",
                                },
                                "transitionTiming": {
                                    "type": "string",
                                    "description": "Default transition timing function",
                                },
                                "hoverScale": {
                                    "type": "number",
                                    "description": "Scale factor for hover effects",
                                },
                                "enableAnimations": {
                                    "type": "boolean",
                                    "description": "Whether animations are enabled by default",
                                },
                            },
                            "required": ["transitionDuration", "enableAnimations"],
                        },
                    },
                    "required": [
                        "colors",
                        "typography",
                        "spacing",
                        "borderRadius",
                        "layout",
                        "components",
                    ],
                }
            },
            "required": ["data"],
        },
        "cache_control": {"type": "ephemeral"},
    }
