import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const Dashboard = () => {
  const { role } = useAuth();

  if (role === ROLES.ADMIN) {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (role === ROLES.RECRUITER) {
    return <Navigate to="/dashboard/recruiter" replace />;
  }

  return <Navigate to="/dashboard/seeker" replace />;
};

export default Dashboard;
