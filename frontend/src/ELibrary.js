import { useState, useEffect } from 'react';
import axios from './config/axios';
import { API_ENDPOINTS } from './config/api';

function ELibrary({ scannedStudent }) {
  const [pcs, setPcs] = useState([]);
  const [selectedPc, setSelectedPc] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(true);

  useEffect(() => {
    loadPCs();
  }, []);

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

  const handlePcSelect = (pc) => {
    if (pc.status === 'available' || (pc.status === 'in-use' && !isCheckingIn)) {
      setSelectedPc(pc);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) {
      setMessage('Please enter a student ID');
      return;
    }
    if (!selectedPc) {
      setMessage('Please select a PC');
      return;
    }

    try {
      const endpoint = isCheckingIn ? API_ENDPOINTS.ELIBRARY_CHECKIN : API_ENDPOINTS.ELIBRARY_CHECKOUT;
      const response = await axios.post(endpoint, {
        student_id: studentId,
        pc_number: selectedPc.pc_number
      });
      
      setMessage(response.data.message);
      setStudentId('');
      setSelectedPc(null);
      loadPCs(); // Refresh PC status
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error processing request');
    }
  };

  const getPcStatusClass = (pc) => {
    if (pc.is_dumb) return 'pc-card dumb';
    if (pc.status === 'in-use') return 'pc-card in-use';
    if (selectedPc?.pc_number === pc.pc_number) return 'pc-card selected';
    return 'pc-card available';
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
      <div className="pc-management">
        <div className="pc-status-section">
          <h3>Computer Lab Status</h3>
          <div className="pc-list">
            {pcs.map(pc => (
              <div
                key={pc.pc_number}
                className={getPcStatusClass(pc)}
                onClick={() => handlePcSelect(pc)}
              >
                <h3>PC {pc.pc_number}</h3>
                <p className="pc-status">
                  {pc.is_dumb ? 'Out of Order' : 
                   pc.status === 'in-use' ? `In Use${pc.current_user ? ` by ${pc.current_user}` : ''}` : 
                   'Available'}
                </p>
                <div className="pc-visual">
                  <div className={`monitor ${pc.is_dumb ? 'offline' : pc.status}`}></div>
                  <div className="cpu"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-section">
          <h3>PC Management</h3>
          
          <div className="action-toggle">
            <button
              type="button"
              className={`toggle-btn ${isCheckingIn ? 'active' : ''}`}
              onClick={() => setIsCheckingIn(true)}
            >
              Check In
            </button>
            <button
              type="button"
              className={`toggle-btn ${!isCheckingIn ? 'active' : ''}`}
              onClick={() => setIsCheckingIn(false)}
            >
              Check Out
            </button>
          </div>

          <form onSubmit={handleSubmit} className="unified-form">
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder={scannedStudent ? scannedStudent.student_id : "Enter Student ID"}
              required
            />
            
            {selectedPc && (
              <div className="selected-pc-info">
                <p>Selected: PC {selectedPc.pc_number}</p>
              </div>
            )}
            
            <button
              type="submit"
              className={isCheckingIn ? 'checkin-btn' : 'checkout-btn'}
              disabled={!selectedPc}
            >
              {isCheckingIn ? 'Check In to PC' : 'Check Out from PC'}
            </button>
          </form>

          {message && (
            <div className="message-box">
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ELibrary;