import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowIdGetter, GridPaginationModel } from '@mui/x-data-grid';
import axios from 'axios';
import { useToken } from '../token/TokenContext';
import jsPDF from 'jspdf';
import { jwtDecode } from 'jwt-decode';

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

interface DecodedToken {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": string;
  // Dodaj inne właściwości tokenu, jeśli są potrzebne
}

const Forms: React.FC = () => {
  const [patientForms, setPatientForms] = useState<GridRowsProp<PatientForm>>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const { token } = useToken();

  useEffect(() => {
    const fetchPatientForms = async () => {
      try {
        if (!token) {
          throw new Error('Token is null');
        }
        const response = await axios.get<PatientForm[]>('https://localhost:5555/api/doctor/patient-forms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatientForms(response.data);
      } catch (error) {
        console.error('Error fetching patient forms:', error);
      }
    };

    fetchPatientForms();
  }, [token]);

  const generatePDF = (form: PatientForm) => {
    const doc = new jsPDF('p', 'mm', 'a4');

    const img = new Image();
    img.src = '/zasw_lek.png'; // Upewnij się, że obraz jest w folderze public

    img.onload = () => {
      const imgWidth = 210; // Szerokość A4 w mm
      const imgHeight = (imgWidth * 798) / 1140; // Proporcjonalna wysokość obrazu

      doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight); // Dodaj obrazek przeskalowany do A4

      // Konwersja wartości do stringów
      const firstName = form.firstName ? form.firstName.toString() : '';
      const lastName = form.lastName ? form.lastName.toString() : '';
      const createdAt = form.createdAt ? form.createdAt.toString().slice(0, -17) : '';
      const PESEL = form.pesel ? form.pesel.toString() : '';
      const diagnosis = form.diagnosis ? form.diagnosis.toString() : '';

      if (!token) {
        throw new Error('Token is null');
      }

      // Dekodowanie tokenu, aby uzyskać nazwisko lekarza
      const decodedToken = jwtDecode<DecodedToken>(token);
      const doctorLastName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];

      // Dodaj dane z formularza
      doc.setFontSize(12);
      doc.text(`${firstName} ${lastName}`, 44, 49); // Imię i nazwisko pacjenta
      doc.text(createdAt, 175, 8); // Data utworzenia
      doc.text(PESEL, 22, 64.6); // PESEL
      doc.text(diagnosis, 32, 82.6); // Diagnoza
      doc.text(doctorLastName, 155, 113.5); // Nazwisko lekarza

      // Zapisz PDF
      doc.save(`${lastName}_${firstName}_zaswiadczenie.pdf`);
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  };

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', width: 170 },
    { field: 'lastName', headerName: 'Last Name', width: 170 },
    { field: 'pesel', headerName: 'PESEL', width: 170 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 160 },
    { field: 'email', headerName: 'Email', width: 170 },
    { field: 'diagnosis', headerName: 'Diagnosis', width: 170 },
    { field: 'doctorConclusions', headerName: 'Doctor Conclusions', width: 200 },
    {
      field: 'pdfFileName',
      headerName: 'Generate PDF',
      renderCell: (params) => (
        <button onClick={() => generatePDF(params.row)}>
          Generate PDF
        </button>
      ),
      width: 150,
    },
    { field: 'createdAt', headerName: 'Created At', width: 180 },
    { field: 'responseDateDoctor', headerName: 'Response Date', width: 180 },
  ];

  const getRowId: GridRowIdGetter<PatientForm> = (row) => row.id;

  return (
    <div className="flex justify-center items-center w-full h-full bg-gray-100">
      <div className="px-4" style={{ width: '100%', height: '80%' }}>
        <DataGrid
          rows={patientForms}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10]}
          getRowId={getRowId}
        />
      </div>
    </div>
  );
};

export default Forms;