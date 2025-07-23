import React, { useEffect, useState } from 'react';
import api from '../api/authApi';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../components/Student/StudentDashboard';

function StudentPage() {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (user && user.role === 'student') {
        try {
          const res = await api.get('/student/dashboard'); // Your backend endpoint
          setDashboardData(res.data);
        } catch (err) {
          setError('Failed to fetch student dashboard data.');
          console.error(err);
        }
      }
    };
    if (!loading) {
      fetchStudentData();
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'student') {
    return <div>Access Denied. Please log in as a student.</div>;
  }

  return (
    <div>
      <h1>Student Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {dashboardData ? (
        <StudentDashboard data={dashboardData} />
      ) : (
        <p>No dashboard data available.</p>
      )}
    </div>
  );
}

export default StudentPage;