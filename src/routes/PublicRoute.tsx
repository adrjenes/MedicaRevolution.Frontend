import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element, restricted }: { element: JSX.Element, restricted: boolean }) => {
  const token = localStorage.getItem('token');
  return token && restricted ? <Navigate to="/home" /> : element;
};

export default PublicRoute;