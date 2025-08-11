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
  const [weeklyReport, setWeeklyReport] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [yearlyReport, setYearlyReport] = useState([]);
  const [pcs, setPcs] = useState([]);
  const [pcDetails, setPcDetails] = useState([]);
  const [liveStats, setLiveStats] = useState({});
  const [analyticsData, setAnalyticsData] = useState([]);
  const [showPcModal, setShowPcModal] = useState(false);
  const [selectedPc, setSelectedPc] = useState(null);
  const [loading, setLoading] = useState(false);

  // Report filters
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-10');
  const [studentQuery, setStudentQuery] = useState('');

  // New date selection states for weekly, monthly, yearly reports
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [isLoggedIn]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const liveStatsResponse = await axios.get(API_ENDPOINTS.ADMIN_STATS_LIVE);
      
      if (liveStatsResponse.data.status === 'success') {
        setLiveStats(liveStatsResponse.data.stats || {});
        setPcDetails(liveStatsResponse.data.pc_details || []);
      }

      const analyticsResponse = await axios.get(API_ENDPOINTS.PC_ANALYTICS);
      
      if (analyticsResponse.data.status === 'success') {
        setAnalyticsData(analyticsResponse.data.data || []);
      }

      const pcResponse = await axios.get(API_ENDPOINTS.ELIBRARY_PC_STATUS);
      
      if (pcResponse.data.status === 'success') {
        setPcs(pcResponse.data.pcs || []);
      }

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

  const handlePcClick = (pc) => {
    setSelectedPc(pc);
    setShowPcModal(true);
  };

  const togglePcStatus = async (pcNumber, newStatus) => {
    try {
      const isDumb = newStatus === 'dumb';
      const response = await axios.post(API_ENDPOINTS.ADMIN_TOGGLE_PC, {
        pc_number: pcNumber,
        is_dumb: isDumb
      });

      if (response.data.status === 'success') {
        setMessage(`PC ${pcNumber} marked as ${newStatus}`);
        // Reload data to get updated status
        loadDashboardData();
        setShowPcModal(false);
      } else {
        setMessage(`Error updating PC status: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error toggling PC status:', error);
      setMessage('Error updating PC status. Please try again.');
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
      const response = await axios.get(API_ENDPOINTS.ADMIN_REPORTS_STUDENT, {
        params: { student_query: studentQuery }
      });

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

  const loadWeeklyReport = async () => {
    setLoading(true);
    try {
      let url = API_ENDPOINTS.ADMIN_REPORTS_WEEKLY;
      
      // Add week parameter if selected
      if (selectedWeek) {
        url += `?week=${selectedWeek}`;
      }

      const response = await axios.get(url);

      if (response.data.status === 'success') {
        setWeeklyReport(response.data.report || []);
        const weekText = selectedWeek ? `Week of ${selectedWeek}` : 'Last 7 Days';
        setMessage(`Found ${response.data.report?.length || 0} entries for ${weekText}`);
      } else {
        setMessage(`Error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage('Error loading weekly report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyReport = async () => {
    setLoading(true);
    try {
      let url = API_ENDPOINTS.ADMIN_REPORTS_MONTHLY;
      
      // Add month parameter if selected
      if (selectedMonth) {
        url += `?month=${selectedMonth}`;
      }

      const response = await axios.get(url);

      if (response.data.status === 'success') {
        setMonthlyReport(response.data.report || []);
        const monthText = selectedMonth ? `${selectedMonth}` : 'Last 30 Days';
        setMessage(`Found ${response.data.report?.length || 0} entries for ${monthText}`);
      } else {
        setMessage(`Error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage('Error loading monthly report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadYearlyReport = async () => {
    setLoading(true);
    try {
      let url = API_ENDPOINTS.ADMIN_REPORTS_YEARLY;
      
      // Add year parameter if selected
      if (selectedYear) {
        url += `?year=${selectedYear}`;
      }

      const response = await axios.get(url);

      if (response.data.status === 'success') {
        setYearlyReport(response.data.report || []);
        const yearText = selectedYear ? `Year ${selectedYear}` : 'Last 365 Days';
        setMessage(`Found ${response.data.report?.length || 0} entries for ${yearText}`);
      } else {
        setMessage(`Error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage('Error loading yearly report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const printReport = (reportData, reportTitle) => {
    const printWindow = window.open('', '_blank');
    const tableHTML = generatePrintableTable(reportData, reportTitle);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle} - IUBAT Smart Library</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #2c3e50; }
            .subtitle { font-size: 16px; color: #7f8c8d; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .print-date { text-align: right; margin-top: 20px; font-size: 12px; color: #7f8c8d; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">IUBAT Smart Library</div>
            <div class="subtitle">${reportTitle}</div>
          </div>
          ${tableHTML}
          <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const generatePrintableTable = (data, title) => {
    if (!data || data.length === 0) {
      return '<p>No data available for this report.</p>';
    }

    const headers = Object.keys(data[0]);
    
    return `
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${formatHeader(header)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${headers.map(header => `<td>${formatCellValue(row[header], header)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const formatHeader = (header) => {
    return header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCellValue = (value, header) => {
    if (header.includes('time') && value) {
      return formatDateTime(value);
    }
    return value || 'N/A';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ENDPOINTS.ADMIN_LOGIN, {
        username,
        password
      });
      
      if (response.data.status === 'success') {
        setIsLoggedIn(true);
        setMessage('Login successful');
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
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

  // Helper functions for date generation
  const generateWeekOptions = () => {
    const weeks = [];
    const currentDate = new Date();
    
    // Generate last 52 weeks
    for (let i = 0; i < 52; i++) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - (i * 7));
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
      
      const weekStartStr = weekStart.toISOString().split('T')[0];
      const weekEndStr = weekEnd.toISOString().split('T')[0];
      
      weeks.push({
        value: weekStartStr,
        label: `Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`
      });
    }
    
    return weeks;
  };

  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    // Generate last 24 months
    for (let i = 0; i < 24; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      months.push({
        value: `${year}-${month.toString().padStart(2, '0')}`,
        label: `${monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      });
    }
    
    return months;
  };

  const generateYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    
    // Generate years from 1999 to current year
    for (let year = currentYear; year >= 1999; year--) {
      years.push({
        value: year.toString(),
        label: year.toString()
      });
    }
    
    return years;
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

        {/* Analytics Bar for Last 7 Days */}
        <div className="analytics-section">
          <h3>📈 PC Usage Analytics (Last 7 Days)</h3>
          <div className="analytics-bar">
            {analyticsData.length > 0 ? (
              analyticsData.map((day, index) => (
                <div key={index} className="analytics-day">
                  <div className="day-bar">
                    <div 
                      className="usage-bar"
                      style={{
                        height: `${Math.max(10, (day.usage_count / Math.max(...analyticsData.map(d => d.usage_count))) * 80)}%`
                      }}
                    ></div>
                  </div>
                  <div className="day-label">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="day-count">{day.usage_count}</div>
                </div>
              ))
            ) : (
              <div className="no-analytics">No usage data available</div>
            )}
          </div>
        </div>

        {/* Enhanced PC Status Section with Library Layout */}
        <div className="pc-status-section">
          <h3>💻 E-Library PC Layout (8 Columns × 6 PCs)</h3>
          
          {/* Library Visual Layout */}
          <div className="library-layout">
            <div className="window-wall-horizontal">
              <div className="window"></div>
              <div className="window"></div>
              <div className="window"></div>
              <div className="window"></div>
            </div>
            <div className="library-visual">
              {/* 4 column pairs with gaps */}
              {[1, 2, 3, 4].map(pairNum => {
                const leftColumnStart = (pairNum - 1) * 12 + 1;   // 1, 13, 25, 37
                const rightColumnStart = leftColumnStart + 6;     // 7, 19, 31, 43
                
                const leftColumnPcs = pcDetails.filter(pc => 
                  pc.pc_number >= leftColumnStart && pc.pc_number <= leftColumnStart + 5
                ).sort((a, b) => b.pc_number - a.pc_number); // Reverse order (6->1, 18->13, etc) top to bottom
                
                const rightColumnPcs = pcDetails.filter(pc => 
                  pc.pc_number >= rightColumnStart && pc.pc_number <= rightColumnStart + 5
                ).sort((a, b) => a.pc_number - b.pc_number); // Normal order (7->12, 19->24, etc) so 7 is at top near wall
                
                return (
                  <div key={pairNum} className="column-pair">
                    <div className="columns-content">
                      
                      {/* Left column */}
                      <div className="pc-column">
                        <div className="pc-stack">
                          {leftColumnPcs.map(pc => (
                            <div 
                              key={pc.pc_number} 
                              className={`pc-library ${pc.status} clickable`}
                              onClick={() => handlePcClick(pc)}
                            >
                              {pc.pc_number}
                              <div className="pc-tooltip">
                                <div className="tooltip-content">
                                  <div className="tooltip-title">PC {pc.pc_number}</div>
                                  {pc.user_info ? (
                                    <>
                                      <div className="tooltip-info">
                                        <span className="tooltip-label">Student: </span>
                                        <span className="tooltip-value">{pc.user_info.student_name}</span>
                                      </div>
                                      <div className="tooltip-info">
                                        <span className="tooltip-label">ID: </span>
                                        <span className="tooltip-value">{pc.user_info.student_id}</span>
                                      </div>
                                      <div className="tooltip-info">
                                        <span className="tooltip-label">Department: </span>
                                        <span className="tooltip-value">{pc.user_info.department}</span>
                                      </div>
                                      <div className="tooltip-info">
                                        <span className="tooltip-label">Since: </span>
                                        <span className="tooltip-value">{new Date(pc.user_info.entry_time).toLocaleString()}</span>
                                      </div>
                                    </>
                                  ) : pc.status === 'dumb' ? (
                                    <div className="tooltip-info">
                                      <span className="tooltip-value">Out of service - needs maintenance</span>
                                    </div>
                                  ) : (
                                    <div className="tooltip-info">
                                      <span className="tooltip-value">Available for use</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right column (no gap from left) */}
                      <div className="pc-column">
                        <div className="pc-stack">
                          {rightColumnPcs.map(pc => (
                            <div 
                              key={pc.pc_number} 
                              className={`pc-library ${pc.status} clickable`}
                              onClick={() => handlePcClick(pc)}
                            >
                              {pc.pc_number}
                              <div className="pc-tooltip">
                                <div className="tooltip-content">
                                  <div className="tooltip-title">PC {pc.pc_number}</div>
                                  {pc.user_info ? (
                                    <>
                                      <div className="tooltip-info">
                                        <span className="tooltip-label">Student: </span>
                                        <span className="tooltip-value">{pc.user_info.student_name}</span>
                                      </div>
                                      <div className="tooltip-info">
                                        <span className="tooltip-label">ID: </span>
                                        <span className="tooltip-value">{pc.user_info.student_id}</span>
                                      </div>
                                      <div className="tooltip-info">
                                        <span className="tooltip-label">Department: </span>
                                        <span className="tooltip-value">{pc.user_info.department}</span>
                                      </div>
                                      <div className="tooltip-info">
                                        <span className="tooltip-label">Since: </span>
                                        <span className="tooltip-value">{new Date(pc.user_info.entry_time).toLocaleString()}</span>
                                      </div>
                                    </>
                                  ) : pc.status === 'dumb' ? (
                                    <div className="tooltip-info">
                                      <span className="tooltip-value">Out of service - needs maintenance</span>
                                    </div>
                                  ) : (
                                    <div className="tooltip-info">
                                      <span className="tooltip-value">Available for use</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
              {timeBasedReport.length > 0 && (
                <button onClick={() => printReport(timeBasedReport, 'Time-based Report')} className="print-btn">
                  🖨️ Print
                </button>
              )}
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
              {studentBasedReport.length > 0 && (
                <button onClick={() => printReport(studentBasedReport, 'Student-based Report')} className="print-btn">
                  🖨️ Print
                </button>
              )}
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

          {/* Weekly Report */}
          <div className="report-card">
            <h4>📊 Weekly Report</h4>
            <div className="report-controls">
              <select 
                value={selectedWeek} 
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="date-select"
              >
                <option value="">Last 7 Days (Default)</option>
                {generateWeekOptions().map(week => (
                  <option key={week.value} value={week.value}>
                    {week.label}
                  </option>
                ))}
              </select>
              <button onClick={loadWeeklyReport} disabled={loading}>
                {selectedWeek ? 'Generate Selected Week Report' : 'Generate Weekly Report'}
              </button>
              {weeklyReport.length > 0 && (
                <button onClick={() => printReport(weeklyReport, selectedWeek ? `Weekly Report - Week of ${selectedWeek}` : 'Weekly Report (Last 7 Days)')} className="print-btn">
                  🖨️ Print
                </button>
              )}
            </div>
            
            {weeklyReport.length > 0 && (
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
                    {weeklyReport.map((entry, index) => (
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

          {/* Monthly Report */}
          <div className="report-card">
            <h4>📅 Monthly Report</h4>
            <div className="report-controls">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="date-select"
              >
                <option value="">Last 30 Days (Default)</option>
                {generateMonthOptions().map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <button onClick={loadMonthlyReport} disabled={loading}>
                {selectedMonth ? 'Generate Selected Month Report' : 'Generate Monthly Report'}
              </button>
              {monthlyReport.length > 0 && (
                <button onClick={() => printReport(monthlyReport, selectedMonth ? `Monthly Report - ${selectedMonth}` : 'Monthly Report (Last 30 Days)')} className="print-btn">
                  🖨️ Print
                </button>
              )}
            </div>
            
            {monthlyReport.length > 0 && (
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
                    {monthlyReport.map((entry, index) => (
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

          {/* Yearly Report */}
          <div className="report-card">
            <h4>🗓️ Yearly Report</h4>
            <div className="report-controls">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="date-select"
              >
                <option value="">Last 365 Days (Default)</option>
                {generateYearOptions().map(year => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
              <button onClick={loadYearlyReport} disabled={loading}>
                {selectedYear ? 'Generate Selected Year Report' : 'Generate Yearly Report'}
              </button>
              {yearlyReport.length > 0 && (
                <button onClick={() => printReport(yearlyReport, selectedYear ? `Yearly Report - ${selectedYear}` : 'Yearly Report (Last 365 Days)')} className="print-btn">
                  🖨️ Print
                </button>
              )}
            </div>
            
            {yearlyReport.length > 0 && (
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
                    {yearlyReport.map((entry, index) => (
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

      {/* PC Management Modal */}
      {showPcModal && selectedPc && (
        <div className="modal-overlay" onClick={() => setShowPcModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🖥️ PC {selectedPc.pc_number} Management</h3>
              <button className="modal-close" onClick={() => setShowPcModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="pc-status-info">
                <div className="status-indicator">
                  <span className={`status-dot ${selectedPc.status}`}></span>
                  <span className="status-text">
                    Status: <strong>{selectedPc.status === 'available' ? 'Available' : 
                                    selectedPc.status === 'in_use' ? 'In Use' : 'Out of Service'}</strong>
                  </span>
                </div>
                
                {selectedPc.user_info && (
                  <div className="user-details">
                    <h4>👤 Current User</h4>
                    <p><strong>Name:</strong> {selectedPc.user_info.student_name}</p>
                    <p><strong>ID:</strong> {selectedPc.user_info.student_id}</p>
                    <p><strong>Department:</strong> {selectedPc.user_info.department}</p>
                    <p><strong>Since:</strong> {new Date(selectedPc.user_info.entry_time).toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="pc-actions">
                <h4>🔧 Actions</h4>
                <div className="action-buttons">
                  {selectedPc.status === 'available' && (
                    <button 
                      className="action-btn dumb"
                      onClick={() => togglePcStatus(selectedPc.pc_number, 'dumb')}
                    >
                      ❌ Mark as Out of Service
                    </button>
                  )}
                  {selectedPc.status === 'dumb' && (
                    <button 
                      className="action-btn available"
                      onClick={() => togglePcStatus(selectedPc.pc_number, 'available')}
                    >
                      ✅ Mark as Available
                    </button>
                  )}
                  {selectedPc.status === 'in_use' && (
                    <>
                      <button 
                        className="action-btn available"
                        onClick={() => togglePcStatus(selectedPc.pc_number, 'available')}
                      >
                        🔓 Force Checkout
                      </button>
                      <button 
                        className="action-btn dumb"
                        onClick={() => togglePcStatus(selectedPc.pc_number, 'dumb')}
                      >
                        ❌ Mark as Out of Service
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
