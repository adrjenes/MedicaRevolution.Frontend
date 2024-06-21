import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';

const AppRoutes = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/login" element={<PublicRoute restricted={true} element={<Login />} />} />
        <Route path="/register" element={<PublicRoute restricted={true} element={<Register />} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;