import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Home from '../components/Home';
import Layout from '../components/Layout/Layout';
import { TokenProvider, useToken } from '../token/TokenContext';
import Forms from '../components/Forms/Doctor/Forms';
import PatientDetails from '../components/Forms/Doctor/PatientDetails';
import MyFormsDetails from '../components/Forms/Patient/MyFormsDetails';
import SendForm from '../components/Forms/Patient/SendForm';
import MyForms from '../components/Forms/Patient/MyForms';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const AppRoutes: React.FC = () => {
  return (
    <TokenProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ConditionalNavigate />} />
          <Route path="/home" element={<PrivateRoute element={<Layout><Home /></Layout>} />} />
          <Route path="/forms" element={<PrivateRoute element={<Layout><Forms /></Layout>} />} />
          <Route path="/forms/:id" element={<PrivateRoute element={<Layout><PatientDetails /></Layout>} />} />
          <Route path="/forms/patient/:id" element={<PrivateRoute element={<Layout><MyFormsDetails /></Layout>} />} />
          <Route path="/send-form" element={<PrivateRoute element={<Layout><SendForm /></Layout>} />} />
          <Route path="/my-forms" element={<PrivateRoute element={<Layout><MyForms /></Layout>} />} />
          <Route path="/login" element={<PublicRoute restricted={true} element={<Login />} />} />
          <Route path="/register" element={<PublicRoute restricted={true} element={<Register />} />} />
        </Routes>
      </Router>
    </TokenProvider>
  );
};

const ConditionalNavigate: React.FC = () => {
  const { token } = useToken();
  return <Navigate to={token ? "/home" : "/login"} />;
};

export default AppRoutes;