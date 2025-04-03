def print_tech_stack_input_schema():
    return {
        "name": "print_tech_stack",
        "description": "Formats and displays the recommended technology stack with justifications",
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "description": "The structured technology stack recommendations",
                    "properties": {
                        "frontend": {
                            "type": "object",
                            "description": "Frontend technology recommendations",
                            "properties": {
                                "framework": {
                                    "type": ["string", "null"],
                                    "description": "Recommended frontend framework or library",
                                },
                                "language": {
                                    "type": ["string", "null"],
                                    "description": "Recommended frontend programming language",
                                },
                                "stateManagement": {
                                    "type": ["string", "null"],
                                    "description": "Recommended state management solution",
                                },
                                "uiLibrary": {
                                    "type": ["string", "null"],
                                    "description": "Recommended UI component library or CSS framework",
                                },
                                "formHandling": {
                                    "type": ["string", "null"],
                                    "description": "Recommended form handling library",
                                },
                                "routing": {
                                    "type": ["string", "null"],
                                    "description": "Recommended routing solution",
                                },
                                "apiClient": {
                                    "type": ["string", "null"],
                                    "description": "Recommended API client library",
                                },
                                "metaFramework": {
                                    "type": ["string", "null"],
                                    "description": "Recommended meta-framework",
                                },
                            },
                        },
                        "backend": {
                            "type": "object",
                            "description": "Backend technology recommendations",
                            "properties": {
                                "type": {
                                    "type": ["string", "null"],
                                    "description": "Type of backend (e.g., traditional, serverless, BaaS)",
                                },
                                "service": {
                                    "type": ["string", "null"],
                                    "description": "Recommended backend service or framework",
                                },
                                "functions": {
                                    "type": ["string", "null"],
                                    "description": "Recommended serverless functions solution",
                                },
                                "realtime": {
                                    "type": ["string", "null"],
                                    "description": "Recommended realtime solution",
                                },
                            },
                        },
                        "database": {
                            "type": "object",
                            "description": "Database technology recommendations",
                            "properties": {
                                "type": {
                                    "type": ["string", "null"],
                                    "description": "Type of database (e.g., SQL, NoSQL)",
                                },
                                "system": {
                                    "type": ["string", "null"],
                                    "description": "Recommended database system",
                                },
                                "hosting": {
                                    "type": ["string", "null"],
                                    "description": "Recommended database hosting",
                                },
                                "orm": {
                                    "type": ["string", "null"],
                                    "description": "Recommended ORM or database toolkit",
                                },
                            },
                        },
                        "authentication": {
                            "type": "object",
                            "description": "Authentication technology recommendations",
                            "properties": {
                                "provider": {
                                    "type": ["string", "null"],
                                    "description": "Recommended authentication provider",
                                },
                                "methods": {
                                    "type": "array",
                                    "description": "Recommended authentication methods",
                                    "items": {"type": "string"},
                                },
                            },
                        },
                        "hosting": {
                            "type": "object",
                            "description": "Hosting recommendations",
                            "properties": {
                                "frontend": {
                                    "type": ["string", "null"],
                                    "description": "Recommended frontend hosting",
                                },
                                "backend": {
                                    "type": ["string", "null"],
                                    "description": "Recommended backend hosting",
                                },
                                "database": {
                                    "type": ["string", "null"],
                                    "description": "Recommended database hosting if separate",
                                },
                            },
                        },
                        "storage": {
                            "type": "object",
                            "description": "Storage recommendations",
                            "properties": {
                                "type": {
                                    "type": ["string", "null"],
                                    "description": "Type of storage solution",
                                },
                                "service": {
                                    "type": ["string", "null"],
                                    "description": "Recommended storage service",
                                },
                            },
                        },
                        "deployment": {
                            "type": "object",
                            "description": "Deployment recommendations",
                            "properties": {
                                "ci_cd": {
                                    "type": ["string", "null"],
                                    "description": "Recommended CI/CD solution",
                                },
                                "containerization": {
                                    "type": ["string", "null"],
                                    "description": "Recommended containerization solution",
                                },
                            },
                        },
                        "overallJustification": {
                            "type": "string",
                            "description": "Brief explanation of why this tech stack is appropriate for the project",
                        },
                    },
                    "required": [
                        "frontend",
                        "backend",
                        "database",
                        "authentication",
                        "hosting",
                        "deployment",
                        "overallJustification",
                    ],
                }
            },
            "required": ["data"],
        },
        "cache_control": {"type": "ephemeral"},
    }
