// src/config/configuration.ts

export const configuration = () => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    enableTls: process.env.REDIS_ENABLE_TLS === 'true',
    additionalOptions: {}, // Add any additional Redis options here
  },
  THROTTLE_TTL: parseInt(process.env.THROTTLE_TTL, 10) || 60,
  THROTTLE_LIMIT: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
  // Add other configurations as needed
});
