import { useState, useEffect } from 'react';
import { api, endpoints } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [timeReport, setTimeReport] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTimeReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.get(endpoints.ADMIN_REPORTS_TIME, {
        params: { start_date: startDate, end_date: endDate }
      });
      setTimeReport(response.data.report);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch time report');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.get(endpoints.ADMIN_REPORTS_STUDENT, {
        params: { student_query: studentQuery }
      });
      setStudentReport(response.data.report);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch student report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="report-sections">
        {/* Time-based Report Section */}
        <section className="report-section">
          <h2>Time-based Report</h2>
          <form onSubmit={handleTimeReport}>
            <div className="date-inputs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              Generate Report
            </button>
          </form>

          {timeReport && (
            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>ID</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {timeReport.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.student_name}</td>
                      <td>{entry.student_id}</td>
                      <td>{new Date(entry.entry_time).toLocaleString()}</td>
                      <td>{entry.exit_time ? new Date(entry.exit_time).toLocaleString() : '-'}</td>
                      <td>{entry.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Student-based Report Section */}
        <section className="report-section">
          <h2>Student-based Report</h2>
          <form onSubmit={handleStudentReport}>
            <input
              type="text"
              value={studentQuery}
              onChange={(e) => setStudentQuery(e.target.value)}
              placeholder="Enter Student ID or Name"
              required
            />
            <button type="submit" disabled={loading}>
              Search
            </button>
          </form>

          {studentReport && (
            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>ID</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {studentReport.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.student_name}</td>
                      <td>{entry.student_id}</td>
                      <td>{new Date(entry.entry_time).toLocaleString()}</td>
                      <td>{entry.exit_time ? new Date(entry.exit_time).toLocaleString() : '-'}</td>
                      <td>{entry.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AdminDashboard;
