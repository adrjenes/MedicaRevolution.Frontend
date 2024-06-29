import React, { useState } from 'react';
interface PatientForm {
    id: string;
    firstName: string;
    lastName: string;
    pesel: string;
    email: string;
    phoneNumber: string;
    diagnosis: string;
    doctorConclusions: string;
    pdfFileName: string;
    createdAt: string;
    responseDateDoctor: string | null;
  }
interface UploadAndSendProps {
  patientId: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onUpload: (updatedFields: Partial<PatientForm>) => void;
}

const UploadAndSend: React.FC<UploadAndSendProps> = ({ patientId, file, onFileSelect, onUpload }) => {
  const [updatedFields, setUpdatedFields] = useState<Partial<PatientForm>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      onFileSelect(selectedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = () => {
    onUpload(updatedFields);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input type="text" name="description" placeholder="Description" onChange={handleInputChange} />
      <input type="text" name="diagnosis" placeholder="Diagnosis" onChange={handleInputChange} />
      <input type="text" name="doctorConclusions" placeholder="Doctor Conclusions" onChange={handleInputChange} />
      <button onClick={handleUpload}>Upload & Send</button>
    </div>
  );
};

export default UploadAndSend;