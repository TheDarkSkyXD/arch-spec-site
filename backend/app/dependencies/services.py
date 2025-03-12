"""Service dependencies for FastAPI.

This module provides dependencies for services used in FastAPI routes.
"""

from ..services.generator_service import GeneratorService
from ..services.artifact_service import ArtifactService

# Create singleton instances of services
_generator_service = GeneratorService()
_artifact_service = ArtifactService(generator_service=_generator_service)


async def get_generator_service() -> GeneratorService:
    """Get the generator service singleton.
    
    Returns:
        The generator service instance.
    """
    return _generator_service


async def get_artifact_service() -> ArtifactService:
    """Get the artifact service singleton.
    
    Returns:
        The artifact service instance.
    """
    return _artifact_service 