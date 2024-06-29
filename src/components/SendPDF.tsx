import React from 'react';
import axios from 'axios';
import { useToken } from '../token/TokenContext';

interface SendPDFProps {
  patientId: string;
  file: File | null;
  onUpload: () => void;
}

const SendPDF: React.FC<SendPDFProps> = ({ patientId, file, onUpload }) => {
  const { token } = useToken();

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
    <button onClick={handleUpload}>Send PDF</button>
  );
};

export default SendPDF;