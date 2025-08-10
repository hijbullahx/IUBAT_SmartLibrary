import { useState, useEffect } from 'react';
import axios from './config/axios';
import { API_ENDPOINTS } from './config/api';

function ELibrary({ scannedStudent, onReturnToService }) {
  const [pcs, setPcs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserPc, setCurrentUserPc] = useState(null);

  useEffect(() => {
    loadPCs();
    // Check if student already has a PC assigned
    if (scannedStudent) {
      checkCurrentUserPc();
    }
  }, [scannedStudent]);

  const loadPCs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.ELIBRARY_PC_STATUS);
      setPcs(response.data.pcs || []);
    } catch (error) {
      setMessage('Error loading PC status');
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUserPc = async () => {
    try {
      // Check if student is already using a PC
      const response = await axios.get(`${API_ENDPOINTS.ELIBRARY_PC_STATUS}?student_id=${scannedStudent.student_id}`);
      const userPc = response.data.pcs?.find(pc => pc.current_user === scannedStudent.student_id);
      setCurrentUserPc(userPc || null);
    } catch (error) {
      console.error('Error checking current user PC:', error);
    }
  };

  const handlePcSelect = async (pc) => {
    // Only allow selection of available PCs
    if (pc.status !== 'available' || pc.is_dumb) {
      setMessage(pc.is_dumb ? 'This PC is out of order' : 'This PC is currently in use');
      return;
    }

    try {
      // Auto check-in to selected PC
      const response = await axios.post(API_ENDPOINTS.ELIBRARY_CHECKIN, {
        student_id: scannedStudent.student_id,
        pc_number: pc.pc_number
      });
      
      setMessage(`Successfully checked in to PC ${pc.pc_number}!`);
      
      // Auto return to service monitor after 2 seconds
      setTimeout(() => {
        onReturnToService();
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error checking in to PC');
    }
  };

  const handleCheckOut = async () => {
    if (!currentUserPc) {
      setMessage('No PC currently assigned to you');
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.ELIBRARY_CHECKOUT, {
        student_id: scannedStudent.student_id,
        pc_number: currentUserPc.pc_number
      });
      
      setMessage('Successfully checked out from PC. You can continue using other library services.');
      setCurrentUserPc(null);
      loadPCs(); // Refresh PC status
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error checking out from PC');
    }
  };

  const getPcStatusClass = (pc) => {
    if (pc.is_dumb) return 'pc-card dumb';
    if (pc.status === 'in-use') return 'pc-card in-use';
    return 'pc-card available';
  };

  const getPcStatusText = (pc) => {
    if (pc.is_dumb) return 'Out of Order';
    if (pc.status === 'in-use') {
      if (pc.current_user === scannedStudent?.student_id) {
        return 'Your PC';
      }
      return 'In Use';
    }
    return 'Available';
  };

  if (loading) {
    return (
      <div className="elibrary-container">
        <div className="elibrary-loading">Loading PCs...</div>
      </div>
    );
  }

  return (
    <div className="elibrary-container">
      <div className="elibrary-header">
        <h2>🖥️ E-Library - Computer Lab</h2>
        <p>Welcome {scannedStudent?.name}! Select an available PC to get started.</p>
      </div>

      {currentUserPc && (
        <div className="current-pc-section">
          <h3>Your Current PC</h3>
          <div className="current-pc-info">
            <span>You are currently using PC {currentUserPc.pc_number}</span>
            <button onClick={handleCheckOut} className="checkout-btn">
              Check Out from PC {currentUserPc.pc_number}
            </button>
          </div>
        </div>
      )}

      <div className="pc-status-section">
        <h3>Available Computers</h3>
        <div className="pc-grid">
          {pcs.map(pc => (
            <div
              key={pc.pc_number}
              className={`${getPcStatusClass(pc)} ${pc.status === 'available' ? 'clickable' : ''}`}
              onClick={() => handlePcSelect(pc)}
              style={{
                cursor: pc.status === 'available' && !pc.is_dumb ? 'pointer' : 'not-allowed'
              }}
            >
              <div className="pc-header">
                <h4>PC {pc.pc_number}</h4>
                <span className={`status-badge ${pc.is_dumb ? 'dumb' : pc.status}`}>
                  {getPcStatusText(pc)}
                </span>
              </div>
              
              <div className="pc-visual">
                <div className={`monitor ${pc.is_dumb ? 'offline' : pc.status}`}>
                  <div className="screen">
                    {pc.status === 'available' && !pc.is_dumb && (
                      <span className="click-hint">Click to select</span>
                    )}
                    {pc.status === 'in-use' && pc.current_user === scannedStudent?.student_id && (
                      <span className="user-indicator">YOU</span>
                    )}
                  </div>
                </div>
                <div className="cpu"></div>
              </div>
              
              {pc.status === 'in-use' && pc.current_user && pc.current_user !== scannedStudent?.student_id && (
                <div className="user-info">
                  <small>Used by: {pc.current_user_name || pc.current_user}</small>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="legend-section">
        <h4>Status Legend:</h4>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Available - Click to use</span>
          </div>
          <div className="legend-item">
            <div className="legend-color in-use"></div>
            <span>In Use - Occupied</span>
          </div>
          <div className="legend-item">
            <div className="legend-color dumb"></div>
            <span>Out of Order</span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message-box ${message.includes('Error') ? 'error' : 'success'}`}>
          <p>{message}</p>
        </div>
      )}

      <div className="back-section">
        <button onClick={onReturnToService} className="back-btn">
          ← Back to Service Monitor
        </button>
      </div>
    </div>
  );
}

export default ELibrary;