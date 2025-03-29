import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, CheckCircle, AlertCircle, X, Download } from 'lucide-react';
import { useResults } from '@/contexts/ResultContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResultsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  
  // Use the result context
  const { results, isLoading, error: contextError, uploadResult, deleteResult, downloadResult } = useResults();
  
  // Combine errors from context and local state
  const error = localError || contextError;
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    setLocalError(null);
    
    // Check file type (PDF only)
    if (!file.type.includes('pdf')) {
      setLocalError('Please upload a PDF file');
      return false;
    }
    
    // Check file size (max 5MB)
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size should be less than ${maxSizeMB}MB`);
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

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setLocalError(null);
    
    try {
      await uploadResult(file);
      setIsUploaded(true);
      // Keep the file displayed but mark as uploaded
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'An error occurred while uploading');
      setIsUploaded(false);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setIsUploaded(false);
  };

  const handleDeleteResult = async (id: string) => {
    try {
      setLocalError(null);
      
      // Show confirmation dialog
      const confirmed = window.confirm('Are you sure you want to delete this file?');
      if (!confirmed) return;
      
      // Call the deleteResult from context
      await deleteResult(id);
      
      // Show success message (if you have a toast/notification system)
      toast?.success('File deleted successfully');
      
    } catch (err) {
      // Handle error
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete the file';
      setLocalError(errorMessage);
      toast?.error(errorMessage);
    }
  };

  const handleDownloadResult = async (id: string, fileName: string) => {
    try {
      const blob = await downloadResult(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setLocalError('Failed to download the file');
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Results</h1>
      
      {/* Upload Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Results</CardTitle>
        </CardHeader>
        <CardContent>
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
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200 ease-in-out
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${file ? 'bg-gray-50' : ''}
            `}
          >
            {!file ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">Drag and drop file here or click to browse</p>
                <p className="text-xs text-gray-400 mt-2">PDF files only, maximum size: 5MB</p>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Browse Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
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
          </div>
          
          {file && !isUploaded && (
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          )}
          
          {isUploaded && (
            <div className="flex items-center mt-4 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>File uploaded successfully</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Uploaded Files Section */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-500">Loading your documents...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm">{result.fileName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {(result.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      onClick={() => handleDownloadResult(result.id, result.fileName)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResult(result.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No results have been uploaded yet. Your results will appear here when available.
            </p>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ResultsPage;