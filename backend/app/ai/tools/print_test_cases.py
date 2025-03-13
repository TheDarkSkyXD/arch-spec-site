def print_test_cases_input_schema():
    return {
        "name": "print_test_cases",
        "description": "Formats and displays the organized test cases using Gherkin format",
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "description": "The structured test cases data",
                    "properties": {
                        "testCases": {
                            "type": "array",
                            "description": "List of test cases in Gherkin format",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "feature": {
                                        "type": "string",
                                        "description": "The feature being tested (e.g., User Authentication, Shopping Cart)"
                                    },
                                    "title": {
                                        "type": "string",
                                        "description": "Title of the test case (e.g., Login with valid credentials)"
                                    },
                                    "description": {
                                        "type": "string",
                                        "description": "Optional description of the test case"
                                    },
                                    "tags": {
                                        "type": "array",
                                        "description": "Optional tags for categorizing the test case (e.g., smoke, regression, ui)",
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "scenarios": {
                                        "type": "array",
                                        "description": "List of scenarios in this test case",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "name": {
                                                    "type": "string",
                                                    "description": "Name of the scenario (e.g., Successful login, Invalid credentials)"
                                                },
                                                "steps": {
                                                    "type": "array",
                                                    "description": "Gherkin steps (Given/When/Then/And/But)",
                                                    "items": {
                                                        "type": "object",
                                                        "properties": {
                                                            "type": {
                                                                "type": "string",
                                                                "enum": ["given", "when", "then", "and", "but"],
                                                                "description": "Type of step"
                                                            },
                                                            "text": {
                                                                "type": "string",
                                                                "description": "Text of the step (e.g., the user enters valid credentials)"
                                                            }
                                                        },
                                                        "required": ["type", "text"]
                                                    }
                                                }
                                            },
                                            "required": ["name", "steps"]
                                        }
                                    }
                                },
                                "required": ["feature", "title", "scenarios"]
                            }
                        }
                    },
                    "required": ["testCases"]
                }
            },
            "required": ["data"]
        }
    } 