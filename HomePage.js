import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css'; // You'll create this CSS file

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>Welcome to House-Spirits!</h1>
      <p>Your platform for managing student data, results, and house spirit competitions.</p>
      {user ? (
        <div className="logged-in-message">
          <p>You are logged in as **{user.username}** ({user.role}).</p>
          {user.role === 'student' && <Link to="/student-dashboard" className="home-button">Go to My Dashboard</Link>}
          {user.role === 'teacher' && <Link to="/teacher-dashboard" className="home-button">Go to Teacher Dashboard</Link>}
          {/* Add admin link here if applicable */}
        </div>
      ) : (
        <div className="auth-links">
          <p>Please log in to access the system features.</p>
          <Link to="/login" className="home-button">Login</Link>
          {/* Optionally add a registration link here if you have public registration */}
          {/* <Link to="/register" className="home-button">Register</Link> */}
        </div>
      )}
    </div>
  );
}

export default HomePage;