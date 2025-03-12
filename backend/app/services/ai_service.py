"""Service for interacting with AI models.

This module provides a service for interacting with AI models, including
methods for generating responses, streaming responses, and processing
specifications.
"""

import json
from typing import List, Dict, Any, Optional, Generator
import anthropic
from anthropic.types import ContentBlockDeltaEvent, MessageDeltaEvent

from ..core.config import settings
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
        try:
            # Basic initialization without any extra parameters
            self.client = anthropic.Anthropic(api_key=settings.anthropic.api_key)
            self.model = settings.anthropic.model
            self.max_tokens = settings.anthropic.max_tokens
            self.temperature = settings.anthropic.temperature
        except Exception as e:
            # Log the error but don't crash
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error initializing Anthropic client: {str(e)}")
            # Set client to None to indicate it's not available
            self.client = None
            self.model = settings.anthropic.model
            self.max_tokens = settings.anthropic.max_tokens
            self.temperature = settings.anthropic.temperature
    
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
        if not self.client:
            return "Error: Anthropic client not available"
            
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
        if not self.client:
            yield "Error: Anthropic client not available"
            return
            
        try:
            params: Dict[str, Any] = {
                "model": self.model,
                "max_tokens": self.max_tokens,
                "temperature": self.temperature,
                "messages": messages,
                "stream": True
            }
            
            if system:
                params["system"] = system
                
            with self.client.messages.stream(**params) as stream:
                for chunk in stream:
                    if isinstance(chunk, ContentBlockDeltaEvent) and chunk.delta.text:
                        yield chunk.delta.text
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
    
    async def process_specification(self, spec_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the specification data using Claude to enhance and fill gaps.
        
        Args:
            spec_data: The specification data to process.
            
        Returns:
            The processed specification data with AI-generated enhancements.
        """
        if not self.client:
            import logging
            logger = logging.getLogger(__name__)
            logger.error("Cannot process specification: Anthropic client not available")
            return spec_data
            
        try:
            # Generate a prompt for Claude
            prompt = self._generate_prompt(spec_data)
            
            # Call Claude
            messages = [{"role": "user", "content": prompt}]
            system = "You are ArchSpec, an AI software architect. Generate detailed software specifications based on requirements."
            
            response = self.generate_response(messages, system)
            
            # Parse and integrate the AI-generated content
            return self._parse_ai_content(response, spec_data)
            
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in AI processing: {str(e)}")
            # Return original spec data if AI processing fails
            return spec_data
    
    def _generate_prompt(self, spec_data: Dict[str, Any]) -> str:
        """Generate a prompt for the AI based on specification data.
        
        Args:
            spec_data: The specification data to generate a prompt for.
            
        Returns:
            A prompt for the AI.
        """
        # A simplified prompt for the bootstrap version
        prompt = f"""
        Based on the following software specification:

        Project Type: {spec_data.get('requirements', {}).get('project_type', 'Web Application')}

        Functional Requirements:
        {json.dumps(spec_data.get('requirements', {}).get('functional', []), indent=2, cls=SetEncoder)}

        Non-Functional Requirements:
        {json.dumps(spec_data.get('requirements', {}).get('non_functional', []), indent=2, cls=SetEncoder)}

        Tech Stack:
        {json.dumps(spec_data.get('requirements', {}).get('tech_stack', {}), indent=2, cls=SetEncoder)}

        Please generate:

        1. A system architecture diagram in Mermaid syntax
        2. A list of API endpoints with their methods, inputs, and outputs
        3. Data models for the key entities in the system
        4. A recommended file structure for implementation

        Format the output as JSON with the following structure:
        {{
            "architecture_diagram": "mermaid syntax here",
            "api_endpoints": [...],
            "data_models": [...],
            "file_structure": [...]
        }}
        """
        return prompt
    
    def _parse_ai_content(self, ai_content: str, original_spec: Dict[str, Any]) -> Dict[str, Any]:
        """Parse the AI-generated content and integrate with original spec.
        
        Args:
            ai_content: The AI-generated content to parse.
            original_spec: The original specification data to integrate with.
            
        Returns:
            The integrated specification data.
        """
        try:
            # Extract JSON content from the AI response
            json_start = ai_content.find('{')
            json_end = ai_content.rfind('}')

            if json_start != -1 and json_end != -1:
                json_content = ai_content[json_start:json_end+1]
                ai_data = json.loads(json_content)

                # Merge with original spec
                enhanced_spec = original_spec.copy()

                # Add AI-generated content
                if 'architecture_diagram' in ai_data:
                    enhanced_spec['architecture'] = enhanced_spec.get('architecture', {})
                    enhanced_spec['architecture']['diagram'] = ai_data['architecture_diagram']

                if 'api_endpoints' in ai_data:
                    enhanced_spec['api_endpoints'] = ai_data['api_endpoints']

                if 'data_models' in ai_data:
                    enhanced_spec['data_model'] = enhanced_spec.get('data_model', {})
                    enhanced_spec['data_model']['entities'] = ai_data['data_models']

                if 'file_structure' in ai_data:
                    enhanced_spec['implementation'] = enhanced_spec.get('implementation', {})
                    enhanced_spec['implementation']['file_structure'] = ai_data['file_structure']

                return enhanced_spec

            return original_spec

        except Exception as e:
            print(f"Error parsing AI content: {str(e)}")
            return original_spec 