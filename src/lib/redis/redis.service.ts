import { createClient, RedisClientType } from 'redis';
import env from '../../config/env.config';
import { logger } from '../utils';

let client: RedisClientType;

export async function initRedis(): Promise<RedisClientType> {
  client = createClient({ url: env.REDIS_URL });

  client.on('error', err => {
    logger.error('❌ Redis Client Error:', err);
    throw new Error(err);
  });

  await client.connect();
  logger.info('✅ Connected to Redis');
  return client;
}

export function getRedisClient(): RedisClientType {
  if (!client) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return client;
}
