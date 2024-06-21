import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  element: React.ReactElement;
  restricted: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element, restricted, ...rest }) => {
  const token = localStorage.getItem('token');
  return token && restricted ? <Navigate to="/home" /> : element;
};

export default PublicRoute;