import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  onFileUploaded?: (file: File) => Promise<void>;
  title?: string;
  description?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = '.pdf',
  maxSizeMB = 5,
  onFileUploaded,
  title = 'Upload Document',
  description = 'Drag and drop your file here or click to browse'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Check file type
    if (accept && !file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return false;
    }
    
    // Check file size (convert MB to bytes)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size should be less than ${maxSizeMB}MB`);
      return false;
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      setIsUploaded(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setIsUploaded(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      if (onFileUploaded) {
        await onFileUploaded(file);
      }
      setIsUploaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while uploading');
      setIsUploaded(false);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setIsUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!file ? handleBrowseClick : undefined}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${file ? 'bg-gray-50 cursor-default' : ''}
        `}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
            <p className="text-xs text-gray-400 mt-2">Maximum file size: {maxSizeMB}MB</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 rounded-full hover:bg-gray-200"
              aria-label="Remove file"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {file && (
        <div className="mt-4">
          <Button 
            onClick={handleUpload} 
            disabled={isUploading || isUploaded}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : isUploaded ? 'Uploaded' : 'Upload Document'}
          </Button>
          
          {isUploaded && (
            <div className="flex items-center mt-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>File uploaded successfully</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;