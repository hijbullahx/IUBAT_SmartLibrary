import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ELibrary() {
  const [pcs, setPcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [selectedPC, setSelectedPC] = useState(null);
  const [message, setMessage] = useState('');

  const fetchPCStatus = async () => {
    try {
      const response = await axios.get('/api/elibrary/pc_status/');
      setPcs(response.data.pcs);
      setLoading(false);
      // After fetching, we also check if the student is already logged in to reset the UI if needed
    } catch (err) {
      setError('Failed to fetch PC status. Is the Django server running?');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCStatus();
    // Set up an interval to refresh the PC status every 10 seconds
    const interval = setInterval(fetchPCStatus, 10000);
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedPC) {
      setMessage('Please select a PC.');
      return;
    }
    setMessage('Processing...');
    try {
      const response = await axios.post('/api/entry/elibrary/checkin/', {
        student_id: studentId,
        pc_number: selectedPC.pc_number,
      });
      setMessage(response.data.message);
      setStudentId('');
      setSelectedPC(null);
      fetchPCStatus(); // Refresh the PC list to show the new status
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Network error. Is the Django server running?');
      }
    }
  };

  const handleCheckOut = async () => {
    setMessage('Processing...');
    try {
      const response = await axios.post('/api/entry/elibrary/checkout/', {
        student_id: studentId,
      });
      setMessage(response.data.message);
      setStudentId('');
      fetchPCStatus(); // Refresh the PC list
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Network error. Is the Django server running?');
      }
    }
  };

  if (loading) return <p>Loading PC status...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>E-Library PC Management</h2>
      <div className="pc-management">
        <div className="pc-status-section">
          <h3>Available PCs</h3>
          <p>Click on a PC to select it</p>
          <div className="pc-list">
            {pcs.map((pc) => (
              <div
                key={pc.pc_number}
                className={`pc-card ${pc.status} ${selectedPC?.pc_number === pc.pc_number ? 'selected' : ''}`}
                onClick={() => {
                  if (pc.status === 'available') {
                    setSelectedPC(pc);
                    setMessage(`PC ${pc.pc_number} selected.`);
                  } else {
                    setSelectedPC(null);
                    setMessage(`PC ${pc.pc_number} is ${pc.status}.`);
                  }
                }}
              >
                <h3>PC {pc.pc_number}</h3>
                <p>Status: {pc.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="action-section">
          <h3>Actions</h3>
          <div className="message-box">
            {message && <p>{message}</p>}
          </div>

          <form onSubmit={handleCheckIn}>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Student ID Barcode"
              required
            />
            <button type="submit">Check In</button>
          </form>
          <button onClick={handleCheckOut}>Check Out</button>
        </div>
      </div>
    </div>
  );
}

export default ELibrary;