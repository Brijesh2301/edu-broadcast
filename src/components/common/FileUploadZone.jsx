import { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { formatFileSize, validateFile } from '@/utils/helpers';
import { cn } from '@/lib/utils';

const FileUploadZone = ({ onFileSelect, error, currentFile, onRemove }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

  // Generate preview URL whenever currentFile changes
  // (controlled from parent, so no internal effect — just derive on render)
  const generatePreview = (file) => {
    if (!file) return null;
    try {
      return URL.createObjectURL(file);
    } catch {
      return null;
    }
  };

  // Keep preview in sync without effects: regenerate when file identity changes
  if (currentFile && !previewUrl) {
    const url = generatePreview(currentFile);
    if (url) setPreviewUrl(url);
  }
  if (!currentFile && previewUrl) {
    URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  const validateAndSelect = (file) => {
    if (!file) return;
    const result = validateFile(file);
    if (!result.valid) {
      onFileSelect(null, result.error);
      return;
    }
    onFileSelect(file, null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
    // Reset input so picking the same file again still triggers change
    e.target.value = '';
  };

  const handleClick = () => {
    if (currentFile) return; // prevent re-open while preview is showing
    inputRef.current?.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) validateAndSelect(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onRemove?.();
  };

  // ---------- HAS FILE state ----------
  if (currentFile && previewUrl) {
    return (
      <div className="space-y-2">
        <div className="relative rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove file"
            className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex justify-center rounded-md bg-gray-50 dark:bg-gray-700/50">
            <img
              src={previewUrl}
              alt={currentFile.name}
              className="max-h-48 rounded object-contain"
            />
          </div>
          <div className="mt-3">
            <p
              className="font-medium text-gray-900 dark:text-gray-100 truncate"
              title={currentFile.name}
            >
              {currentFile.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatFileSize(currentFile.size)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {currentFile.type}
            </p>
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  // ---------- IDLE / DRAG OVER state ----------
  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:bg-gray-700'
        )}
      >
        <UploadCloud
          className={cn(
            'w-10 h-10 mb-3 transition-colors',
            isDragOver
              ? 'text-blue-500 dark:text-blue-400'
              : 'text-gray-400 dark:text-gray-500'
          )}
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Drag &amp; drop image here
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          or click to browse
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Supported: JPG, PNG, GIF • Max 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Select image file"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { FileUploadZone };
export default FileUploadZone;
