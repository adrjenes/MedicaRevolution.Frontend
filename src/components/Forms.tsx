import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridPaginationModel, GridRowIdGetter } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../token/TokenContext';
import jsPDF from 'jspdf';
import Send from './Send';
import { PatientForm } from '../types/types';
import { jwtDecode } from 'jwt-decode';

const Forms: React.FC = () => {
  const [patientForms, setPatientForms] = useState<GridRowsProp<PatientForm>>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [editedRows, setEditedRows] = useState<{ [key: string]: Partial<PatientForm> }>({});
  const [generatePDF, setGeneratePDF] = useState<{ [key: string]: boolean }>({});
  const { token } = useToken();
  const navigate = useNavigate();

  interface DecodedToken {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": string;
  }

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
      const dataWithRowNumbers = response.data.map((form, index) => ({
        ...form,
        rowNumber: index + 1,
      }));
      setPatientForms(dataWithRowNumbers);
    } catch (error) {
      console.error('Error fetching patient forms:', error);
    }
  };

  useEffect(() => {
    fetchPatientForms();
  }, [token]);

  const handleCheckboxChange = (patientId: string, checked: boolean) => {
    setGeneratePDF((prev) => ({
      ...prev,
      [patientId]: checked,
    }));
  };

  const generatePDFFile = async (form: PatientForm) => {
    const doc = new jsPDF('p', 'mm', 'a4');

    const img = new Image();
    img.src = '/zasw_lek.png'; // Upewnij się, że obraz jest w folderze public

    return new Promise<File>((resolve, reject) => {
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
          reject(new Error('Token is null'));
          return;
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
        const uniqueId = new Date().getTime();
        const pdfFileName = `${firstName}-${lastName}-${uniqueId}.pdf`;
        const pdfBlob = doc.output('blob');
        const pdfFile = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });

        resolve(pdfFile);
      };

      img.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(error);
      };
    });
  };

  const handleUploadAndUpdate = async (patientId: string) => {
    const updatedFields = editedRows[patientId] || {};
    const form = patientForms.find(p => p.id === patientId);
    
    if (!form) {
      alert('Patient form not found');
      return;
    }

    try {
      const formData = new FormData();
      if (generatePDF[patientId]) {
        const pdfFile = await generatePDFFile(form);
        formData.append('file', pdfFile);
      }
      Object.keys(updatedFields).forEach(key => {
        formData.append(key, (updatedFields as any)[key]);
      });

      await axios.patch(`https://localhost:5555/api/doctor/update-and-upload/${patientId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('File uploaded and data updated successfully');
      fetchPatientForms();
    } catch (error) {
      console.error('Error uploading file and updating data:', error);
      alert('Failed to upload file and update data');
    }
  };

  const handleProcessRowUpdate = (newRow: PatientForm) => {
    setEditedRows((prev) => ({
      ...prev,
      [newRow.id]: { ...prev[newRow.id], ...newRow },
    }));
    return newRow;
  };

  const columns: GridColDef[] = [
    { field: 'rowNumber', headerName: 'Lp.', width: 20, headerAlign: 'center', align: 'center' },
    { field: 'firstName', headerName: 'Imię', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'lastName', headerName: 'Nazwisko', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'pesel', headerName: 'PESEL', width: 120, headerAlign: 'center', align: 'center' },
    { field: 'phoneNumber', headerName: 'Numer telefonu', width: 160, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'E-mail', width: 180, headerAlign: 'center', align: 'center' },
    { field: 'diagnosis', headerName: 'Diagnosis', width: 180, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'doctorConclusions', headerName: 'Doctor Conclusions', width: 200, editable: true, headerAlign: 'center', align: 'center' },
    {
      field: 'generateL4',
      headerName: 'Generate L4',
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={generatePDF[params.row.id] || false}
          onChange={(e) => handleCheckboxChange(params.row.id, e.target.checked)}
        />
      ),
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    { field: 'createdAt', headerName: 'Created At', width: 180, headerAlign: 'center', align: 'center' },
    {
      field: 'send',
      headerName: 'Send',
      renderCell: (params) => (
        <Send
          patientId={params.row.id}
          updatedFields={editedRows[params.row.id] || {}}
          onUpload={() => handleUploadAndUpdate(params.row.id)}
        />
      ),
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    { field: 'responseDateDoctor', headerName: 'Response Date', width: 150, headerAlign: 'center', align: 'center' },
    {
      field: 'details',
      headerName: 'Details',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <button onClick={() => navigate(`/forms/${params.row.id}`)}>View Details</button>
      ),
      width: 150,
    },
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
          processRowUpdate={handleProcessRowUpdate}
        />
      </div>
    </div>
  );
};

export default Forms;