def print_screens_input_schema():
    return {
      "name": "print_screens",
      "description": "Formats and displays the organized screen recommendations for different user access levels",
      "input_schema": {
          "type": "object",
          "properties": {
              "data": {
                  "type": "object",
                  "description": "The structured screen recommendations organized by access level",
                  "properties": {
                      "public": {
                          "type": "array",
                          "description": "List of screens accessible to unauthenticated users",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "name": {
                                      "type": "string",
                                      "description": "Name of the screen (e.g., Landing, Login)"
                                  },
                                  "path": {
                                      "type": "string",
                                      "description": "URL path for the screen"
                                  },
                                  "components": {
                                      "type": "array",
                                      "description": "List of UI components included in this screen",
                                      "items": {
                                          "type": "string"
                                      }
                                  },
                                  "enabled": {
                                      "type": "boolean",
                                      "description": "Whether this screen is enabled"
                                  }
                              },
                              "required": ["name", "path", "components", "enabled"]
                          }
                      },
                      "authenticated": {
                          "type": "array",
                          "description": "List of screens accessible to logged-in users",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "name": {
                                      "type": "string",
                                      "description": "Name of the screen (e.g., Dashboard, Profile)"
                                  },
                                  "path": {
                                      "type": "string",
                                      "description": "URL path for the screen"
                                  },
                                  "components": {
                                      "type": "array",
                                      "description": "List of UI components included in this screen",
                                      "items": {
                                          "type": "string"
                                      }
                                  },
                                  "enabled": {
                                      "type": "boolean",
                                      "description": "Whether this screen is enabled"
                                  }
                              },
                              "required": ["name", "path", "components", "enabled"]
                          }
                      },
                      "admin": {
                          "type": "array",
                          "description": "List of screens accessible to administrators",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "name": {
                                      "type": "string",
                                      "description": "Name of the screen (e.g., AdminDashboard, UserManagement)"
                                  },
                                  "path": {
                                      "type": "string",
                                      "description": "URL path for the screen"
                                  },
                                  "components": {
                                      "type": "array",
                                      "description": "List of UI components included in this screen",
                                      "items": {
                                          "type": "string"
                                      }
                                  },
                                  "enabled": {
                                      "type": "boolean",
                                      "description": "Whether this screen is enabled"
                                  }
                              },
                              "required": ["name", "path", "components", "enabled"]
                          }
                      }
                  },
                  "required": ["public", "authenticated", "admin"]
              }
          },
          "required": ["data"]
      }
  }
