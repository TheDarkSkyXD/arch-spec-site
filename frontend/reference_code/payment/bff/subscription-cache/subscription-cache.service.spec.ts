import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionCacheService } from './subscription-cache.service';
import { CodefrostRedisService } from '@codefrost/bff-lib';

describe('SubscriptionCacheService', () => {
  let service: SubscriptionCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionCacheService,
        {
          provide: CodefrostRedisService,
          useValue: {
            get: jest.fn().mockResolvedValue({}),
            set: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionCacheService>(SubscriptionCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
