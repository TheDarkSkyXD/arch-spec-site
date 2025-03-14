def print_api_endpoints_input_schema():
    return {
        "name": "print_api_endpoints",
        "description": "Formats and displays the API endpoints specification",
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "description": "The structured API endpoints data",
                    "properties": {
                        "endpoints": {
                            "type": "array",
                            "description": "List of API endpoints",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "path": {
                                        "type": "string",
                                        "description": "API endpoint path"
                                    },
                                    "description": {
                                        "type": "string",
                                        "description": "Brief description of the endpoint's purpose"
                                    },
                                    "methods": {
                                        "type": "array",
                                        "description": "HTTP methods supported by this endpoint",
                                        "items": {
                                            "type": "string",
                                            "enum": ["GET", "POST", "PUT", "DELETE", "PATCH"]
                                        }
                                    },
                                    "auth": {
                                        "type": "boolean",
                                        "description": "Whether authentication is required for this endpoint"
                                    },
                                    "roles": {
                                        "type": "array",
                                        "description": "List of roles that can access this endpoint, if any",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "required": ["path", "description", "methods", "auth"]
                            }
                        }
                    },
                    "required": ["endpoints"]
                }
            },
            "required": ["data"]
        },
        "cache_control": {"type": "ephemeral"}
    } 