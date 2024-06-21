import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }: any) => {
  const token = localStorage.getItem('token');
  return token ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;