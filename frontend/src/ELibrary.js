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
  };

  const checkCurrentUserPc = async () => {
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
  };

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
      const response = await axios.post(API_ENDPOINTS.ELIBRARY_CHECKIN, {
        student_id: scannedStudent.student_id,
        pc_number: pc.pc_number
      });
      
      setMessage(`Successfully checked in to PC ${pc.pc_number}!`);
      
      // Update current user PC immediately with the new assignment
      const newUserPc = {
        pc_number: pc.pc_number,
        status: 'in-use',
        current_user: scannedStudent.student_id,
        is_dumb: pc.is_dumb
      };
      setCurrentUserPc(newUserPc);
      
      // Immediately return to service monitor after successful PC selection
      onReturnToService();
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error checking in to PC');
    }
  };

  const getPcStatusClass = (pc) => {
    if (pc.is_dumb) return 'dumb';
    if (pc.status === 'in-use') return 'in_use';
    return 'available';
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
              <p>You have an active session on PC {currentUserPc.pc_number}. Return to the Service Monitor to manage your session.</p>
            </div>
            <div className="alert-actions">
              <button onClick={onReturnToService} className="continue-btn">
                Return to Service Monitor
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
        <h3>💻 E-Library PC Layout - Select Your Computer</h3>
        
        {/* Library Visual Layout */}
        <div className="library-layout">
          <div className="window-wall">
            <div className="window"></div>
            <div className="window"></div>
            <div className="window"></div>
          </div>
          <div className="library-visual">
            {[1, 2, 3, 4].map(rowNum => {
              const startPc = (rowNum - 1) * 12 + 1;
              const rowPcs = pcs.filter(pc => 
                pc.pc_number >= startPc && pc.pc_number <= startPc + 11
              );
              
              return (
                <div key={rowNum} className="library-row">
                  <div className="row-label">Row {rowNum}</div>
                  <div className="row-content">
                    {/* First side: PCs 1-6, 13-18, 25-30, 37-42 */}
                    <div className="table-group">
                      <div className="pc-table">
                        {rowPcs.slice(0, 3).map(pc => (
                          <div 
                            key={pc.pc_number} 
                            className={`pc-library ${getPcStatusClass(pc)} ${pc.status === 'available' && !currentUserPc ? 'clickable' : ''}`}
                            onClick={() => currentUserPc ? null : handlePcSelect(pc)}
                            style={{
                              cursor: pc.status === 'available' && !pc.is_dumb && !currentUserPc ? 'pointer' : 'not-allowed',
                              opacity: currentUserPc && pc.pc_number !== currentUserPc.pc_number ? 0.6 : 1
                            }}
                          >
                            {pc.pc_number}
                            {pc.status === 'in-use' && pc.current_user === scannedStudent?.student_id && (
                              <div style={{fontSize: '0.5rem', color: 'yellow'}}>YOUR</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="pc-table">
                        {rowPcs.slice(3, 6).map(pc => (
                          <div 
                            key={pc.pc_number} 
                            className={`pc-library ${getPcStatusClass(pc)} ${pc.status === 'available' && !currentUserPc ? 'clickable' : ''}`}
                            onClick={() => currentUserPc ? null : handlePcSelect(pc)}
                            style={{
                              cursor: pc.status === 'available' && !pc.is_dumb && !currentUserPc ? 'pointer' : 'not-allowed',
                              opacity: currentUserPc && pc.pc_number !== currentUserPc.pc_number ? 0.6 : 1
                            }}
                          >
                            {pc.pc_number}
                            {pc.status === 'in-use' && pc.current_user === scannedStudent?.student_id && (
                              <div style={{fontSize: '0.5rem', color: 'yellow'}}>YOUR</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Second side: PCs 7-12, 19-24, 31-36, 43-48 */}
                    <div className="table-group">
                      <div className="pc-table">
                        {rowPcs.slice(6, 9).map(pc => (
                          <div 
                            key={pc.pc_number} 
                            className={`pc-library ${getPcStatusClass(pc)} ${pc.status === 'available' && !currentUserPc ? 'clickable' : ''}`}
                            onClick={() => currentUserPc ? null : handlePcSelect(pc)}
                            style={{
                              cursor: pc.status === 'available' && !pc.is_dumb && !currentUserPc ? 'pointer' : 'not-allowed',
                              opacity: currentUserPc && pc.pc_number !== currentUserPc.pc_number ? 0.6 : 1
                            }}
                          >
                            {pc.pc_number}
                            {pc.status === 'in-use' && pc.current_user === scannedStudent?.student_id && (
                              <div style={{fontSize: '0.5rem', color: 'yellow'}}>YOUR</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="pc-table">
                        {rowPcs.slice(9, 12).map(pc => (
                          <div 
                            key={pc.pc_number} 
                            className={`pc-library ${getPcStatusClass(pc)} ${pc.status === 'available' && !currentUserPc ? 'clickable' : ''}`}
                            onClick={() => currentUserPc ? null : handlePcSelect(pc)}
                            style={{
                              cursor: pc.status === 'available' && !pc.is_dumb && !currentUserPc ? 'pointer' : 'not-allowed',
                              opacity: currentUserPc && pc.pc_number !== currentUserPc.pc_number ? 0.6 : 1
                            }}
                          >
                            {pc.pc_number}
                            {pc.status === 'in-use' && pc.current_user === scannedStudent?.student_id && (
                              <div style={{fontSize: '0.5rem', color: 'yellow'}}>YOUR</div>
                            )}
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
        
        {/* Legend */}
        <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <div className="pc-library available" style={{width: '20px', height: '15px'}}></div>
            Available
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <div className="pc-library in_use" style={{width: '20px', height: '15px'}}></div>
            In Use
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <div className="pc-library dumb" style={{width: '20px', height: '15px'}}></div>
            Out of Service
          </div>
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