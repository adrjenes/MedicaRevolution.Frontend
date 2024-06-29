import React, { useRef } from 'react';

interface UploadPDFProps {
  onFileSelect: (file: File | null) => void;
}

const UploadPDF: React.FC<UploadPDFProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <img 
        src="https://medicalovesadev.blob.core.windows.net/logos-public/pdf_upload.png" 
        alt="Upload PDF" 
        className="cursor-pointer w-10 h-10"
        onClick={handleIconClick}
      />
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
    </div>
  );
};

export default UploadPDF;