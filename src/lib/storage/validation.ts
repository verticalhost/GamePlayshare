import { STORAGE_CONFIG } from './config';

export function validateImageFile(file: File): string | null {
  if (!STORAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, or WebP)';
  }
  
  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    return 'File size must be less than 5MB';
  }
  
  return null;
}