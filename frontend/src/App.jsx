import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotificationDetails from './pages/NotificationDetails';

// Student
import StudentHome from './pages/student/StudentHome';
import Complaints from './pages/student/Complaints';
import CreateComplaint from './pages/student/CreateComplaint';
import ComplaintDetails from './pages/student/ComplaintDetails';
import Outpasses from './pages/student/Outpasses';
import CreateOutpass from './pages/student/CreateOutpass';
import OutpassDetails from './pages/student/OutpassDetails';
import Profile from './pages/student/Profile';
import Settings from './pages/student/Settings';

// Warden
import WardenHome from './pages/warden/WardenHome';
import OutpassRequests from './pages/warden/OutpassRequests';
import OutpassReview from './pages/warden/OutpassReview';
import WardenStudents from './pages/warden/Students';

// Admin
import AdminHome from './pages/admin/AdminHome';
import AdminComplaints from './pages/admin/Complaints';
import AdminComplaintDetails from './pages/admin/ComplaintDetails';
import AdminOutpasses from './pages/admin/Outpasses';
import AdminStudents from './pages/admin/Students';
import Reports from './pages/admin/Reports';
import Broadcast from './pages/admin/Broadcast';


function ProtectedLayout({ children, allowedRoles }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}


export default function App() {
  return (
    <Routes>

      {/* ==================== PUBLIC ==================== */}

      <Route
        path="/"
        element={
          <Layout>
            <LandingPage />
          </Layout>
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==================== STUDENT ==================== */}

      <Route
        path="/student"
        element={
          <ProtectedLayout allowedRoles={['STUDENT']}>
            <StudentHome />
          </ProtectedLayout>
        }
      />

      <Route
        path="/complaints"
        element={
          <ProtectedLayout allowedRoles={['STUDENT']}>
            <Complaints />
          </ProtectedLayout>
        }
      />

      <Route
        path="/complaints/create"
        element={
          <ProtectedLayout allowedRoles={['STUDENT']}>
            <CreateComplaint />
          </ProtectedLayout>
        }
      />

      <Route
        path="/complaints/:id"
        element={
          <ProtectedLayout allowedRoles={['STUDENT']}>
            <ComplaintDetails />
          </ProtectedLayout>
        }
      />

      <Route
        path="/outpasses"
        element={
          <ProtectedLayout allowedRoles={['STUDENT']}>
            <Outpasses />
          </ProtectedLayout>
        }
      />

      <Route
        path="/outpasses/create"
        element={
          <ProtectedLayout allowedRoles={['STUDENT']}>
            <CreateOutpass />
          </ProtectedLayout>
        }
      />

      <Route
        path="/outpasses/:id"
        element={
          <ProtectedLayout allowedRoles={['STUDENT']}>
            <OutpassDetails />
          </ProtectedLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedLayout allowedRoles={['STUDENT']}>
            <Profile />
          </ProtectedLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedLayout
            allowedRoles={['STUDENT', 'WARDEN', 'ADMIN']}
          >
            <Settings />
          </ProtectedLayout>
        }
      />


      {/* ==================== NOTIFICATIONS ==================== */}


      <Route
        path="/notifications/details"
        element={
          <ProtectedLayout
            allowedRoles={['STUDENT', 'WARDEN', 'ADMIN']}
          >
            <NotificationDetails />
          </ProtectedLayout>
        }
      />

      <Route
        path="/notifications/:id"
        element={
          <ProtectedLayout
            allowedRoles={['STUDENT', 'WARDEN', 'ADMIN']}
          >
            <NotificationDetails />
          </ProtectedLayout>
        }
      />


      {/* ==================== WARDEN ==================== */}

      <Route
        path="/warden"
        element={
          <ProtectedLayout allowedRoles={['WARDEN']}>
            <WardenHome />
          </ProtectedLayout>
        }
      />

      <Route
        path="/warden/outpasses"
        element={
          <ProtectedLayout allowedRoles={['WARDEN']}>
            <OutpassRequests />
          </ProtectedLayout>
        }
      />

      <Route
        path="/warden/outpasses/:id"
        element={
          <ProtectedLayout allowedRoles={['WARDEN']}>
            <OutpassReview />
          </ProtectedLayout>
        }
      />

      <Route
        path="/warden/students"
        element={
          <ProtectedLayout allowedRoles={['WARDEN']}>
            <WardenStudents />
          </ProtectedLayout>
        }
      />


      {/* ==================== ADMIN ==================== */}

      <Route
        path="/admin"
        element={
          <ProtectedLayout allowedRoles={['ADMIN']}>
            <AdminHome />
          </ProtectedLayout>
        }
      />

      <Route
        path="/admin/complaints"
        element={
          <ProtectedLayout allowedRoles={['ADMIN']}>
            <AdminComplaints />
          </ProtectedLayout>
        }
      />

      <Route
        path="/admin/complaints/:id"
        element={
          <ProtectedLayout allowedRoles={['ADMIN']}>
            <AdminComplaintDetails />
          </ProtectedLayout>
        }
      />

      <Route
        path="/admin/outpasses"
        element={
          <ProtectedLayout allowedRoles={['ADMIN']}>
            <AdminOutpasses />
          </ProtectedLayout>
        }
      />

      {/* Admin can view the same full outpass details page */}
      <Route
        path="/admin/outpasses/:id"
        element={
          <ProtectedLayout allowedRoles={['ADMIN']}>
            <OutpassDetails />
          </ProtectedLayout>
        }
      />

      <Route
        path="/admin/students"
        element={
          <ProtectedLayout allowedRoles={['ADMIN']}>
            <AdminStudents />
          </ProtectedLayout>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedLayout allowedRoles={['ADMIN']}>
            <Reports />
          </ProtectedLayout>
        }
      />

      <Route
        path="/admin/broadcast"
        element={
          <ProtectedLayout allowedRoles={['ADMIN']}>
            <Broadcast />
          </ProtectedLayout>
        }
      />


      {/* ==================== UNKNOWN ROUTE ==================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}