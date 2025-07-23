import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Shared/Navbar';

// PrivateRoute component for protecting routes
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div>Access Denied</div>; // Or redirect to an unauthorized page
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/student-dashboard"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <StudentPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <PrivateRoute allowedRoles={['teacher', 'admin']}>
                  <TeacherPage />
                </PrivateRoute>
              }
            />
            {/* Add more routes based on your PDF, e.g., /admin-dashboard, /house-spirits-management */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;