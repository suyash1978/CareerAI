import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute, { RoleProtectedRoute } from '../components/common/ProtectedRoute';
import { ROLES } from '../utils/constants';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import JobSeekerDashboard from '../pages/JobSeekerDashboard';
import RecruiterDashboard from '../pages/RecruiterDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Jobs from '../pages/Jobs';
import RecommendedJobs from '../pages/RecommendedJobs';
import SkillGapAnalysis from '../pages/SkillGapAnalysis';
import ResumeAnalyzer from '../pages/ResumeAnalyzer';
import MockInterview from '../pages/MockInterview';
import AiAssistant from '../pages/AiAssistant';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />

        {/* Protected Generic Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Protected Role-Based Routes */}
        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.JOB_SEEKER]} />}>
          <Route path="/dashboard/seeker" element={<JobSeekerDashboard />} />
          <Route path="/recommended-jobs" element={<RecommendedJobs />} />
          <Route path="/skill-gap-analysis" element={<SkillGapAnalysis />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/mock-interview" element={<MockInterview />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.RECRUITER]} />}>
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;
