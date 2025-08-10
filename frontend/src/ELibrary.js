import { useState, useEffect, useCallback } from 'react';
import axios from './config/axios';
import { API_ENDPOINTS } from './config/api';

function ELibrary({ scannedStudent, onReturnToService }) {
  const [pcs, setPcs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserPc, setCurrentUserPc] = useState(null);

  const loadPCs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.ELIBRARY_PC_STATUS);
      setPcs(response.data.pcs || []);
      
      // Also check for current user PC when loading PCs
      if (scannedStudent) {
        const userPc = response.data.pcs?.find(pc => 
          pc.status === 'in-use' && pc.current_user === scannedStudent.student_id
        );
        setCurrentUserPc(userPc || null);
      }
    } catch (error) {
      setMessage('Error loading PC status');
    } finally {
      setLoading(false);
    }
  }, [scannedStudent]);

  const checkCurrentUserPc = useCallback(async () => {
    try {
      // Check if student is already using a PC
      const response = await axios.get(API_ENDPOINTS.ELIBRARY_PC_STATUS);
      
      const userPc = response.data.pcs?.find(pc => {
        return pc.status === 'in-use' && pc.current_user === scannedStudent.student_id;
      });
      
      setCurrentUserPc(userPc || null);
    } catch (error) {
      console.error('Error checking current user PC:', error);
    }
  }, [scannedStudent]);

  const handlePcSelect = async (pc) => {
    // If user already has a PC, prevent new selection
    if (currentUserPc) {
      setMessage(`You are already using PC ${currentUserPc.pc_number}. Please check out first to select a different PC.`);
      return;
    }

    // Only allow selection of available PCs
    if (pc.status !== 'available' || pc.is_dumb) {
      setMessage(pc.is_dumb ? 'This PC is out of order' : 'This PC is currently in use');
      return;
    }

    try {
      // Auto check-in to selected PC
      await axios.post(API_ENDPOINTS.ELIBRARY_CHECKIN, {
        student_id: scannedStudent.student_id,
        pc_number: pc.pc_number
      });
      
      setMessage(`Successfully checked in to PC ${pc.pc_number}! You can now use this computer.`);
      
      // Update current user PC immediately with the new assignment
      const newUserPc = {
        pc_number: pc.pc_number,
        status: 'in-use',
        current_user: scannedStudent.student_id,
        is_dumb: pc.is_dumb
      };
      setCurrentUserPc(newUserPc);
      
      // Refresh PC list to get updated status
      setTimeout(() => {
        loadPCs();
      }, 500);
      
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
      await axios.post(API_ENDPOINTS.ELIBRARY_CHECKOUT, {
        student_id: scannedStudent.student_id,
        pc_number: currentUserPc.pc_number
      });
      
      setMessage(`Successfully checked out from PC ${currentUserPc.pc_number}. You can now select a different PC.`);
      setCurrentUserPc(null);
      
      // Refresh PC list to show updated status
      setTimeout(() => {
        loadPCs();
      }, 500);
      
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

  useEffect(() => {
    loadPCs();
    // Check if student already has a PC assigned
    if (scannedStudent) {
      checkCurrentUserPc();
    }
  }, [scannedStudent, loadPCs, checkCurrentUserPc]);

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
        {!currentUserPc && (
          <p>Welcome {scannedStudent?.name}! Select an available PC to get started.</p>
        )}
      </div>

      {currentUserPc ? (
        <div className="current-pc-alert">
          <div className="alert-content">
            <div className="alert-icon">💻</div>
            <div className="alert-text">
              <h3>You are currently using PC {currentUserPc.pc_number}</h3>
              <p>You have an active session on PC {currentUserPc.pc_number}. You can check out to select a different PC or continue using your current session.</p>
            </div>
            <div className="alert-actions">
              <button onClick={handleCheckOut} className="checkout-alert-btn">
                Check Out from PC {currentUserPc.pc_number}
              </button>
              <button onClick={onReturnToService} className="continue-btn">
                Continue Current Session
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="pc-selection-info">
          <div className="info-content">
            <div className="info-icon">🖱️</div>
            <div className="info-text">
              <h3>Select a Computer</h3>
              <p>Click on any available PC to automatically check in and start your session.</p>
            </div>
          </div>
        </div>
      )}

      <div className="pc-status-section">
        <h3>Available Computers</h3>
        <div className="pc-grid">
          {pcs.map(pc => (
            <div
              key={pc.pc_number}
              className={`${getPcStatusClass(pc)} ${pc.status === 'available' && !currentUserPc ? 'clickable' : ''}`}
              onClick={() => currentUserPc ? null : handlePcSelect(pc)}
              style={{
                cursor: pc.status === 'available' && !pc.is_dumb && !currentUserPc ? 'pointer' : 'not-allowed',
                opacity: currentUserPc && pc.pc_number !== currentUserPc.pc_number ? 0.6 : 1
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
                    {pc.status === 'available' && !pc.is_dumb && !currentUserPc && (
                      <span className="click-hint">Click to select</span>
                    )}
                    {pc.status === 'in-use' && pc.current_user === scannedStudent?.student_id && (
                      <span className="user-indicator">YOUR PC</span>
                    )}
                    {currentUserPc && pc.status === 'available' && (
                      <span className="disabled-hint">Check out first</span>
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