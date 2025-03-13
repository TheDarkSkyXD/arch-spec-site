def print_pages_input_schema():
    return {
      "name": "print_pages",
      "description": "Formats and displays the organized page recommendations for different user access levels",
      "input_schema": {
          "type": "object",
          "properties": {
              "data": {
                  "type": "object",
                  "description": "The structured page recommendations organized by access level",
                  "properties": {
                      "public": {
                          "type": "array",
                          "description": "List of pages accessible to unauthenticated users",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "name": {
                                      "type": "string",
                                      "description": "Name of the page (e.g., Landing, Login)"
                                  },
                                  "path": {
                                      "type": "string",
                                      "description": "URL path for the page"
                                  },
                                  "components": {
                                      "type": "array",
                                      "description": "List of UI components included in this page",
                                      "items": {
                                          "type": "string"
                                      }
                                  },
                                  "enabled": {
                                      "type": "boolean",
                                      "description": "Whether this page is enabled"
                                  }
                              },
                              "required": ["name", "path", "components", "enabled"]
                          }
                      },
                      "authenticated": {
                          "type": "array",
                          "description": "List of pages accessible to logged-in users",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "name": {
                                      "type": "string",
                                      "description": "Name of the page (e.g., Dashboard, Profile)"
                                  },
                                  "path": {
                                      "type": "string",
                                      "description": "URL path for the page"
                                  },
                                  "components": {
                                      "type": "array",
                                      "description": "List of UI components included in this page",
                                      "items": {
                                          "type": "string"
                                      }
                                  },
                                  "enabled": {
                                      "type": "boolean",
                                      "description": "Whether this page is enabled"
                                  }
                              },
                              "required": ["name", "path", "components", "enabled"]
                          }
                      },
                      "admin": {
                          "type": "array",
                          "description": "List of pages accessible to administrators",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "name": {
                                      "type": "string",
                                      "description": "Name of the page (e.g., AdminDashboard, UserManagement)"
                                  },
                                  "path": {
                                      "type": "string",
                                      "description": "URL path for the page"
                                  },
                                  "components": {
                                      "type": "array",
                                      "description": "List of UI components included in this page",
                                      "items": {
                                          "type": "string"
                                      }
                                  },
                                  "enabled": {
                                      "type": "boolean",
                                      "description": "Whether this page is enabled"
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
