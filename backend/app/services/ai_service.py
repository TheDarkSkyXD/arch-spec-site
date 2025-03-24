"""Service for interacting with AI models.

This module provides a service for interacting with AI models, including
methods for generating responses, streaming responses, and processing
specifications.
"""

import json
import logging
from typing import List, Dict, Any, Optional, Generator
from anthropic import Anthropic
from anthropic.types import ContentBlockDeltaEvent

from .usage_tracker_interface import UsageTracker

from ..utils.llm_logging import LLMLogger

from ..core.config import settings

# Set up logger at module level
logger = logging.getLogger(__name__)

INTELLIGENT_MODEL = "claude-3-7-sonnet-20250219"
BACKUP_MODEL = "claude-3-5-sonnet-20241022"
FAST_MODEL = "claude-3-5-haiku-20241022"

class SetEncoder(json.JSONEncoder):
    """JSON encoder that can handle sets."""
    
    def default(self, obj: Any) -> Any:
        """Convert sets to lists for JSON serialization."""
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)


class AnthropicClient():
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
    
    def __init__(self, llm_logger: Optional[LLMLogger] = None,
                 usage_tracker: Optional[UsageTracker] = None) -> None:
        """Initialize the Anthropic client with an optional logger."""
        self.llm_logger = llm_logger
        self.usage_tracker = usage_tracker
        try:
            self.client = Anthropic(api_key=settings.anthropic.api_key)
            self.model = settings.anthropic.model
            self.max_tokens = settings.anthropic.max_tokens
            self.temperature = settings.anthropic.temperature
            logger.info("Anthropic client initialized successfully")
        except Exception as e:
            # Log the error but don't crash
            logger.error(f"Error initializing Anthropic client: {str(e)}")
            # Set client to None to indicate it's not available
            self.client = None
            self.model = settings.anthropic.model
            self.max_tokens = settings.anthropic.max_tokens
            self.temperature = settings.anthropic.temperature
            
    def _process_response(
        self, 
        response: Any, 
        response_type: str, 
        metadata: Dict[str, Any]
    ) -> None:
        """Log response and track usage for successful API calls."""
        # Extract usage statistics from response
        input_tokens = 0
        output_tokens = 0
        if hasattr(response, 'usage'):
            input_tokens = getattr(response.usage, 'input_tokens', 0)
            output_tokens = getattr(response.usage, 'output_tokens', 0)
            metadata["usage"] = {
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": input_tokens + output_tokens
            }
        
        # Log the response if logger is available
        if self.llm_logger:
            # Convert response to string for logging
            if hasattr(response, 'model_dump_json'):
                response_str = response.model_dump_json()
            else:
                response_str = str(response)
                
            self.llm_logger.log_response(
                response_type=response_type,
                raw_response=response_str,
                project_id=metadata.get("project_id", "unknown"),
                metadata=metadata
            )
        
        # Track usage if tracker is available and user_id is provided
        if (self.usage_tracker and 
            "user_id" in metadata and 
            metadata["user_id"] and
            input_tokens > 0):
            
            self.usage_tracker.track_usage(
                user_id=metadata["user_id"],
                model=metadata.get("model", self.model),
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                operation_type=response_type,
                metadata={
                    "project_id": metadata.get("project_id", "unknown"),
                    "operation_type": response_type
                }
            )
    
    async def _check_sufficient_credits(
        self,
        user_id: str,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        has_tools: bool = False
    ) -> Dict[str, Any]:
        """Check if a user has sufficient credits for an operation."""
        if not self.usage_tracker:
            return {"has_sufficient_credits": True}
        
        # Estimate input tokens (approximate calculation)
        estimated_input_tokens = 0
        for msg in messages:
            # Roughly 4 characters per token
            estimated_input_tokens += len(msg.get("content", "")) // 4
        
        if system:
            estimated_input_tokens += len(system) // 4
        
        # Tools increase token count
        if has_tools:
            # Add a buffer for tool definitions
            estimated_input_tokens += 500
        
        # Estimate output tokens (typical response might be 1/4 to 1/2 of input)
        estimated_output_tokens = min(estimated_input_tokens // 2, self.max_tokens)
        
        # Check if user has sufficient credits
        return await self.usage_tracker.check_credits(
            user_id=user_id,
            estimated_input_tokens=estimated_input_tokens,
            estimated_output_tokens=estimated_output_tokens,
            model=model if model else self.model
        )
    
    async def generate_response(self, messages: List[Dict[str, str]], system: Optional[str] = None, 
                          model: Optional[str] = None,
                          log_metadata: Optional[Dict[str, Any]] = None,
                          response_type: Optional[str] = None,
                          check_credits: bool = True) -> str:
        """Generate a response from Claude given a conversation history.
        
        Args:
            messages: A list of messages in the conversation history.
                Each message should have a 'role' (either 'user' or 'assistant')
                and 'content' (the text of the message).
            system: Optional system prompt to provide context to Claude.
            model: Optional model to use for generating responses.
            
        Returns:
            The generated response from Claude.
        
        Raises:
            Exception: If there is an error calling the Anthropic API.
        """
        if not self.client:
            return "Error: Anthropic client not available"
        
        # Prepare metadata with default values
        metadata = self._prepare_log_metadata(messages, system, model, log_metadata)
        model_to_use = model if model else self.model
        
        # Check credits before making the call if requested
        if check_credits and self.usage_tracker and "user_id" in metadata and metadata["user_id"]:
            credit_check = await self._check_sufficient_credits(metadata["user_id"], messages, system, model_to_use)
            logger.info(f"Credit check result: {credit_check}")
            if not credit_check["has_sufficient_credits"]:
                remaining_credits = credit_check.get("remaining_credits", 0)
                estimated_cost = credit_check.get("estimated_cost", 0)
                error_msg = f"Insufficient credits. You have {remaining_credits} credits remaining, but this operation requires approximately {estimated_cost} credits."
                return error_msg
            
        try:
            params: Dict[str, Any] = {
                "model": model if model else self.model,
                "max_tokens": 8192 if model != INTELLIGENT_MODEL else self.max_tokens,
                "temperature": self.temperature,
                "messages": messages
            }
            
            if system:
                params["system"] = system
                
            response = self.client.messages.create(**params)
            result = ""
            # Extract text from response
            if response.content and len(response.content) > 0 and hasattr(response.content[0], 'text'):
                result = str(response.content[0].text)

            # Log the response and track usage
            self._process_response(response, response_type, metadata)

            return result
        except Exception as e:
            # Log the error
            self._log_error(
                error=e,
                response_type=response_type,
                metadata=self._prepare_log_metadata(messages, system, model, log_metadata)
            )
            raise Exception(f"Error calling Anthropic API: {str(e)}")
    
    async def stream_response(
        self, 
        messages: List[Dict[str, str]], 
        system: Optional[str] = None, 
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: str = "stream_response",
        check_credits: bool = True
    ) -> Generator[str, None, None]: # type: ignore
        """Stream a response from Claude given a conversation history.
        
        Args:
            messages: A list of messages in the conversation history.
                Each message should have a 'role' (either 'user' or 'assistant')
                and 'content' (the text of the message).
            system: Optional system prompt to provide context to Claude.
            model: Optional model to use for generating responses.
            log_metadata: Optional metadata to include in the logs.
            response_type: The type of response for logging purposes.
            
        Yields:
            Chunks of the generated response from Claude.
        
        Raises:
            Exception: If there is an error streaming from the Anthropic API.
            
        Sample Usage:
        ```python
        # Stream a response
        for chunk in client.stream_response(
            messages,
            system_message,
            FAST_MODEL,
            log_metadata={
                "project_id": request.project_id,
                "user_id": current_user.get("firebase_uid"),
                # Other relevant metadata
            },
            response_type="streamed_explanation"
        ):
            # Process each chunk (e.g., send to frontend)
            yield chunk
        ```
        """
        if not self.client:
            yield "Error: Anthropic client not available"
            return
        
        # Prepare metadata with default values
        metadata = self._prepare_log_metadata(messages, system, model, log_metadata)
        model_to_use = model if model else self.model
        
        # Check credits before making the call if requested
        if check_credits and self.usage_tracker and "user_id" in metadata and metadata["user_id"]:
            credit_check = await self._check_sufficient_credits(metadata["user_id"], messages, system, model_to_use)
            if not credit_check["has_sufficient_credits"]:
                error_msg = f"Insufficient credits. You have {credit_check['remaining_credits']} credits remaining, but this operation requires approximately {credit_check['estimated_cost']} credits."
                yield error_msg
                return
            
        try:
            params: Dict[str, Any] = {
                "model": model if model else self.model,
                "max_tokens": 8192 if model != INTELLIGENT_MODEL else self.max_tokens,
                "temperature": self.temperature,
                "messages": messages,
                "stream": True
            }
            
            if system:
                params["system"] = system
            
            # Collect the full response for logging
            full_response = ""
            response_obj = None
            
            with self.client.messages.stream(**params) as stream:
                # Get the response object to extract metadata later
                response_obj = stream.response
                
                for chunk in stream:
                    if isinstance(chunk, ContentBlockDeltaEvent) and chunk.delta.text:
                        chunk_text = chunk.delta.text
                        full_response += chunk_text
                        yield chunk_text
            
            # Process the complete response after streaming is done
            if response_obj:
                # Create a complete response object for logging
                response_with_content = response_obj
                response_with_content.content = [{"type": "text", "text": full_response}]
                self._process_response(response_with_content, response_type, metadata)
                
        except Exception as e:
            # Log the error
            if self.llm_logger:
                metadata = self._prepare_log_metadata(messages, system, model, log_metadata)
                self._log_error(e, f"{response_type}_error", metadata)
                
            raise Exception(f"Error streaming from Anthropic API: {str(e)}")
        
    def _extract_tool_use_or_json(self, response) -> Dict[str, Any]:
        """Helper to extract tool use from a response or fall back to JSON in text."""
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
    
    async def get_tool_use_response(self, system_prompt: str, tools: List[Dict[str, Any]], 
                              messages: List[Dict[str, str]], model: Optional[str] = None,
                              log_metadata: Optional[Dict[str, Any]] = None,
                              response_type: Optional[str] = "tool_use_response",
                              check_credits: bool = True) -> Dict[str, Any]:
        """Process a response from the Anthropic API that may contain tool use.
        
        This method handles the asynchronous nature of tool use in the Anthropic API.
        It checks for tool use content blocks, implements retry logic if needed, and
        falls back to extracting JSON from text content if no tool use is found.
        
        Args:
            system_prompt: The system prompt to provide context to Claude.
            tools: The tools to make available to Claude.
            messages: A list of messages in the conversation history.
            model: Optional model to use for generating responses.

        Returns:
            The tool input if found, or a dictionary with an error message if not.
        """
        
        # Prepare metadata
        metadata = self._prepare_tool_log_metadata(messages, system_prompt, tools, model, log_metadata)
        model_to_use = model if model else self.model
        
        # Check credits before making the call if requested
        if check_credits and self.usage_tracker and "user_id" in metadata and metadata["user_id"]:
            credit_check = await self._check_sufficient_credits(
                metadata["user_id"], 
                messages, 
                system_prompt, 
                model_to_use, 
                has_tools=True
            )
            if not credit_check["has_sufficient_credits"]:
                return {
                    "error": f"Insufficient credits. You have {credit_check['remaining_credits']} credits remaining, but this operation requires approximately {credit_check['estimated_cost']} credits."
                }
        
        try:
            params = {
                "model": model if model else self.model,
                "max_tokens": 8192 if model != INTELLIGENT_MODEL else self.max_tokens,
                "temperature": self.temperature,
                "system": system_prompt,
                "tools": tools,
                "messages": messages,
            }
            
            if model == INTELLIGENT_MODEL:
                params["betas"] = ["token-efficient-tools-2025-02-19"]
                logger.info(f"Params using Claude 3.7 and token-efficient-tools-2025-02-19: {params}")
                
                response = self.client.beta.messages.create(**params)
            else:
                logger.info(f"Params: {params}")
                response = self.client.messages.create(**params)
                
            # Extract tool use or process text content
            result = self._extract_tool_use_or_json(response)
            
            # Log the response and track usage
            self._process_response(response, response_type, metadata)
            
            return result
                
        except Exception as e:
            # Log the error
            self._log_error(
                error=e,
                response_type=response_type,
                metadata=self._prepare_tool_log_metadata(messages, system_prompt, tools, model, log_metadata)
            )
            return {"error": f"Error parsing JSON: {str(e)}"}
    
    async def process_specification(self, spec_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the specification data using Claude to enhance and fill gaps.
        
        Args:
            spec_data: The specification data to process.
            
        Returns:
            The processed specification data with AI-generated enhancements.
        """
        if not self.client:
            logger.error("Cannot process specification: Anthropic client not available")
            return spec_data
            
        try:
            # Generate a prompt for Claude
            prompt = self._generate_prompt(spec_data)
            
            # Call Claude
            messages = [{"role": "user", "content": prompt}]
            system = "You are ArchSpec, an AI software architect. Generate detailed software specifications based on requirements."
            
            response = await self.generate_response(messages, system)
            
            # Parse and integrate the AI-generated content
            return self._parse_ai_content(response, spec_data)
            
        except Exception as e:
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
        
    def _prepare_log_metadata(
        self, 
        messages: List[Dict[str, str]], 
        system: Optional[str], 
        model: Optional[str],
        user_metadata: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Prepare metadata for logging."""
        metadata = user_metadata or {}
        metadata.update({
            "model": model if model else self.model,
            "system_message": system,
            "user_message": messages[-1]["content"] if messages and messages[-1]["role"] == "user" else None,
        })
        return metadata
    
    def _prepare_tool_log_metadata(
        self, 
        messages: List[Dict[str, str]], 
        system_prompt: str, 
        tools: List[Dict[str, Any]], 
        model: Optional[str],
        user_metadata: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Prepare metadata for tool use logging."""
        metadata = user_metadata or {}
        metadata.update({
            "model": model if model else self.model,
            "system_message": system_prompt,
            "user_message": messages[-1]["content"] if messages and messages[-1]["role"] == "user" else None,
            "tools": tools,
        })
        return metadata
    
    def _log_response(
        self, 
        response: Any, 
        response_type: str, 
        metadata: Dict[str, Any]
    ) -> None:
        """Log a successful response if a logger is provided."""
        if not self.llm_logger:
            return
            
        # Extract usage info from response
        if hasattr(response, 'usage'):
            metadata["usage"] = response.usage
        
        # Get the response as a string for logging
        response_str = response.model_dump_json() if hasattr(response, 'model_dump_json') else str(response)
        
        # Log the response
        self.llm_logger.log_response(
            response_type=response_type,
            raw_response=response_str,
            project_id=metadata.get("project_id", "unknown"),
            metadata=metadata
        )
    
    def _log_error(
        self, 
        error: Exception, 
        response_type: str, 
        metadata: Dict[str, Any]
    ) -> None:
        """Log an error if a logger is provided."""
        if not self.llm_logger:
            return
            
        # Add error information to metadata
        metadata["error"] = str(error)
        
        # Log the error
        self.llm_logger.log_response(
            response_type=f"{response_type}_error",
            raw_response=f"Error: {str(error)}",
            project_id=metadata.get("project_id", "unknown"),
            metadata=metadata
        )