import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import TrackGrievancePage from '../pages/public/TrackGrievancePage';
import SubmitGrievancePage from '../pages/public/SubmitGrievancePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentGrievancesPage from '../pages/student/StudentGrievancesPage';
import StudentGrievanceDetailPage from '../pages/student/StudentGrievanceDetailPage';
import StudentNotificationsPage from '../pages/student/StudentNotificationsPage';

// Authority Pages
import AuthorityDashboard from '../pages/authority/AuthorityDashboard';
import AuthorityGrievancesPage from '../pages/authority/AuthorityGrievancesPage';
import AuthorityGrievanceDetailPage from '../pages/authority/AuthorityGrievanceDetailPage';
import AuthorityNotificationsPage from '../pages/authority/AuthorityNotificationsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminGrievancesPage from '../pages/admin/AdminGrievancesPage';
import HierarchyConfigPage from '../pages/admin/HierarchyConfigPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/track" element={<TrackGrievancePage />} />
        <Route path="/track/:token" element={<TrackGrievancePage />} />
        <Route path="/submit" element={<SubmitGrievancePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Student Protected Portal */}
      <Route path="/student" element={<DashboardLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="grievances" element={<StudentGrievancesPage />} />
        <Route path="grievances/:id" element={<StudentGrievanceDetailPage />} />
        <Route path="notifications" element={<StudentNotificationsPage />} />
      </Route>

      {/* Authority Protected Portal */}
      <Route path="/authority" element={<DashboardLayout />}>
        <Route index element={<AuthorityDashboard />} />
        <Route path="grievances" element={<AuthorityGrievancesPage />} />
        <Route path="grievances/:id" element={<AuthorityGrievanceDetailPage />} />
        <Route path="notifications" element={<AuthorityNotificationsPage />} />
      </Route>

      {/* Admin / Ombudsman Protected Portal */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="grievances" element={<AdminGrievancesPage />} />
        <Route path="grievances/:id" element={<AuthorityGrievanceDetailPage />} />
        <Route path="hierarchy" element={<HierarchyConfigPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
