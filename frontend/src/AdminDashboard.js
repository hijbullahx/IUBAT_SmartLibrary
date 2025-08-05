import React, { useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // We'll create this file next

function AdminDashboard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [reportData, setReportData] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // We need to set up Axios to send the CSRF token with requests
    axios.defaults.withCredentials = true;

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');
        try {
            const response = await axios.post('/api/admin/login/', { username, password });
            if (response.data.status === 'success') {
                setIsLoggedIn(true);
                setMessage('Login successful!');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed.');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/admin/logout/');
            setIsLoggedIn(false);
            setMessage('Logged out successfully.');
        } catch (error) {
            setMessage('Logout failed.');
        }
    };

    const handleFetchReport = async (e) => {
        e.preventDefault();
        setMessage('Fetching report...');
        try {
            const response = await axios.get('/api/admin/reports/time-based/', {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                },
            });
            setReportData(response.data.report);
            setMessage('Report fetched successfully.');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to fetch report.');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="admin-login">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
                <p className="status-message">{message}</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="admin-header">
                <button onClick={handleLogout}>Logout</button>
            </div>
            <p className="status-message">{message}</p>

            <div className="report-section">
                <h3>Time-Based Entry Report</h3>
                <form onSubmit={handleFetchReport}>
                    <label>
                        Start Date:
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    </label>
                    <label>
                        End Date:
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                    </label>
                    <button type="submit">Get Report</button>
                </form>

                {reportData && (
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Student ID</th>
                                <th>PC Number</th>
                                <th>Entry Time</th>
                                <th>Exit Time</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.student_name}</td>
                                    <td>{entry.student_id}</td>
                                    <td>{entry.pc_number}</td>
                                    <td>{new Date(entry.entry_time).toLocaleString()}</td>
                                    <td>{entry.exit_time ? new Date(entry.exit_time).toLocaleString() : 'N/A'}</td>
                                    <td>{entry.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;