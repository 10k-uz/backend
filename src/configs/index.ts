export * from './appwrite';

import { config } from 'dotenv';

config();

// hash configs
export const hash_config = {
  SALT_ROUNDS: process.env.SALT_ROUNDS,
};

// jwt configs
export const jwt_config = {
  access_secret: process.env.ACCESS_TOKEN_SECRET || 'for_development_access',
  refresh_secret: process.env.REFRESH_TOKEN_SECRET || 'for_development_refresh',
  secretKey: process.env.ACCESS_TOKEN_SECRET || 'for_development',
  expiresIn: '24h',
};

export const captchaExpireDate = 15 * 60 * 1000;
