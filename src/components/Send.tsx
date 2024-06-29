import React from 'react';

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

interface SendProps {
  patientId: string;
  updatedFields: Partial<PatientForm>;
  onUpload: (patientId: string, updatedFields: Partial<PatientForm>) => void;
}

const Send: React.FC<SendProps> = ({ patientId, updatedFields, onUpload }) => {
  const handleUpload = () => {
    onUpload(patientId, updatedFields);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <button onClick={handleUpload} className="w-10 h-10">
        <img src="https://medicalovesadev.blob.core.windows.net/logos-public/send-file.png" alt="Send" />
      </button>
    </div>
  );
};

export default Send;