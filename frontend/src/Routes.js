import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserSettings from './pages/UserSettings';
import ContentLibrary from './pages/ContentLibrary';
import MyPrograms from './pages/MyPrograms';
import { useAuth } from './contexts/AuthContext';
// ... άλλα imports

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <UserSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <ContentLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-programs"
        element={
          <ProtectedRoute>
            <MyPrograms />
          </ProtectedRoute>
        }
      />
      {/* ... άλλες διαδρομές */}
    </Routes>
  );
}

export default AppRoutes;
