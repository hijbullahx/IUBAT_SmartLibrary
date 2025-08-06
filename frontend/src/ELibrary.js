import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ELibrary() {
  const [pcs, setPcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [selectedPC, setSelectedPC] = useState(null);
  const [message, setMessage] = useState('');
  const [actionType, setActionType] = useState('checkin'); // 'checkin' or 'checkout'

  const fetchPCStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/elibrary/pc_status/');
      if (response.data.status === 'success') {
        setPcs(response.data.pcs);
        setError(null);
      } else {
        setError('Failed to fetch PC status');
      }
      setLoading(false);
    } catch (err) {
      console.error('PC Status Error:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (actionType === 'checkin') {
      if (!selectedPC) {
        setMessage('Please select a PC for check-in.');
        return;
      }
      setMessage('Processing check-in...');
      try {
        const response = await axios.post('/api/entry/elibrary/checkin/', {
          student_id: studentId,
          pc_number: selectedPC.pc_number,
        });
        
        if (response.data.status === 'success') {
          setMessage(response.data.message);
          setStudentId('');
          setSelectedPC(null);
          fetchPCStatus();
        } else {
          setMessage(response.data.message || 'Check-in failed');
        }
      } catch (err) {
        console.error('Check-in Error:', err);
        if (err.response) {
          setMessage(err.response.data.message || 'Check-in failed');
        } else {
          setMessage('Network error. Is the Django server running?');
        }
      }
    } else {
      // Check-out
      if (!studentId.trim()) {
        setMessage('Please enter Student ID for check-out.');
        return;
      }
      
      setMessage('Processing check-out...');
      try {
        const response = await axios.post('/api/entry/elibrary/checkout/', {
          student_id: studentId,
        });
        
        if (response.data.status === 'success') {
          setMessage(response.data.message);
          setStudentId('');
          setSelectedPC(null);
          fetchPCStatus();
        } else {
          setMessage(response.data.message || 'Check-out failed');
        }
      } catch (err) {
        console.error('Check-out Error:', err);
        if (err.response) {
          setMessage(err.response.data.message || 'Check-out failed');
        } else {
          setMessage('Network error. Is the Django server running?');
        }
      }
    }
  };

  if (loading) return (
    <div className="elibrary-loading">
      <h2>E-Library PC Management</h2>
      <p>Loading PC status...</p>
    </div>
  );
  
  if (error) return (
    <div className="elibrary-error">
      <h2>E-Library PC Management</h2>
      <p style={{ color: 'red' }}>{error}</p>
      <button onClick={fetchPCStatus} className="retry-btn">Retry</button>
    </div>
  );

  return (
    <div className="elibrary-container">
      <h2>E-Library PC Management</h2>
      <p className="description">Manage PC check-ins and check-outs for the E-Library</p>
      
      <div className="pc-management">
        <div className="pc-status-section">
          <h3>PC Status ({pcs.length} PCs)</h3>
          <p>
            {actionType === 'checkin' 
              ? 'Click on an available PC to select it for check-in' 
              : 'For check-out, just enter your Student ID below'}
          </p>
          <div className="pc-list">
            {pcs.map((pc) => (
              <div
                key={pc.pc_number}
                className={`pc-card ${pc.status} ${selectedPC?.pc_number === pc.pc_number ? 'selected' : ''}`}
                onClick={() => {
                  if (actionType === 'checkin' && pc.status === 'available') {
                    setSelectedPC(pc);
                    setMessage(`PC ${pc.pc_number} selected for check-in.`);
                  } else if (actionType === 'checkin') {
                    setSelectedPC(null);
                    setMessage(`PC ${pc.pc_number} is ${pc.status} and cannot be selected.`);
                  }
                }}
              >
                <h3>PC {pc.pc_number}</h3>
                <p className="pc-status-text">
                  {pc.status === 'available' && 'Available'}
                  {pc.status === 'in-use' && 'In Use'}
                  {pc.status === 'dumb' && 'Out of Order'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="action-section">
          <h3>PC Check-In/Out</h3>
          
          <div className="action-toggle">
            <button 
              type="button"
              className={`toggle-btn ${actionType === 'checkin' ? 'active' : ''}`}
              onClick={() => {
                setActionType('checkin');
                setSelectedPC(null);
                setMessage('');
              }}
            >
              Check In
            </button>
            <button 
              type="button"
              className={`toggle-btn ${actionType === 'checkout' ? 'active' : ''}`}
              onClick={() => {
                setActionType('checkout');
                setSelectedPC(null);
                setMessage('');
              }}
            >
              Check Out
            </button>
          </div>

          {message && (
            <div className="message-box">
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="unified-form">
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder={actionType === 'checkin' 
                ? "Enter Student ID for check-in" 
                : "Enter Student ID for check-out"}
              required
            />
            
            {actionType === 'checkin' && selectedPC && (
              <div className="selected-pc-info">
                <p>Selected: PC {selectedPC.pc_number}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={actionType === 'checkin' && !selectedPC}
              className={actionType === 'checkin' ? 'checkin-btn' : 'checkout-btn'}
            >
              {actionType === 'checkin' 
                ? (selectedPC ? `Check In to PC ${selectedPC.pc_number}` : 'Select a PC First')
                : 'Check Out from PC'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ELibrary;