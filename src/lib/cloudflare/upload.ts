import { CLOUDFLARE_CONFIG } from './config';

export function validateFile(file: File): string | null {
  if (!file.type.startsWith('video/')) {
    return 'Please upload a video file';
  }
  if (file.size > CLOUDFLARE_CONFIG.MAX_FILE_SIZE) {
    return 'File size must be less than 500MB';
  }
  return null;
}

export function uploadChunk(
  chunk: Blob,
  start: number,
  end: number,
  total: number,
  uploadUrl: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const chunkProgress = e.loaded / e.total;
        const totalProgress = ((start + (end - start) * chunkProgress) / total) * 100;
        window.dispatchEvent(new CustomEvent('uploadProgress', {
          detail: { progress: Math.round(totalProgress) }
        }));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      const error = new Error('Network error occurred');
      error.name = 'NetworkError';
      reject(error);
    };

    xhr.onabort = () => {
      const error = new Error('Upload cancelled');
      error.name = 'AbortError';
      reject(error);
    };

    xhr.ontimeout = () => {
      const error = new Error('Upload timed out');
      error.name = 'TimeoutError';
      reject(error);
    };

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Range', `bytes ${start}-${end - 1}/${total}`);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.timeout = CLOUDFLARE_CONFIG.TIMEOUT;

    try {
      xhr.send(chunk);
    } catch (error: any) {
      const networkError = new Error('Failed to send chunk: ' + error.message);
      networkError.name = 'NetworkError';
      reject(networkError);
    }
  });
}

export async function uploadFile(
  file: File,
  uploadUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const chunkSize = CLOUDFLARE_CONFIG.CHUNK_SIZE;
  const chunks = Math.ceil(file.size / chunkSize);
  let lastProgress = 0;

  const progressHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    const newProgress = customEvent.detail.progress;
    if (newProgress > lastProgress) {
      lastProgress = newProgress;
      onProgress?.(newProgress);
    }
  };

  window.addEventListener('uploadProgress', progressHandler);

  try {
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      let retries = 0;
      let lastError: Error | null = null;

      while (retries < CLOUDFLARE_CONFIG.MAX_RETRIES) {
        try {
          await uploadChunk(chunk, start, end, file.size, uploadUrl);
          break;
        } catch (error: any) {
          lastError = error;
          retries++;

          // Exponential backoff with jitter
          const baseDelay = error.name === 'NetworkError' ? 2000 : 1000;
          const maxJitter = 1000;
          const delay = baseDelay * Math.pow(2, retries - 1) + Math.random() * maxJitter;

          console.log(`Retry ${retries}/${CLOUDFLARE_CONFIG.MAX_RETRIES} after ${Math.round(delay)}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));

          if (retries === CLOUDFLARE_CONFIG.MAX_RETRIES) {
            throw new Error(`Upload failed after ${retries} attempts: ${lastError.message}`);
          }
        }
      }
    }
  } finally {
    window.removeEventListener('uploadProgress', progressHandler);
  }
}