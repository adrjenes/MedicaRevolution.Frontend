import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useToken } from '../../../token/TokenContext';
import { PatientForm } from '../../../types/types';

const MyFormsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useToken();
  const [patient, setPatient] = useState<PatientForm | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        if (!token) {
          throw new Error('Token is null');
        }
        const response = await axios.get<PatientForm>(`https://localhost:5555/api/patient/my-forms/${id}`, {
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
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [id, token]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const DownloadButton: React.FC<{ pdfFileName: string }> = ({ pdfFileName }) => {
    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = pdfFileName;
      link.setAttribute('download', patient.pdfFileName);
      link.click();
    };

    return (
      <button
        onClick={handleDownload}
        className="flex items-center font-bold text-purple-700 p-2 rounded"
      >
        <img src="https://medicalovesadev.blob.core.windows.net/logos-public/download.png" alt="Download Icon" className="w-12 h-12 mr-2" />
        Pobierz zaświadczenie lekarskie
      </button>
    );
  };

  return (
    <div className="flex justify-center items-center p-2">
      <div className="w-full max-w-6xl bg-white rounded-lg p-6 relative shadow-xl">
        <button
          onClick={() => navigate('/my-forms')}
          className="absolute top-5 left-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Wróć do formularzy
        </button>
        <h1 className="text-2xl font-bold mb-10 text-center">Szczegóły pacjenta</h1>
        <div className="space-y-2">
          <div className="grid grid-cols-4 text-lg gap-4">
            <div className="space-y-4">
              <div><span className="font-semibold">Imię:</span></div>
              <div className="break-words">{patient.firstName}</div>
              <div><span className="font-semibold">Nazwisko:</span></div>
              <div className="break-words">{patient.lastName}</div>
              <div><span className="font-semibold">PESEL:</span></div>
              <div className="break-words">{patient.pesel}</div>
              <div><span className="font-semibold">Numer telefonu:</span></div>
              <div className="break-words">{patient.phoneNumber}</div>
              <div><span className="font-semibold">E-mail:</span></div>
              <div className="break-words">{patient.email}</div>
              <div><span className="font-semibold">Utworzono:</span></div>
              <div className="break-words">{patient.createdAt}</div>
              <div><span className="font-semibold">Czas odpowiedzi:</span></div>
              <div className="break-words">{patient.responseDateDoctor}</div>
            </div>
            <div className="col-span-2 md:col-span-3">
              {patient.diagnosis && (
                <div className="pb-8">
                  <div className="font-semibold">Diagnoza:</div>
                  <div className="border p-2 rounded-md break-words text-sm">{patient.diagnosis}</div>
                </div>
              )}
              {patient.doctorConclusions && (
                <div className="pb-2">
                  <div className="font-semibold">Wnioski lekarza:</div>
                  <div className="border p-2 rounded-md break-words text-sm">{patient.doctorConclusions}</div>
                </div>
              )}
              {patient.pdfFileName && (
                <div className="pt-8">
                  <DownloadButton pdfFileName={patient.pdfFileName} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFormsDetails;