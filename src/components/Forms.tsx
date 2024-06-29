import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridPaginationModel, GridRowIdGetter } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../token/TokenContext';
import { PatientForm } from '../types/types';

const Forms: React.FC = () => {
  const [patientForms, setPatientForms] = useState<GridRowsProp<PatientForm>>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const { token } = useToken();
  const navigate = useNavigate();

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

  const columns: GridColDef[] = [
    { field: 'rowNumber', headerName: 'Lp.', width: 20, headerAlign: 'center', align: 'center' },
    { field: 'firstName', headerName: 'Imię', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'lastName', headerName: 'Nazwisko', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'pesel', headerName: 'PESEL', width: 120, headerAlign: 'center', align: 'center' },
    { field: 'phoneNumber', headerName: 'Numer telefonu', width: 160, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'E-mail', width: 180, headerAlign: 'center', align: 'center' },
    { field: 'diagnosis', headerName: 'Diagnosis', width: 180, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'doctorConclusions', headerName: 'Doctor Conclusions', width: 200, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'createdAt', headerName: 'Created At', width: 180, headerAlign: 'center', align: 'center' },
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
        <DataGrid rows={patientForms} columns={columns} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} pageSizeOptions={[10]} getRowId={getRowId}/>
      </div>
    </div>
  );
};

export default Forms;