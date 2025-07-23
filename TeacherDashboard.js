import React, { useState, useEffect } from 'react';
import api from '../../api/authApi';
import './TeacherDashboard.css'; // You'll create this CSS file

function TeacherDashboard({ data }) {
  const [students, setStudents] = useState([]);
  const [houseSpirits, setHouseSpirits] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states for adding/updating results
  const [selectedStudent, setSelectedStudent] = useState('');
  const [activityName, setActivityName] = useState('');
  const [score, setScore] = useState('');
  const [houseSpiritPoints, setHouseSpiritPoints] = useState('');
  const [editingResultId, setEditingResultId] = useState(null);

  useEffect(() => {
    if (data) {
      setStudents(data.students || []);
      setHouseSpirits(data.houseSpirits || []);
      setRecentResults(data.recentResults || []);
      setLoading(false);
    }
  }, [data]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/teacher/dashboard');
      setStudents(res.data.students || []);
      setHouseSpirits(res.data.houseSpirits || []);
      setRecentResults(res.data.recentResults || []);
    } catch (err) {
      setError('Failed to refresh dashboard data.');
      console.error(err);
    }
  };

  const handleAddOrUpdateResult = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedStudent || !activityName || score === '') {
      setError('Please fill in all required fields: Student, Activity, Score.');
      return;
    }

    const resultPayload = {
      student_id: selectedStudent,
      activity_name: activityName,
      score: parseFloat(score),
      house_spirit_points: houseSpiritPoints ? parseInt(houseSpiritPoints) : 0,
    };

    try {
      if (editingResultId) {
        await api.put(`/teacher/results/${editingResultId}`, resultPayload);
        alert('Result updated successfully!');
      } else {
        await api.post('/teacher/results', resultPayload);
        alert('Result added successfully!');
      }
      // Clear form
      setSelectedStudent('');
      setActivityName('');
      setScore('');
      setHouseSpiritPoints('');
      setEditingResultId(null);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      setError('Error adding/updating result.');
      console.error(err.response ? err.response.data : err);
    }
  };

  const handleEditResult = (result) => {
    setSelectedStudent(result.student_id);
    setActivityName(result.activity_name);
    setScore(result.score);
    // Note: house_spirit_points cannot be directly edited for an existing result in this flow
    // A more complex system would handle point adjustments separately or undo.
    setEditingResultId(result.id);
  };

  const handleDeleteResult = async (resultId) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await api.delete(`/teacher/results/${resultId}`);
        alert('Result deleted successfully!');
        fetchDashboardData(); // Refresh data
      } catch (err) {
        setError('Error deleting result.');
        console.error(err.response ? err.response.data : err);
      }
    }
  };

  if (loading) {
    return <div>Loading teacher dashboard...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        {data.teacherProfile && (
          <p>Welcome, {data.teacherProfile.firstName} {data.teacherProfile.lastName}</p>
        )}
      </div>

      <div className="add-result-section dashboard-section">
        <h3>{editingResultId ? 'Edit Student Result' : 'Add New Student Result'}</h3>
        <form onSubmit={handleAddOrUpdateResult}>
          <div className="form-group">
            <label>Student:</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name} ({student.student_id_number})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Activity Name:</label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Score:</label>
            <input
              type="number"
              step="0.01"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>House Spirit Points (Optional):</label>
            <input
              type="number"
              value={houseSpiritPoints}
              onChange={(e) => setHouseSpiritPoints(e.target.value)}
            />
          </div>
          <button type="submit">{editingResultId ? 'Update Result' : 'Add Result'}</button>
          {editingResultId && <button type="button" onClick={() => setEditingResultId(null)}>Cancel Edit</button>}
        </form>
      </div>

      <div className="recent-results-section dashboard-section">
        <h3>My Recent Recorded Results</h3>
        {recentResults.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>House Spirit</th>
                <th>Activity</th>
                <th>Score</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((result) => (
                <tr key={result.id}>
                  <td>{result.student_first_name} {result.student_last_name}</td>
                  <td>{result.house_spirit_name || 'N/A'}</td>
                  <td>{result.activity_name}</td>
                  <td>{result.score}</td>
                  <td>{new Date(result.date_recorded).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEditResult(result)}>Edit</button>
                    <button onClick={() => handleDeleteResult(result.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results recorded by you yet.</p>
        )}
      </div>

      <div className="all-students-section dashboard-section">
        <h3>All Students</h3>
        {students.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>House Spirit</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.student_id_number}</td>
                  <td>{student.first_name} {student.last_name}</td>
                  <td>{student.house_spirit_name || 'Not Assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found.</p>
        )}
      </div>

      <div className="house-spirits-section dashboard-section">
        <h3>House Spirit Standings</h3>
        {houseSpirits.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>House Name</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {houseSpirits.map((house) => (
                <tr key={house.id}>
                  <td>{house.name}</td>
                  <td>{house.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No house spirits found.</p>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;