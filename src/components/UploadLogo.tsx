import React, { useState } from 'react';
import axios from 'axios';
import { useToken } from '../token/TokenContext';

interface UploadLogoProps {
  patientId: number;
  onUpload: () => void;
}

const UploadLogo: React.FC<UploadLogoProps> = ({ patientId, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const { token } = useToken();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`https://localhost:5555/api/doctor/logo/${patientId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      onUpload(); // Refresh data or perform any additional actions on successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload PDF</button>
    </div>
  );
};

export default UploadLogo;