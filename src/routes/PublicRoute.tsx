// PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useToken } from '../token/TokenContext';

interface PublicRouteProps {
  element: JSX.Element;
  restricted: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element, restricted }) => {
  const { token } = useToken();
  return token && restricted ? <Navigate to="/home" /> : element;
};

export default PublicRoute;