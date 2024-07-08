import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import { jwtDecode } from 'jwt-decode';
import { FormControlLabel } from '@mui/material';
import { JwtPayload } from 'jwt-decode';
import { format } from 'date-fns';
import { PatientForm } from '../../../types/types';
import ValidatedTextField from '../../UI/ValidatedTextField';
import ValidatedCheckbox from '../../UI/ValidatedCheckBox';
import ValidatedButton from '../../UI/ValidatedButton';
import { useToken } from '../../../token/TokenContext';
import { DatePicker } from 'antd';
import moment from 'moment';
import plPL from 'antd/es/date-picker/locale/pl_PL';
import '../../../style/customAnt.css';
import { toast } from 'react-toastify';
moment.locale('pl');
const { RangePicker } = DatePicker;

export interface DecodedToken extends JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": string;
}

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useToken();
  const [patient, setPatient] = useState<PatientForm | null>(null);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorConclusions, setDoctorConclusions] = useState('');
  const [dates, setDates] = useState<Date[]>([]);
  const navigate = useNavigate();
  const patientId = id ? parseInt(id, 10) : NaN;

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!token) throw new Error('Token is null');
      
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
      if (response.data.startDate && response.data.endDate) {
        setDates([
          new Date(response.data.startDate),
          new Date(response.data.endDate),
        ]);
      }
    };
    fetchPatientDetails();
  }, [id, token]);

  const generatePDFFile = async (): Promise<File | null> => {
    if (!patient) return null;
    const doc = new jsPDF('p', 'mm', 'a4');
    const img = new Image();
    img.src = '/zasw_lek.png';

    return new Promise<File>((resolve, reject) => {
      img.onload = () => {
        const imgWidth = 210;
        const imgHeight = (imgWidth * 1134) / 1137;
        doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
        const firstName = patient.firstName ? patient.firstName.toString() : '';
        const lastName = patient.lastName ? patient.lastName.toString() : '';
        const createdAt = patient.createdAt ? patient.createdAt.toString() : '';
        const PESEL = patient.pesel ? patient.pesel.toString() : '';
        const diagnosisText = diagnosis ? diagnosis.toString() : '';
        const startDate = dates[0] ? format(dates[0], 'yyyy-MM-dd HH:mm:ss').slice(0, 10) : '';
        const endDate = dates[1] ? format(dates[1], 'yyyy-MM-dd HH:mm:ss').slice(0, 10) : '';
        if (!token) {
          reject(new Error('Token is null'));
          return;
        }
        const decodedToken = jwtDecode<DecodedToken>(token);
        const doctorLastName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];
        doc.setFontSize(12);
        doc.text(`${firstName} ${lastName}`, 44, 49);
        doc.text(createdAt.slice(0, 10), 175, 8);
        doc.text(PESEL, 22, 64.6);
        doc.text(`${startDate}`, 29, 160); 
        doc.text(`${endDate}`, 84, 160); 
        const splitDiagnosisText = doc.splitTextToSize(diagnosisText, 170); 
        doc.text(splitDiagnosisText, 32, 84);
        doc.text(doctorLastName, 155, 168);
        const uniqueIdByDate = new Date().getTime();
        const pdfFileName = `${firstName}-${lastName}-${uniqueIdByDate}.pdf`;
        const pdfBlob = doc.output('blob');
        const pdfFile = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
        resolve(pdfFile);
      };
    });
  };

  const handleUploadAndUpdate = async () => {
    if (!patient) return;
    if (generatePDF && (!dates[0] || !dates[1])) {
      toast.error('Nie wybrano zakresu dat.');
      return;
    }

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
    const formattedStartDate = format(dates[0], 'yyyy-MM-dd');
    formData.append('startDate', formattedStartDate);
    const formattedEndDate = format(dates[1], 'yyyy-MM-dd');
    formData.append('endDate', formattedEndDate);
    formData.append('isArchive', 'true');

    await axios.patch(`https://localhost:5555/api/doctor/update-and-upload/${patientId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Dane zostały zaktualizowane.');
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center p-2">
      <div className="w-full max-w-7xl bg-white rounded-lg p-6 relative shadow-xl">
        <button onClick={() => navigate('/forms')} className="absolute top-5 left-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
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
                <ValidatedTextField label="Diagnoza" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} minLength={200} maxLength={1000} fullWidth multiline/>
              </div>
              <div className="pb-2">
                <ValidatedTextField label="Doctor Conclusions" value={doctorConclusions} onChange={(e) => setDoctorConclusions(e.target.value)} minLength={200} maxLength={1000} fullWidth multiline/>
              </div>
              <FormControlLabel control={<ValidatedCheckbox checked={generatePDF} onChange={(e) => setGeneratePDF(e.target.checked)} />}
                                label="Generuj zaświadczenie lekarskie" className="text-lg"/>
              <RangePicker
                locale={plPL} placeholder={['Początkowa data', 'Końcowa data']}
                className="custom-rangepicker border-purple-600 text-purple-600 focus:border-purple-600 focus:ring focus:ring-purple-200 hover:border-purple-600"
                onChange={(values: any) => {
                  setDates(values?.map((item: any) => new Date(item)));
                }}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <ValidatedButton onClick={handleUploadAndUpdate} variant="contained" color="primary">
              Wyślij
            </ValidatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;