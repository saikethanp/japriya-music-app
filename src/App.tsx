/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Login } from './pages/Login';
import { VerifyOTP } from './pages/VerifyOTP';
import { MusicLibrary } from './pages/MusicLibrary';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { UploadSong } from './pages/UploadSong';

import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public / Main App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/music" element={<MusicLibrary />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/upload-song" element={<UploadSong />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}