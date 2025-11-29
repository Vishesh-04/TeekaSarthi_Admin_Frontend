import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Centers from '../pages/Centers'
import CenterDetails from '../pages/CenterDetails'
import WorkerDetails from '../pages/WorkerDetails'
import Sessions from '../pages/Sessions'
import Visits from '../pages/Visits'
import Attendance from '../pages/Attendance'
import Stock from '../pages/Stock'
import StockDetails from "../pages/StockDetails";
import Reports from '../pages/Reports'
import SessionsDetails from '../pages/SessionsDetails'
import ScheduleDetails from '../pages/ScheduleDetails'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/centers" element={<Centers />} />
        <Route path="/center/:id" element={<CenterDetails />} />
        <Route path="/worker/:id" element={<WorkerDetails />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/sessions/:id" element={<SessionsDetails />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/stock/:id" element={<StockDetails />} />
        <Route path="/schedule/:id" element={<ScheduleDetails />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
