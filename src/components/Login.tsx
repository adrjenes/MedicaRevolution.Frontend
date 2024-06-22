import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import * as yup from 'yup';
import RightSideAuth from './RightSideAuth';
import { loginSchema } from '../validations/loginSchema';
import { LoginUserCommand, LoginUserResponse, ErrorResponse } from '../types/types';
import { useToken } from '../token/TokenContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { saveToken } = useToken();

  const handleLogin = async () => {
    setError(null);
    try {
      const formData: LoginUserCommand = { email, password };
      await loginSchema.validate(formData, { abortEarly: false });
      const response = await axios.post<LoginUserResponse>('https://localhost:5555/api/account/login', formData);
      if (response.data.token) {
        saveToken(response.data.token);
        navigate('/home');
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setError(error.errors[0]);
      } else if (axios.isAxiosError(error) && error.response) {
        const serverError = error as AxiosError<ErrorResponse>;
        setError(serverError.response?.data.message || 'Login failed.');
      } else {
        setError('Login failed.');
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
        <div className="bg-white w-[550px] px-10 py-20 rounded-3xl border-2 border-gray-100">
          <h1 className="text-5xl font-semibold">MedicaLove</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">
            Zaloguj się, aby przejść do systemu medycznego.
          </p>
          <div className="mt-8">
            <div>
              <label className="text-lg font-medium">E-mail</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:outline-none focus:border-purple-500 transition-colors duration-300 ease-in-out"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-medium">Hasło</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:outline-none focus:border-purple-500 transition-colors duration-300 ease-in-out"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="mt-4 -mb-8 bg-red-100 p-4 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            <div className="mt-12 flex flex-col gap-y-4">
              <button
                className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
                onClick={handleLogin}
              >
                Sign in
              </button>
            </div>
            <div className="mt-8 flex justify-center items-center">
              <p className="font-medium text-base">Pacjencie, nie posiadasz jeszcze konta?</p>
              <button className="text-violet-500 text-base font-medium ml-2" onClick={() => navigate('/register')}>
                Zarejestruj się
              </button>
            </div>
          </div>
        </div>
      </div>
      <RightSideAuth />
    </div>
  );
}

export default Login;