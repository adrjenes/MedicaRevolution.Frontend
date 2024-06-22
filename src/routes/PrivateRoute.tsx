import React from 'react';
import { Navigate } from 'react-router-dom';
import { useToken } from '../token/TokenContext';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { token } = useToken();
  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;