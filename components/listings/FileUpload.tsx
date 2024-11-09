import React, { useState, ChangeEvent } from 'react';

interface FileUploadProps {
  onFileChange: (files: FileList | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
    onFileChange(files); // Notify the parent component about the selected files
  };

  return (
    <div className="flex flex-col items-center">
      <label className="block mb-5 text-sm font-medium text-gray-900 dark:text-white">
        Upload multiple photos
      </label>
      <input
        className="block mx-auto w-1/2 mb-3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="multiple_files"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
  </div>
  );
};

export default FileUpload;
