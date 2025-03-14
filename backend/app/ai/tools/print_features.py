
def print_features_input_schema():
    return {
        "name": "print_features",
        "description": "Formats and displays the organized feature list based on core modules",
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "description": "The structured feature data organized by modules",
                    "properties": {
                        "coreModules": {
                            "type": "array",
                            "description": "List of core modules in the application",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "type": "string",
                                        "description": "Name of the module (e.g., Authentication, User Management)"
                                    },
                                    "description": {
                                        "type": "string",
                                        "description": "Brief description of the module's purpose"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "description": "Whether this module is enabled by default"
                                    },
                                    "optional": {
                                        "type": "boolean",
                                        "description": "Whether this module is optional or required"
                                    },
                                    "providers": {
                                        "type": "array",
                                        "description": "List of service providers associated with this module, if any",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "required": ["name", "description", "enabled", "optional"]
                            }
                        },
                        "optionalModules": {
                            "type": "array",
                            "description": "List of optional modules that can be enabled",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "type": "string",
                                        "description": "Name of the optional module"
                                    },
                                    "description": {
                                        "type": "string",
                                        "description": "Brief description of the optional module's purpose"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "description": "Whether this optional module is enabled by default"
                                    },
                                    "optional": {
                                        "type": "boolean",
                                        "description": "Always true for optional modules"
                                    },
                                    "providers": {
                                        "type": "array",
                                        "description": "List of service providers associated with this module, if any",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "required": ["name", "description", "enabled", "optional"]
                            }
                        }
                    },
                    "required": ["coreModules"]
                }
            },
            "required": ["data"]
        },
        "cache_control": {"type": "ephemeral"}
    }
