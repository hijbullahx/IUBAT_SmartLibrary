import { useState, useEffect } from 'react';
import axios from './config/axios';
import { API_ENDPOINTS } from './config/api';

function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({});
  const [timeBasedReport, setTimeBasedReport] = useState([]);
  const [studentBasedReport, setStudentBasedReport] = useState([]);
  const [pcs, setPcs] = useState([]);
  const [pcDetails, setPcDetails] = useState([]);
  const [liveStats, setLiveStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Report filters
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-10');
  const [studentQuery, setStudentQuery] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [isLoggedIn]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('📊 Loading dashboard data...');
      
      // Load live statistics
      const liveStatsResponse = await axios.get(API_ENDPOINTS.ADMIN_STATS_LIVE);
      
      console.log('Live stats response:', liveStatsResponse);
      
      if (liveStatsResponse.data.status === 'success') {
        setLiveStats(liveStatsResponse.data.stats || {});
        setPcDetails(liveStatsResponse.data.pc_details || []);
      }

      // Load PC status for backward compatibility
      const pcResponse = await axios.get(API_ENDPOINTS.ELIBRARY_PC_STATUS);
      
      if (pcResponse.data.status === 'success') {
        setPcs(pcResponse.data.pcs || []);
      }

      console.log('Dashboard data loaded successfully');

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      if (error.response) {
        setMessage(`Error loading dashboard: ${error.response.data?.message || 'Server error'}`);
      } else {
        setMessage('Error loading dashboard data. Please check server connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTimeBasedReport = async () => {
    if (!startDate || !endDate) {
      setMessage('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      console.log('📊 Requesting time-based report...', { startDate, endDate });
      
      const response = await axios.get(API_ENDPOINTS.ADMIN_REPORTS_TIME, {
        params: { start_date: startDate, end_date: endDate }
      });

      console.log('Time report response:', response);

      if (response.data.status === 'success') {
        setTimeBasedReport(response.data.report || []);
        setMessage(`Found ${response.data.report?.length || 0} entries`);
      } else {
        setMessage(`Error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error loading time-based report:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setMessage(`Error 401: Unauthorized - Please log in again`);
          setIsLoggedIn(false);
        } else {
          setMessage(`Error ${error.response.status}: ${error.response.data?.message || 'Server error'}`);
        }
      } else {
        setMessage('Network error. Please check if the backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStudentBasedReport = async () => {
    if (!studentQuery.trim()) {
      setMessage('Please enter student ID or name');
      return;
    }

    setLoading(true);
    try {
      console.log('👤 Requesting student-based report...', { studentQuery });
      
      const response = await axios.get(API_ENDPOINTS.ADMIN_REPORTS_STUDENT, {
        params: { student_query: studentQuery }
      });

      console.log('Student report response:', response);

      if (response.data.status === 'success') {
        setStudentBasedReport(response.data.report || []);
        setMessage(`Found ${response.data.report?.length || 0} entries for "${studentQuery}"`);
      } else {
        setMessage(`Error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error loading student-based report:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setMessage(`Error 401: Unauthorized - Please log in again`);
          setIsLoggedIn(false);
        } else {
          setMessage(`Error ${error.response.status}: ${error.response.data?.message || 'Server error'}`);
        }
      } else {
        setMessage('Network error. Please check if the backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('🔑 Attempting admin login...');
      
      const response = await axios.post(API_ENDPOINTS.ADMIN_LOGIN, {
        username,
        password
      });
      
      console.log('Login response:', response);
      
      if (response.data.status === 'success') {
        setIsLoggedIn(true);
        setMessage('Login successful');
        console.log('✅ Admin login successful, loading dashboard data...');
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Login failed. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setMessage('');
    setStats({});
    setTimeBasedReport([]);
    setStudentBasedReport([]);
    setPcs([]);
    setStartDate('');
    setEndDate('');
    setStudentQuery('');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <div className="admin-login">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          {message && <div className="message">{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2>Admin Dashboard</h2>
          <div className="dashboard-actions">
            <button onClick={loadDashboardData} className="refresh-btn" disabled={loading}>
              {loading ? '🔄 Refreshing...' : '🔄 Refresh Stats'}
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {loading && <div className="loading">Loading...</div>}
        {message && <div className="message">{message}</div>}

        {/* Live Statistics Section */}
        <div className="stats-section">
          <h3>📊 Live Library Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card library">
              <div className="stat-icon">🏛️</div>
              <h4>Students in Library</h4>
              <span className="stat-number">{liveStats.students_in_library || 0}</span>
              <span className="stat-label">Total students inside</span>
            </div>
            <div className="stat-card elibrary">
              <div className="stat-icon">💻</div>
              <h4>Using E-Library</h4>
              <span className="stat-number">{liveStats.students_in_elibrary || 0}</span>
              <span className="stat-label">Students on PCs</span>
            </div>
            <div className="stat-card main-only">
              <div className="stat-icon">📚</div>
              <h4>Main Library Only</h4>
              <span className="stat-number">{liveStats.students_only_main || 0}</span>
              <span className="stat-label">Reading/studying</span>
            </div>
          </div>

          <h3>🖥️ PC Status Overview</h3>
          <div className="stats-grid">
            <div className="stat-card available">
              <div className="stat-icon">✅</div>
              <h4>Available PCs</h4>
              <span className="stat-number">{liveStats.pc_stats?.available || 0}</span>
              <span className="stat-label">Ready to use</span>
            </div>
            <div className="stat-card in-use">
              <div className="stat-icon">🔵</div>
              <h4>In Use PCs</h4>
              <span className="stat-number">{liveStats.pc_stats?.in_use || 0}</span>
              <span className="stat-label">Currently occupied</span>
            </div>
            <div className="stat-card dumb">
              <div className="stat-icon">❌</div>
              <h4>Out of Service</h4>
              <span className="stat-number">{liveStats.pc_stats?.dumb || 0}</span>
              <span className="stat-label">Need maintenance</span>
            </div>
            <div className="stat-card total">
              <div className="stat-icon">🖥️</div>
              <h4>Total PCs</h4>
              <span className="stat-number">{liveStats.pc_stats?.total || 0}</span>
              <span className="stat-label">All computers</span>
            </div>
          </div>
        </div>

        {/* Enhanced PC Status Section with Hover Info */}
        <div className="pc-status-section">
          <h3>💻 E-Library PC Details</h3>
          <div className="pc-grid">
            {pcDetails.map((pc) => (
              <div 
                key={pc.pc_number} 
                className={`pc-card-detailed ${pc.status}`}
                title={pc.user_info ? 
                  `${pc.user_info.student_name} (${pc.user_info.student_id})\nDepartment: ${pc.user_info.department}\nSince: ${new Date(pc.user_info.entry_time).toLocaleString()}` 
                  : pc.status === 'dumb' ? 'This PC is out of service' : 'This PC is available for use'}
              >
                <div className="pc-header">
                  <div className="pc-number">PC {pc.pc_number}</div>
                  <div className={`pc-status-badge ${pc.status}`}>
                    {pc.status === 'available' && '✅ Available'}
                    {pc.status === 'in_use' && '🔵 In Use'}
                    {pc.status === 'dumb' && '❌ Out of Service'}
                  </div>
                </div>
                {pc.user_info && (
                  <div className="pc-user-info">
                    <div className="user-name">{pc.user_info.student_name}</div>
                    <div className="user-id">{pc.user_info.student_id}</div>
                    <div className="user-dept">{pc.user_info.department}</div>
                    <div className="user-time">Since: {new Date(pc.user_info.entry_time).toLocaleTimeString()}</div>
                  </div>
                )}
                {pc.status === 'available' && (
                  <div className="pc-available-info">
                    <div className="available-text">Ready for use</div>
                  </div>
                )}
                {pc.status === 'dumb' && (
                  <div className="pc-dumb-info">
                    <div className="dumb-text">Needs maintenance</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reports Section */}
        <div className="reports-section">
          <h3>Reports</h3>
          
          {/* Time-based Report */}
          <div className="report-card">
            <h4>Time-based Report</h4>
            <div className="report-controls">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
              <button onClick={loadTimeBasedReport} disabled={loading}>
                Generate Report
              </button>
            </div>
            
            {timeBasedReport.length > 0 && (
              <div className="report-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Department</th>
                      <th>Location</th>
                      <th>PC</th>
                      <th>Entry Time</th>
                      <th>Exit Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeBasedReport.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.student_name}</td>
                        <td>{entry.student_id}</td>
                        <td>{entry.department}</td>
                        <td>{entry.location}</td>
                        <td>{entry.pc_number}</td>
                        <td>{formatDateTime(entry.entry_time)}</td>
                        <td>{formatDateTime(entry.exit_time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Student-based Report */}
          <div className="report-card">
            <h4>Student-based Report</h4>
            <div className="report-controls">
              <input
                type="text"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                placeholder="Enter Student ID, Name, or Department"
              />
              <button onClick={loadStudentBasedReport} disabled={loading}>
                Search Student
              </button>
            </div>
            
            {studentBasedReport.length > 0 && (
              <div className="report-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Department</th>
                      <th>Location</th>
                      <th>PC</th>
                      <th>Entry Time</th>
                      <th>Exit Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentBasedReport.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.student_name}</td>
                        <td>{entry.student_id}</td>
                        <td>{entry.department}</td>
                        <td>{entry.location}</td>
                        <td>{entry.pc_number}</td>
                        <td>{formatDateTime(entry.entry_time)}</td>
                        <td>{formatDateTime(entry.exit_time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
