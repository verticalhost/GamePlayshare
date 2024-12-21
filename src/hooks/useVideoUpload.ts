import { useState, useCallback } from 'react';
import { getUploadUrl } from '../lib/cloudflare/api';
import { validateFile, uploadFile } from '../lib/cloudflare/upload';

export const useVideoUpload = (
  onComplete: (videoId: string) => void,
  onError: (error: string) => void
) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onError(validationError);
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const { uploadUrl, uid } = await getUploadUrl();
      
      await uploadFile(file, uploadUrl, (progress) => {
        setProgress(progress);
      });

      onComplete(uid);
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [onComplete, onError]);

  return {
    handleUpload,
    uploading,
    progress,
    error,
    setError
  };
};