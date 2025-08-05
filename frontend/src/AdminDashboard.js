import React, { useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState('');

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

    if (!isLoggedIn) {
        return (
            <div className="admin-login">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p>{message}</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h2>Welcome to the Admin Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <p>{message}</p>
            {/* The reports will go here */}
        </div>
    );
}

export default AdminDashboard;