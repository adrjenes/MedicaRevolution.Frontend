import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../token/TokenContext';
import { PatientForm } from '../types/types';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { generatePDFFile } from '../components/generatePDFFile';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useToken();
  const [patient, setPatient] = useState<PatientForm | null>(null);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorConclusions, setDoctorConclusions] = useState('');

  const patientId = id ? parseInt(id, 10) : NaN;

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        if (!token) {
          throw new Error('Token is null');
        }
        console.log(`Fetching details for patient ID: ${id}`);
        const response = await axios.get<PatientForm>(`https://localhost:5555/api/doctor/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatient(response.data);
        setDiagnosis(response.data.diagnosis);
        setDoctorConclusions(response.data.doctorConclusions);
        console.log(`Fetched patient data: `, response.data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [id, token]);

  const handleUploadAndUpdate = async () => {
    if (!patient) return;

    try {
      const formData = new FormData();
      if (generatePDF) {
        const pdfFile = await generatePDFFile(patient, diagnosis, doctorConclusions, token!);
        if (pdfFile) {
          formData.append('file', pdfFile);
        }
      }
      formData.append('firstName', patient.firstName);
      formData.append('lastName', patient.lastName);
      formData.append('pesel', patient.pesel);
      formData.append('phoneNumber', patient.phoneNumber);
      formData.append('email', patient.email);
      formData.append('diagnosis', diagnosis);
      formData.append('doctorConclusions', doctorConclusions);

      await axios.patch(`https://localhost:5555/api/doctor/update-and-upload/${patientId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded and data updated successfully');
    } catch (error) {
      console.error('Error uploading file and updating data:', error);
      alert('Failed to upload file and update data');
    }
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
      <div className="bg-white shadow-md rounded p-6">
        <p><strong>First Name:</strong> {patient.firstName}</p>
        <p><strong>Last Name:</strong> {patient.lastName}</p>
        <p><strong>PESEL:</strong> {patient.pesel}</p>
        <p><strong>Phone Number:</strong> {patient.phoneNumber}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <div className="mt-4">
          <TextField label="Diagnosis" variant="outlined" multiline fullWidth value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
        </div>
        <div className="mt-4">
          <TextField label="Doctor Conclusions" variant="outlined" multiline fullWidth value={doctorConclusions} onChange={(e) => setDoctorConclusions(e.target.value)} />
        </div>
        <p><strong>Created At:</strong> {patient.createdAt}</p>
        <p><strong>Response Date:</strong> {patient.responseDateDoctor}</p>
        <div className="flex items-center mt-4">
          <FormControlLabel
            control={
              <Checkbox checked={generatePDF} onChange={(e) => setGeneratePDF(e.target.checked)} />
            }
            label="Generate L4 PDF"
          />
        </div>
        <Button onClick={handleUploadAndUpdate} variant="contained" color="primary" className="mt-4">
          Send
        </Button>
      </div>
    </div>
  );
};

export default PatientDetails;