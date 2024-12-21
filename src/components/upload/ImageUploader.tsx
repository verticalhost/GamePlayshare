import React, { useCallback, useState } from 'react';
import { Upload as UploadIcon, X } from 'lucide-react';
import { validateImageFile } from '../../lib/storage/validation';
import { uploadImage } from '../../lib/storage/upload';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  onUploadError,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      onUploadError(validationError);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      setError(null);

      const url = await uploadImage(file);
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
    <div className="space-y-4">
      <div
        className={`relative ${uploading ? 'pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          id="proof-upload"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <label
          htmlFor="proof-upload"
          className="block bg-gray-800 p-8 rounded-lg border-2 border-dashed border-gray-600 text-center cursor-pointer hover:border-purple-500 transition-colors"
        >
          {preview ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-48 mx-auto rounded-lg"
            />
          ) : (
            <>
              <UploadIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">Drag and drop your proof image here</p>
              <p className="text-sm text-gray-500 mt-2">or click to select a file</p>
              <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
            </>
          )}
        </label>

        {uploading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm flex items-center">
          <X className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;