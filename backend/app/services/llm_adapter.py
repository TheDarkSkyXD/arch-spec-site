"""Base interface for LLM adapters.

This module provides an abstract base class for LLM adapters that can be
implemented for different providers like Anthropic and OpenAI.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Generator


class LLMAdapter(ABC):
    """Abstract base class for LLM adapters."""
    
    @abstractmethod
    def generate_response(self, messages: List[Dict[str, str]], system: Optional[str] = None) -> str:
        """Generate a response from the LLM.
        
        Args:
            messages: A list of messages in the conversation history.
            system: Optional system prompt to provide context.
            
        Returns:
            The generated response from the LLM.
        """
        pass
    
    @abstractmethod
    def stream_response(self, messages: List[Dict[str, str]], system: Optional[str] = None) -> Generator[str, None, None]:
        """Stream a response from the LLM.
        
        Args:
            messages: A list of messages in the conversation history.
            system: Optional system prompt to provide context.
            
        Yields:
            Chunks of the generated response from the LLM.
        """
        pass 