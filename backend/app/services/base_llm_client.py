"""Base implementation for LLM clients.

This module provides a base implementation for LLM clients that handles
common functionality such as logging, usage tracking, and error handling.
"""

import json
import logging
from typing import List, Dict, Any, Optional, Generator, AsyncGenerator
import asyncio

from .llm_client_interface import LLMClientInterface
from .usage_tracker_interface import UsageTracker
from ..utils.llm_logging import LLMLogger

# Set up logger at module level
logger = logging.getLogger(__name__)


class SetEncoder(json.JSONEncoder):
    """JSON encoder that can handle sets."""

    def default(self, obj: Any) -> Any:
        """Convert sets to lists for JSON serialization."""
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)


class BaseLLMClient(LLMClientInterface):
    """Base implementation for LLM clients.

    This class implements common functionality for LLM clients such as
    logging, usage tracking, and error handling.

    Attributes:
        llm_logger: Logger for LLM responses.
        usage_tracker: Tracker for LLM usage.
        model: The default model to use.
        max_tokens: The maximum number of tokens to generate.
        temperature: The temperature to use for generating responses.
        provider_name: The name of the LLM provider.
    """

    def __init__(
        self,
        llm_logger: Optional[LLMLogger] = None,
        usage_tracker: Optional[UsageTracker] = None,
        model: str = None,
        max_tokens: int = 4000,
        temperature: float = 0.7,
        provider_name: str = "unknown",
    ) -> None:
        """Initialize the base LLM client."""
        self.llm_logger = llm_logger
        self.usage_tracker = usage_tracker
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.client = None
        self.provider_name = provider_name

    def _process_response(
        self, response: Any, response_type: str, metadata: Dict[str, Any]
    ) -> None:
        """Log response and track usage for successful API calls."""
        # Extract usage statistics from response
        input_tokens = 0
        output_tokens = 0
        if hasattr(response, "usage"):
            input_tokens = getattr(response.usage, "input_tokens", 0)
            output_tokens = getattr(response.usage, "output_tokens", 0)
            metadata["usage"] = {
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": input_tokens + output_tokens,
            }

        # Add provider information to metadata
        metadata["provider"] = self.provider_name

        # Log the response if logger is available
        if self.llm_logger:
            # Convert response to string for logging
            if hasattr(response, "model_dump_json"):
                response_str = response.model_dump_json()
            else:
                response_str = str(response)

            self.llm_logger.log_response(
                response_type=response_type,
                raw_response=response_str,
                project_id=metadata.get("project_id", "unknown"),
                metadata=metadata,
            )

        # Track usage if tracker is available and user_id is provided
        if (
            self.usage_tracker
            and "user_id" in metadata
            and metadata["user_id"]
            and input_tokens > 0
        ):

            self.usage_tracker.track_usage(
                user_id=metadata["user_id"],
                model=metadata.get("model", self.model),
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                operation_type=response_type,
                metadata={
                    "project_id": metadata.get("project_id", "unknown"),
                    "operation_type": response_type,
                    "provider": self.provider_name,
                },
            )

    async def _check_sufficient_credits(
        self,
        user_id: str,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        use_token_api: bool = True,
    ) -> Dict[str, Any]:
        """Check if a user has sufficient credits for an operation."""
        if not self.usage_tracker:
            return {"has_sufficient_credits": True}

        # Estimate input tokens (approximate calculation)
        estimated_input_tokens = 0
        model_to_use = model if model else self.model

        if use_token_api and self.client:
            # Use the accurate token counting API
            try:
                token_count = self.count_tokens(
                    messages=messages, system=system, model=model_to_use, tools=tools
                )
                estimated_input_tokens = token_count.get("input_tokens", 0)

                logger.info(f"Token count from API: {estimated_input_tokens} for user {user_id}")

                # If there was an error with token counting, fall back to estimation
                if estimated_input_tokens == 0 and "error" in token_count:
                    logger.warning(
                        f"Token count API error: {token_count['error']}. Falling back to estimation."
                    )
                    use_token_api = False
            except Exception as e:
                logger.warning(
                    f"Error using token count API: {str(e)}. Falling back to estimation."
                )
                use_token_api = False

        if not use_token_api or estimated_input_tokens == 0:
            # Fallback to estimation method
            estimated_input_tokens = 0

            # Estimate message tokens (approximately 4 chars per token)
            for msg in messages:
                content = msg.get("content", "")
                # Handle content as string or as a list of blocks
                if isinstance(content, str):
                    estimated_input_tokens += len(content) // 4
                elif isinstance(content, list):
                    # Handle content blocks (text, image, etc.)
                    for block in content:
                        if isinstance(block, dict):
                            block_type = block.get("type", "")
                            if block_type == "text":
                                estimated_input_tokens += len(block.get("text", "")) // 4
                            elif block_type == "image":
                                # Images typically use more tokens
                                estimated_input_tokens += 1000  # Rough estimate for image

            # Add system prompt tokens
            if system:
                estimated_input_tokens += len(system) // 4

            # Add tokens for tools (rough estimate)
            if tools:
                tool_json = json.dumps(tools)
                estimated_input_tokens += len(tool_json) // 4
                # Add buffer for tool processing
                estimated_input_tokens += 200  # Additional overhead

            logger.info(f"Estimated token count: {estimated_input_tokens} for user {user_id}")

        # Estimate output tokens (typical response might be 1/4 to 1/2 of input)
        # For tools, use a smaller ratio since tool outputs are often more concise
        if tools:
            estimated_output_tokens = min(estimated_input_tokens // 3, self.max_tokens)
        else:
            estimated_output_tokens = min(estimated_input_tokens // 2, self.max_tokens)

        # Check if user has sufficient credits
        return await self.usage_tracker.check_credits(
            user_id=user_id,
            estimated_input_tokens=estimated_input_tokens,
            estimated_output_tokens=estimated_output_tokens,
            model=model_to_use,
        )

    def _prepare_log_metadata(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str],
        model: Optional[str],
        user_metadata: Optional[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Prepare metadata for logging."""
        metadata = user_metadata or {}
        metadata.update(
            {
                "model": model if model else self.model,
                "system_message": system,
                "user_message": (
                    messages[-1]["content"] if messages and messages[-1]["role"] == "user" else None
                ),
            }
        )
        return metadata

    def _prepare_tool_log_metadata(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        tools: List[Dict[str, Any]],
        model: Optional[str],
        user_metadata: Optional[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Prepare metadata for tool use logging."""
        metadata = user_metadata or {}
        metadata.update(
            {
                "model": model if model else self.model,
                "system_message": system_prompt,
                "user_message": (
                    messages[-1]["content"] if messages and messages[-1]["role"] == "user" else None
                ),
                "tools": tools,
            }
        )
        return metadata

    def _log_error(self, error: Exception, response_type: str, metadata: Dict[str, Any]) -> None:
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
            metadata=metadata,
        )

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
            json_start = ai_content.find("{")
            json_end = ai_content.rfind("}")

            if json_start != -1 and json_end != -1:
                json_content = ai_content[json_start : json_end + 1]
                ai_data = json.loads(json_content)

                # Merge with original spec
                enhanced_spec = original_spec.copy()

                # Add AI-generated content
                if "architecture_diagram" in ai_data:
                    enhanced_spec["architecture"] = enhanced_spec.get("architecture", {})
                    enhanced_spec["architecture"]["diagram"] = ai_data["architecture_diagram"]

                if "api_endpoints" in ai_data:
                    enhanced_spec["api_endpoints"] = ai_data["api_endpoints"]

                if "data_models" in ai_data:
                    enhanced_spec["data_model"] = enhanced_spec.get("data_model", {})
                    enhanced_spec["data_model"]["entities"] = ai_data["data_models"]

                if "file_structure" in ai_data:
                    enhanced_spec["implementation"] = enhanced_spec.get("implementation", {})
                    enhanced_spec["implementation"]["file_structure"] = ai_data["file_structure"]

                return enhanced_spec

            return original_spec

        except Exception as e:
            print(f"Error parsing AI content: {str(e)}")
            return original_spec

    # Abstract method implementations (to be overridden by concrete classes)
    def count_tokens(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, int]:
        """Count tokens for a message."""
        raise NotImplementedError("Subclass must implement abstract method")

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: Optional[str] = None,
        check_credits: bool = True,
        use_token_api_for_estimation: bool = True,
    ) -> str:
        """Generate a response from the LLM."""
        raise NotImplementedError("Subclass must implement abstract method")

    async def stream_response(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: str = "stream_response",
        check_credits: bool = True,
        use_token_api_for_estimation: bool = True,
    ) -> AsyncGenerator[str, None]:
        """Stream a response from the LLM."""
        raise NotImplementedError("Subclass must implement abstract method")

    async def get_tool_use_response(
        self,
        system_prompt: str,
        tools: List[Dict[str, Any]],
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: Optional[str] = "tool_use_response",
        check_credits: bool = True,
        use_token_api_for_estimation: bool = True,
    ) -> Dict[str, Any]:
        """Get a tool use response from the LLM."""
        raise NotImplementedError("Subclass must implement abstract method")

    async def process_specification(self, spec_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a specification using the LLM."""
        if not self.client:
            logger.error("Cannot process specification: Client not available")
            return spec_data

        try:
            # Generate a prompt for LLM
            prompt = self._generate_prompt(spec_data)

            # Call LLM
            messages = [{"role": "user", "content": prompt}]
            system = "You are ArchSpec, an AI software architect. Generate detailed software specifications based on requirements."

            response = await self.generate_response(messages, system)

            # Parse and integrate the AI-generated content
            return self._parse_ai_content(response, spec_data)

        except Exception as e:
            logger.error(f"Error in AI processing: {str(e)}")
            # Return original spec data if AI processing fails
            return spec_data
