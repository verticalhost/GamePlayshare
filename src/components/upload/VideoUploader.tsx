import React, { useCallback } from 'react';
import { Upload as UploadIcon, X } from 'lucide-react';
import { uploadVideo } from '../../lib/storage/upload';
import { validateVideoFile } from '../../lib/storage/validation';

interface VideoUploaderProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadComplete,
  onUploadError,
}) => {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const handleUpload = async (file: File) => {
    const validationError = validateVideoFile(file);
    if (validationError) {
      setError(validationError);
      onUploadError(validationError);
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const url = await uploadVideo(file, (progress) => {
        setProgress(progress);
      });

      onUploadComplete(url);
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      onUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }, []);

  return (
    <div
      className={`relative ${uploading ? 'pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        id="video-upload"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <label
        htmlFor="video-upload"
        className="block bg-gray-800 p-8 rounded-lg border-2 border-dashed border-gray-600 text-center cursor-pointer hover:border-purple-500 transition-colors"
      >
        <UploadIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-400">Drag and drop your gameplay video here</p>
        <p className="text-sm text-gray-500 mt-2">or click to select a file</p>
        <p className="text-xs text-gray-500 mt-1">Maximum file size: 500MB</p>
      </label>

      {uploading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 rounded-lg flex flex-col items-center justify-center">
          <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 mt-2">{progress}% uploaded</p>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm flex items-center">
          <X className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;