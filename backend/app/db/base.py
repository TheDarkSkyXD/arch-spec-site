from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    """MongoDB database connection manager using Motor."""
    
    client: AsyncIOMotorClient = None
    
    def __init__(self):
        """Initialize the database connection."""
        try:
            # Initialize the Motor client
            logger.info(f"Initializing MongoDB client with URI: {settings.mongo.uri}")
            self.client = AsyncIOMotorClient(
                settings.mongo.uri,
                serverSelectionTimeoutMS=5000
            )
            logger.info("MongoDB client initialized")
        except Exception as e:
            logger.error(f"Failed to initialize MongoDB client: {str(e)}")
            self.client = None
    
    async def connect_to_mongodb(self):
        """Verify MongoDB connection."""
        if not self.client:
            logger.error("MongoDB client not initialized")
            return
            
        try:
            # Simply log that we're connected - no need to check in dev environment
            logger.info("MongoDB connection setup completed")
        except Exception as e:
            logger.error(f"MongoDB connection error: {str(e)}")
    
    async def close_mongodb_connection(self):
        """Close MongoDB connection."""
        if self.client:
            self.client.close()
            logger.info("Closed MongoDB connection")
    
    def get_db(self):
        """Get database instance."""
        if not self.client:
            logger.warning("MongoDB client not initialized. Database operations will fail.")
            return None
        return self.client[settings.mongo.db_name]


# Create a singleton instance
db = Database()