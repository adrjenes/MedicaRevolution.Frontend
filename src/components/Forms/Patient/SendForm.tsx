import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../../../token/TokenContext';
import ValidatedTextField from '../../UI/ValidatedTextField';
import ValidatedButton from '../../UI/ValidatedButton';


const SendForm: React.FC = () => {
  const [description, setDescription] = useState('');
  const { token } = useToken();
  const navigate = useNavigate();

  const handleSendForm = async () => {
    try {
      const response = await axios.post(
        'https://localhost:5555/api/patient/send-form', { description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        alert('Form sent successfully');
        navigate('/my-forms'); // Navigate to some other route after success
      } else {
        alert('Failed to send form');
      }
    } catch (error) {
      console.error('Error sending form:', error);
      alert('Failed to send form');
    }
  };

  return (
    <div className="flex justify-center items-center p-2">
      <div className="w-full max-w-4xl bg-white rounded-lg p-6 relative shadow-xl">
        <button 
          onClick={() => navigate('/my-forms')}
          className="absolute top-5 left-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Wróć
        </button>
        <h1 className="text-2xl font-bold mb-10 text-center">Wyślij formularz</h1>
        <div className="space-y-2">
          <div className="grid grid-cols-1 text-lg">
            <div className="col-span-1">
              <div className="pt-3 pb-8">
                <ValidatedTextField 
                  label="Opis" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  minLength={200} 
                  maxLength={1000} 
                  fullWidth 
                  multiline 
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <ValidatedButton onClick={handleSendForm} variant="contained" color="primary">
              Wyślij
            </ValidatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendForm;