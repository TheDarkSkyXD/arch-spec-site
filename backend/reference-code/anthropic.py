"""Client for interacting with Anthropic Claude API.

This module provides a client for interacting with the Anthropic Claude API,
including methods for generating responses, streaming responses, and extracting
domain entities from conversation transcripts.
"""

import json
from typing import List, Dict, Any, Optional, Generator, Iterator
import anthropic
from anthropic.types import ContentBlockDeltaEvent, MessageDeltaEvent

from ..config import config
from .llm_adapter import LLMAdapter


class SetEncoder(json.JSONEncoder):
    """JSON encoder that can handle sets."""
    
    def default(self, obj: Any) -> Any:
        """Convert sets to lists for JSON serialization."""
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)


class AnthropicClient(LLMAdapter):
    """Client for interacting with Anthropic Claude API.
    
    This client provides methods for generating responses from Claude,
    streaming responses, and extracting domain entities from conversation
    transcripts.
    
    Attributes:
        client: The Anthropic API client.
        model: The model to use for generating responses.
        max_tokens: The maximum number of tokens to generate.
        temperature: The temperature to use for generating responses.
    """
    
    def __init__(self) -> None:
        """Initialize the Anthropic client."""
        self.client = anthropic.Anthropic(api_key=config.anthropic.api_key)
        self.model = config.anthropic.model
        self.max_tokens = config.anthropic.max_tokens
        self.temperature = config.anthropic.temperature
    
    def generate_response(self, messages: List[Dict[str, str]], system: Optional[str] = None) -> str:
        """Generate a response from Claude given a conversation history.
        
        Args:
            messages: A list of messages in the conversation history.
                Each message should have a 'role' (either 'user' or 'assistant')
                and 'content' (the text of the message).
            system: Optional system prompt to provide context to Claude.
        
        Returns:
            The generated response from Claude.
        
        Raises:
            Exception: If there is an error calling the Anthropic API.
        """
        try:
            params: Dict[str, Any] = {
                "model": self.model,
                "max_tokens": self.max_tokens,
                "temperature": self.temperature,
                "messages": messages
            }
            
            if system:
                params["system"] = system
                
            response = self.client.messages.create(**params)
            # Explicitly check if content exists and has text property
            if response.content and len(response.content) > 0 and hasattr(response.content[0], 'text'):
                return str(response.content[0].text)
            return ""
        except Exception as e:
            raise Exception(f"Error calling Anthropic API: {str(e)}")
    
    def stream_response(self, messages: List[Dict[str, str]], system: Optional[str] = None) -> Generator[str, None, None]:
        """Stream a response from Claude given a conversation history.
        
        Args:
            messages: A list of messages in the conversation history.
                Each message should have a 'role' (either 'user' or 'assistant')
                and 'content' (the text of the message).
            system: Optional system prompt to provide context to Claude.
        
        Yields:
            Chunks of the generated response from Claude.
        
        Raises:
            Exception: If there is an error streaming from the Anthropic API.
        """
        try:
            params: Dict[str, Any] = {
                "model": self.model,
                "max_tokens": self.max_tokens,
                "temperature": self.temperature,
                "messages": messages
            }
            
            if system:
                params["system"] = system
                
            with self.client.messages.stream(**params) as stream:
                for event in stream:
                    if isinstance(event, ContentBlockDeltaEvent):
                        if hasattr(event.delta, 'text'):
                            yield event.delta.text
        except Exception as e:
            raise Exception(f"Error streaming from Anthropic API: {str(e)}")
    
    def _get_tool_use_response(self, system_prompt: str, tools: List[Dict[str, Any]], messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Process a response from the Anthropic API that may contain tool use.
        
        This method handles the asynchronous nature of tool use in the Anthropic API.
        It checks for tool use content blocks, implements retry logic if needed, and
        falls back to extracting JSON from text content if no tool use is found.
        
        Args:
            system_prompt: The system prompt to provide context to Claude.
            tools: The tools to make available to Claude.
            messages: A list of messages in the conversation history.
            
        Returns:
            The tool input if found, or a dictionary with an error message if not.
        """
        try:
            # Create the message with specific parameter handling
            # Note: We're ignoring type issues here as the Anthropic API expects these types
            # but mypy doesn't recognize them correctly
            response = self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt,
                tools=tools,  # type: ignore
                messages=messages  # type: ignore
            )

            # Iterate through content blocks to find tool use
            for content_block in response.content:
                if content_block.type == "tool_use":
                    # Convert the input to a dictionary to ensure correct return type
                    if hasattr(content_block, 'input') and content_block.input is not None:
                        # Convert to dict if it's not already a dict
                        if isinstance(content_block.input, dict):
                            return dict(content_block.input)
                        else:
                            # If it's not a dict, create a dict with the input
                            return {"result": str(content_block.input)}
            
            # If we don't have tool use content, try to extract JSON from text response
            # Find the first text block
            text_content = None
            for content_block in response.content:
                if content_block.type == "text":
                    text_content = content_block.text
                    break
                    
            if text_content:
                # Find JSON object in the response
                start_idx = text_content.find('{')
                end_idx = text_content.rfind('}') + 1
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = text_content[start_idx:end_idx]
                    result: Dict[str, Any] = json.loads(json_str)
                    return result
                    
            return {"error": "Could not parse JSON from response"}
                
        except Exception as e:
            return {"error": f"Error parsing JSON: {str(e)}"}
    
    def extract_domain_entities(self, transcript: str) -> Dict[str, Any]:
        """Extract domain entities from a conversation transcript.
        
        This method uses Claude to extract domain entities, attributes, and
        relationships from a conversation transcript using tool use for structured output.
        
        Args:
            transcript: The conversation transcript to extract entities from.
        
        Returns:
            A dictionary containing the extracted domain entities, attributes,
            and relationships.
        """
        system_prompt = """
        You are an expert domain modeling assistant. Your task is to extract domain entities, 
        attributes, and relationships from a conversation transcript between a domain expert and an AI.
        """
        
        # Define the tool schema for structured output
        tools = [
            {
                "name": "extract_domain_model",
                "description": "Extract domain entities, attributes, relationships, and glossary terms from a conversation transcript",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "entities": {
                            "type": "array",
                            "description": "List of domain entities extracted from the transcript",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string", "description": "Name of the entity"},
                                    "description": {"type": "string", "description": "Description of the entity"},
                                    "attributes": {
                                        "type": "array",
                                        "description": "List of attributes for the entity",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "name": {"type": "string", "description": "Name of the attribute"},
                                                "type": {"type": "string", "description": "Data type of the attribute"},
                                                "description": {"type": "string", "description": "Description of the attribute"}
                                            },
                                            "required": ["name", "type"]
                                        }
                                    }
                                },
                                "required": ["name"]
                            }
                        },
                        "relationships": {
                            "type": "array",
                            "description": "List of relationships between entities",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "source": {"type": "string", "description": "Source entity name"},
                                    "target": {"type": "string", "description": "Target entity name"},
                                    "type": {"type": "string", "description": "Type of relationship (oneToOne, oneToMany, manyToMany)"},
                                    "description": {"type": "string", "description": "Description of the relationship"}
                                },
                                "required": ["source", "target"]
                            }
                        },
                        "glossary": {
                            "type": "array",
                            "description": "Glossary of domain-specific terms",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "term": {"type": "string", "description": "The term"},
                                    "definition": {"type": "string", "description": "Definition of the term"},
                                    "context": {"type": "string", "description": "Context where the term is used"}
                                },
                                "required": ["term", "definition"]
                            }
                        }
                    },
                    "required": ["entities"]
                }
            }
        ]
        
        messages = [
            {"role": "user", "content": f"Here is the conversation transcript:\n\n{transcript}"}
        ]
        
        result = self._get_tool_use_response(system_prompt, tools, messages)
        return result
    
    def generate_behavior_scenarios(self, domain_model: Dict[str, Any]) -> Dict[str, Any]:
        """Generate behavior scenarios based on the domain model.
        
        This method uses Claude to generate behavior scenarios based on a
        domain model using tool use for structured output.
        
        Args:
            domain_model: The domain model to generate scenarios for.
        
        Returns:
            A dictionary containing the generated behavior scenarios.
        """
        system_prompt = """You are a behavior-driven development expert. Based on the provided domain model,
        generate behavior scenarios that describe how the system should behave.
        
        For each key entity in the domain model, create a feature with scenarios that cover the main use cases and edge cases. Use the Given-When-Then format for scenarios.
        
        Focus on the most important behaviors first. Be specific and detailed in your scenarios."""
        
        tools = [
            {
                "name": "generate_behavior_scenarios",
                "description": "Generate behavior scenarios for a domain model",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "features": {
                            "type": "array",
                            "description": "List of features with behavior scenarios",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {
                                        "type": "string",
                                        "description": "Title of the feature"
                                    },
                                    "description": {
                                        "type": "string",
                                        "description": "Description of the feature"
                                    },
                                    "scenarios": {
                                        "type": "array",
                                        "description": "List of behavior scenarios for this feature",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "title": {
                                                    "type": "string",
                                                    "description": "Title of the scenario"
                                                },
                                                "given": {
                                                    "type": "string",
                                                    "description": "The context for the scenario"
                                                },
                                                "when": {
                                                    "type": "string",
                                                    "description": "The action being taken"
                                                },
                                                "then": {
                                                    "type": "string",
                                                    "description": "The expected outcome"
                                                }
                                            },
                                            "required": ["title", "given", "when", "then"]
                                        }
                                    }
                                },
                                "required": ["title", "scenarios"]
                            }
                        }
                    },
                    "required": ["features"]
                }
            }
        ]
        
        messages = [
            {"role": "user", "content": f"Here is the domain model:\n\n{json.dumps(domain_model, indent=2, cls=SetEncoder)}"}
        ]
            
        return self._get_tool_use_response(system_prompt, tools, messages)


# Initialize global client
anthropic_adapter = AnthropicClient()
