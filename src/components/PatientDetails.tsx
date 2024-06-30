import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../token/TokenContext';
import jsPDF from 'jspdf';
import { PatientForm } from '../types/types';
import { jwtDecode } from 'jwt-decode';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { JwtPayload } from "jwt-decode";
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
import ValidatedTextField from './ValidatedTextField';

export interface DecodedToken extends JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": string;
}
const PurpleCheckbox = styled(Checkbox)({
  color: '#7e22ce',
  '&.Mui-checked': {
    color: '#7e22ce',
  },
});
const PurpleButton = styled(Button)({
  backgroundColor: '#7e22ce',
  '&:hover': {
    backgroundColor: '#6a1bb1',
  },
  color: 'white',
});
const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useToken();
  const [patient, setPatient] = useState<PatientForm | null>(null);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorConclusions, setDoctorConclusions] = useState('');
  const navigate = useNavigate();
  const patientId = id ? parseInt(id, 10) : NaN;

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        if (!token) {
          throw new Error('Token is null');
        }
        const response = await axios.get<PatientForm>(`https://localhost:5555/api/doctor/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const patientData = response.data;
        setPatient({
          ...patientData,
          createdAt: format(new Date(patientData.createdAt), 'yyyy-MM-dd HH:mm:ss'),
          responseDateDoctor: patientData.responseDateDoctor ? format(new Date(patientData.responseDateDoctor), 'yyyy-MM-dd HH:mm:ss') : null,
        });
        setDiagnosis(response.data.diagnosis);
        setDoctorConclusions(response.data.doctorConclusions);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [id, token]);

  const generatePDFFile = async (): Promise<File | null> => {
    if (!patient) return null;

    const doc = new jsPDF('p', 'mm', 'a4');
    const img = new Image();
    img.src = "/zasw_lek.png";

    return new Promise<File>((resolve, reject) => {
      img.onload = () => {
        try {
          const imgWidth = 210;
          const imgHeight = (imgWidth * 798) / 1140;
          doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
          const firstName = patient.firstName ? patient.firstName.toString() : '';
          const lastName = patient.lastName ? patient.lastName.toString() : '';
          const createdAt = patient.createdAt ? patient.createdAt.toString().slice(0, -17) : '';
          const PESEL = patient.pesel ? patient.pesel.toString() : '';
          const diagnosisText = diagnosis ? diagnosis.toString() : '';

          if (!token) {
            reject(new Error('Token is null'));
            return;
          }
          const decodedToken = jwtDecode<DecodedToken>(token);
          const doctorLastName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];

          doc.setFontSize(12);
          doc.text(`${firstName} ${lastName}`, 44, 49);
          doc.text(createdAt, 175, 8);
          doc.text(PESEL, 22, 64.6);
          doc.text(diagnosisText, 32, 82.6);
          doc.text(doctorLastName, 155, 113.5);
          const uniqueId = new Date().getTime();
          const pdfFileName = `${firstName}-${lastName}-${uniqueId}.pdf`;
          const pdfBlob = doc.output('blob');
          const pdfFile = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
          resolve(pdfFile);
        } catch (error) {
          console.error('Error adding image to PDF:', error);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(error);
      };
    });
  };

  const handleUploadAndUpdate = async () => {
    if (!patient) return;
    try {
      const formData = new FormData();
      if (generatePDF) {
        const pdfFile = await generatePDFFile();
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
    <div className="flex justify-center items-center p-2">
      <div className="w-full max-w-6xl bg-white rounded-lg p-6 relative shadow-xl">
        <button 
          onClick={() => navigate('/forms')} 
          className="absolute top-5 left-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Wróć do formularzy
        </button>
        <h1 className="text-2xl font-bold mb-10 text-center">Szczegóły pacjenta</h1>
        <div className="space-y-2">
        <div className="grid grid-cols-4 text-lg">
        <div className="space-y-">
          <div><span className="font-semibold">Imię:</span></div>
          <div>{patient.firstName}</div>
          <div><span className="font-semibold">Nazwisko:</span></div>
          <div>{patient.lastName}</div>
          <div><span className="font-semibold">PESEL:</span></div>
          <div>{patient.pesel}</div>
          <div><span className="font-semibold">Numer telefonu:</span></div>
          <div>{patient.phoneNumber}</div>
          <div><span className="font-semibold">E-mail:</span></div>
          <div>{patient.email}</div>
          <div><span className="font-semibold">Utworzono:</span></div>
          <div>{patient.createdAt}</div>
          </div>
          <div className="col-span-2 md:col-span-3">
            <div className="pt-3 pb-8">
              <ValidatedTextField label="Diagnoza" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} 
              minLength={200} maxLength={1000} fullWidth multiline />
              </div>
              <div className="pb-2">
              <ValidatedTextField label="Doctor Conclusions" value={doctorConclusions} onChange={(e) => setDoctorConclusions(e.target.value)} 
              minLength={200} maxLength={1000} fullWidth multiline />
             </div>
              <FormControlLabel
               control= {
                  <PurpleCheckbox checked={generatePDF} onChange={(e) => setGeneratePDF(e.target.checked)} />
               }
               label="Generuj zaświadczenie lekarskie"
               className="text-lg"
               />
               </div>
               </div>
               <div className="flex justify-center">
                <PurpleButton onClick={handleUploadAndUpdate} variant="contained" color="primary">
                  Wyślij
                </PurpleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;