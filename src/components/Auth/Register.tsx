import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import { RegisterPatientCommand, RegisterPatientResponse } from '../../types/types';
import { registerSchema } from '../../validations/registerSchema';
import RightSideAuth from './RightSideAuth';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [pesel, setPesel] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null);
    try {
      const formData: RegisterPatientCommand = { firstName, lastName, pesel, email, password, phoneNumber };
      await registerSchema.validate(formData, { abortEarly: false });
      const response = await axios.post<RegisterPatientResponse>('http://localhost:5556/api/patient/register-patient', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Ustawienie tylko pierwszego błędu
        setError(error.errors[0]);
      } else {
        setError('Registration failed.');
      }
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="bg-white w-[550px] px-10 py-6 rounded-3xl border-2 border-gray-100">
          <h1 className="text-5xl font-semibold">MedicaLove</h1>
          <p className="font-medium text-lg text-gray-500 mt-3">
            Zarejestruj się, aby przejść do systemu medycznego.
          </p>
          <div className="mt-4">
            <div>
              <label className="text-lg font-medium">Imię</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-purple-500 transition-colors duration-300 ease-in-out"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="text-lg font-medium">Nazwisko</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-purple-500 transition-colors duration-300 ease-in-out"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="text-lg font-medium">PESEL</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-purple-500 transition-colors duration-300 ease-in-out"
                placeholder="Enter your PESEL"
                value={pesel}
                onChange={(e) => setPesel(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="text-lg font-medium">E-mail</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-purple-500 transition-colors duration-300 ease-in-out"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="text-lg font-medium">Hasło</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-purple-500 transition-colors duration-300 ease-in-out"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="text-lg font-medium">Numer telefonu</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-purple-500 transition-colors duration-300 ease-in-out"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            {error && (
            <div className="mt-4 bg-red-100 p-4 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
            <div className="mt-6 flex flex-col gap-y-4">
              <button
                className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
                onClick={handleRegister}
              >
                Sign up
              </button>
            </div>
            <div className="mt-6 flex justify-center items-center">
              <p className="font-medium text-base">Pacjencie, posiadasz już konto?</p>
              <button className="text-violet-500 text-base font-medium ml-2" onClick={() => navigate('/login')}>
                Zaloguj się
              </button>
            </div>
          </div>
        </div>
      </div>
      <RightSideAuth />
    </div>
  );
};

export default Register;