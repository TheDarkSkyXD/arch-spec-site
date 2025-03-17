import { Module } from '@nestjs/common';
import { SubscriptionCacheService } from './subscription-cache.service';
import { ThRedisModule } from '../redis/redis.module';

@Module({
  imports: [ThRedisModule],
  providers: [SubscriptionCacheService],
  exports: [SubscriptionCacheService],
})
export class SubscriptionCacheModule {}
