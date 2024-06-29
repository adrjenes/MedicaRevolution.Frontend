import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../token/TokenContext';
import { PatientForm } from '../types/types';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useToken();
  const [patient, setPatient] = useState<PatientForm | null>(null);

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
        setPatient(response.data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [id, token]);

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
        <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
        <p><strong>Doctor Conclusions:</strong> {patient.doctorConclusions}</p>
        <p><strong>Created At:</strong> {patient.createdAt}</p>
        <p><strong>Response Date:</strong> {patient.responseDateDoctor}</p>
      </div>
    </div>
  );
};

export default PatientDetails;