def print_data_model_input_schema():
    return {
        "name": "print_data_model",
        "description": "Formats and displays the complete data model specification with entities and relationships",
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "description": "The structured data model specification",
                    "properties": {
                        "entities": {
                            "type": "array",
                            "description": "List of entities in the data model",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string", "description": "Name of the entity"},
                                    "description": {
                                        "type": "string",
                                        "description": "Brief description of the entity's purpose",
                                    },
                                    "fields": {
                                        "type": "array",
                                        "description": "List of fields/properties for this entity",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "name": {
                                                    "type": "string",
                                                    "description": "Name of the field",
                                                },
                                                "type": {
                                                    "type": "string",
                                                    "description": "Data type of the field",
                                                },
                                                "primaryKey": {
                                                    "type": "boolean",
                                                    "description": "Whether this field is a primary key",
                                                },
                                                "generated": {
                                                    "type": "boolean",
                                                    "description": "Whether this field value is automatically generated",
                                                },
                                                "unique": {
                                                    "type": "boolean",
                                                    "description": "Whether this field must contain unique values",
                                                },
                                                "required": {
                                                    "type": "boolean",
                                                    "description": "Whether this field is required",
                                                },
                                                "default": {
                                                    "type": ["string", "null"],
                                                    "description": "Default value for this field",
                                                },
                                                "enum": {
                                                    "type": ["array", "null"],
                                                    "description": "List of allowed values for this field",
                                                    "items": {"type": "string"},
                                                },
                                            },
                                            "required": ["name", "type"],
                                        },
                                    },
                                },
                                "required": ["name", "description", "fields"],
                            },
                        },
                        "relationships": {
                            "type": "array",
                            "description": "List of relationships between entities",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "description": "Type of relationship (oneToOne, oneToMany, manyToOne, manyToMany)",
                                    },
                                    "from_entity": {
                                        "type": "string",
                                        "description": "Source entity name",
                                    },
                                    "to_entity": {
                                        "type": "string",
                                        "description": "Target entity name",
                                    },
                                    "field": {
                                        "type": "string",
                                        "description": "Field name that represents the relationship",
                                    },
                                    "throughTable": {
                                        "type": ["string", "null"],
                                        "description": "Intermediate table for many-to-many relationships",
                                    },
                                },
                                "required": ["type", "from_entity", "to_entity", "field"],
                            },
                        },
                    },
                    "required": ["entities", "relationships"],
                }
            },
            "required": ["data"],
        },
        "cache_control": {"type": "ephemeral"},
    }
