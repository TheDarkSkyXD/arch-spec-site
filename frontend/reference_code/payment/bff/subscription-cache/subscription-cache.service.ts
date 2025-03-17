import { Injectable } from '@nestjs/common';
import { CodefrostRedisService, logger } from '@codefrost/bff-lib';
import { SUBSCRIPTION_CACHE_KEY } from '../subscription/subscription.constants';

@Injectable()
export class SubscriptionCacheService {
  constructor(private readonly redisService: CodefrostRedisService) {}

  async clearSubscriptionCache(userEmail: string) {
    logger.info(`Clearing subscription cache for user: ${userEmail}`);
    try {
      await this.redisService.del(`${SUBSCRIPTION_CACHE_KEY}-${userEmail}`);
    } catch (error) {
      logger.error(`Error clearing subscription cache for user: ${userEmail}`);
      return;
    }
  }
}
