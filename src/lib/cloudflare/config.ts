export const CLOUDFLARE_CONFIG = {
  ACCOUNT_ID: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID,
  API_TOKEN: import.meta.env.VITE_CLOUDFLARE_API_TOKEN,
  STREAM_DOMAIN: import.meta.env.VITE_CLOUDFLARE_STREAM_DOMAIN,
  MAX_RETRIES: 5, // Increased from 3 to 5
  CHUNK_SIZE: 5 * 1024 * 1024, // Reduced from 10MB to 5MB chunks
  TIMEOUT: 60000, // Increased from 30s to 60s
  MAX_FILE_SIZE: 500 * 1024 * 1024 // 500MB
};