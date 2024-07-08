import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useToken } from '../../token/TokenContext';

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}

const NavBar: React.FC = () => {
  const { token, removeToken } = useToken();
  const [role, setRole] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('Decoded token:', decoded);
        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setRole(userRole);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, [token]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="bg-purple-500 text-white p-4 flex justify-between items-center h-16">
      <div className="text-2xl font-semibold">MedicaRevolution</div>
      <div className="flex space-x-4">
        {role === 'Doctor' ? (
          <Link to="/forms" className="hover:underline">
            Formularze
          </Link>
        ) : role === 'Patient' ? (
          <>
          <Link to="/send-form" className="hover:underline">
            Wyślij formularz
          </Link>
          <Link to="/my-forms" className="hover:underline">
            Moje formularze
          </Link>
          </>
        ) : null}
        {token && (
          <button onClick={handleLogout} className="hover:underline">
            Wyloguj
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;