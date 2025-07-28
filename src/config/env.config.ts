import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '.env' });

// Define schema using zod for validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default(3800),
  HOST: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number).default(5434),
  DB_TYPE: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST_OLD: z.string(),
  DB_PORT_OLD: z.string().transform(Number).default(3306),
  DB_TYPE_OLD: z.string(),
  DB_NAME_OLD: z.string(),
  DB_USER_OLD: z.string(),
  FLW_TEST_KEY: z.string(),
  FLW_LIVE_KEY: z.string(),
  DB_PASSWORD_OLD: z.string(),
  // DB_URI: z.string(),
  LOG_FORMAT: z.string(),
  ADMIN_PASSWORD: z.string(),
  JWT_SECRET_KEY: z.string(),
  JWT_EXPIRATION_HOURS: z
    .string()
    .refine(value => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'JWT_EXPIRATION_HOURS must be a positive number',
    })
    .transform(Number),
});

// Parse and validate the environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.log('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1); // Exit the application if environment validation fails
}

const env = parsedEnv.data;

export default env;
