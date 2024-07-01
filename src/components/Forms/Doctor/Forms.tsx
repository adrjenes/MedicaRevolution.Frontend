import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridPaginationModel, GridRowIdGetter } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../../../token/TokenContext';
import { PatientForm } from '../../../types/types';
import { localeText } from '../../../translate/tableMUI';
import { format } from 'date-fns';
import { Checkbox } from '@mui/material';
import ValidatedCheckbox from '../../UI/ValidatedCheckBox';

const Forms: React.FC = () => {
  const [patientForms, setPatientForms] = useState<GridRowsProp<PatientForm>>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [showArchived, setShowArchived] = useState(false);
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
        params: {
          isArchive: showArchived,
        },
      });
      const dataWithRowNumbers = response.data.map((form, index) => ({
        ...form,
        rowNumber: index + 1,
        createdAt: format(new Date(form.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        responseDateDoctor: form.responseDateDoctor ? format(new Date(form.responseDateDoctor), 'yyyy-MM-dd HH:mm:ss') : null,
      }));
      setPatientForms(dataWithRowNumbers);
    } catch (error) {
      console.error('Error fetching patient forms:', error);
    }
  };

  useEffect(() => {
    const storedShowArchived = localStorage.getItem('showArchived');
    if (storedShowArchived !== null) {
      setShowArchived(JSON.parse(storedShowArchived));
    }
  }, []);

  useEffect(() => {
    fetchPatientForms();
  }, [token, showArchived]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShowArchived(checked);
    localStorage.setItem('showArchived', JSON.stringify(checked));
  };

  const columns: GridColDef[] = [
    { field: 'rowNumber', headerName: 'Lp.', width: 50, headerAlign: 'center', align: 'center' },
    { field: 'firstName', headerName: 'Imię', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'lastName', headerName: 'Nazwisko', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'pesel', headerName: 'PESEL', width: 120, headerAlign: 'center', align: 'center' },
    { field: 'phoneNumber', headerName: 'Numer telefonu', width: 160, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'E-mail', width: 180, headerAlign: 'center', align: 'center' },
    { field: 'diagnosis', headerName: 'Diagnoza', width: 180, headerAlign: 'center', align: 'center' },
    { field: 'doctorConclusions', headerName: 'Wnioski lekarza', width: 180, headerAlign: 'center', align: 'center' },
    { field: 'createdAt', headerName: 'Utworzono', width: 180, headerAlign: 'center', align: 'center' },
    { field: 'responseDateDoctor', headerName: 'Czas odpowiedzi', width: 180, headerAlign: 'center', align: 'center' },
    {
      field: 'details',
      headerName: 'Szczegóły',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <button onClick={() => navigate(`/forms/${params.row.id}`)}>
          <img src="https://medicalovesadev.blob.core.windows.net/logos-public/edit-button.png" alt="Edit" className="w-8 h-8 mt-2" />
        </button>
      ),
      width: 150,
    },
  ];

  const getRowId: GridRowIdGetter<PatientForm> = (row) => row.id;

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100">
      <div className="flex items-center justify-end w-11/12 my-4 mr-12">
        <div className="flex items-center">
          <ValidatedCheckbox
            checked={showArchived}
            onChange={handleCheckboxChange}
            color="primary"
          /> Pokaż tylko archiwalne
        </div>
      </div>
      <div className="px-4 flex justify-center items-center w-11/12 h-4/5">
        <DataGrid
          rows={patientForms}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10]}
          getRowId={getRowId}
          localeText={localeText}
          sx={{
            '& .MuiDataGrid-row:hover': { bgcolor: '#E6E6FA' },
          }}
          className="shadow-[0_1px_6px_-1px_rgba(126,34,206,0.3),_0_2px_4px_-1px_rgba(126,34,206,0.2)]"
        />
      </div>
    </div>
  );
};

export default Forms;