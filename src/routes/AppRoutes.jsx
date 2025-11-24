import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes (Supervisor module has no login yet) */}
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

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
