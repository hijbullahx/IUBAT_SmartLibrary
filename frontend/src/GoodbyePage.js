import React, { useState, useEffect } from 'react';
import './GoodbyePage.css';

const GoodbyePage = ({ scannedStudent, lastAction, onReturn }) => {
  const [complaint, setComplaint] = useState('');
  const [complaintType, setComplaintType] = useState('pc');
  const [countdown, setCountdown] = useState(10);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isComplaintActive, setIsComplaintActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  useEffect(() => {
    let timer;
    
    if (!timerPaused) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onReturn();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [onReturn, timerPaused]);

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaint.trim()) return;

    // Here you can add API call to submit complaint in future
    console.log('Complaint submitted:', {
      studentId: scannedStudent?.student_id,
      studentName: scannedStudent?.name,
      type: complaintType,
      message: complaint,
      timestamp: new Date().toISOString()
    });

    setShowSuccess(true);
    setComplaint('');
    
    // After successful submission, start auto-return to service monitor
    setTimeout(() => {
      setShowSuccess(false);
      setIsComplaintActive(false);
      setTimerPaused(false);
      
      // Give 3 seconds before returning to service monitor
      setTimeout(() => {
        onReturn();
      }, 3000);
    }, 2000);
  };

  const handleComplaintFocus = () => {
    // When user starts interacting with complaint section, pause timer
    if (!isComplaintActive) {
      setIsComplaintActive(true);
      setTimerPaused(true);
    }
  };

  const handleCancelComplaint = () => {
    // User cancels complaint, resume timer
    setComplaint('');
    setIsComplaintActive(false);
    setTimerPaused(false);
    setShowSuccess(false);
  };

  return (
    <div className="goodbye-page">
      <div className="goodbye-container">
        {/* Header Section */}
        <div className="goodbye-header">
          <div className="goodbye-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#27ae60"/>
              <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="goodbye-title">Thank You!</h1>
          <h2 className="goodbye-student-name">{scannedStudent?.name}</h2>
          <p className="goodbye-student-info">
            ID: {scannedStudent?.student_id} | Department: {scannedStudent?.department}
          </p>
        </div>

        {/* Status Section */}
        <div className="status-section">
          <div className={`status-badge ${lastAction}`}>
            {lastAction === 'logout' ? '✓ Successfully Checked Out' : '✓ Successfully Checked In'}
          </div>
          <p className="status-message">
            {lastAction === 'logout' 
              ? "You have successfully exited the main library. Have a great day!" 
              : "Welcome to IUBAT Smart Library! Enjoy your study session."
            }
          </p>
        </div>

        {/* Library Guidelines */}
        <div className="guidelines-section">
          <h3>📚 Library Guidelines Reminder</h3>
          <div className="guidelines-grid">
            <div className="guideline-item">
              <span className="guideline-icon">📚</span>
              <span>Return books on time</span>
            </div>
            <div className="guideline-item">
              <span className="guideline-icon">🔇</span>
              <span>Maintain silence</span>
            </div>
            <div className="guideline-item">
              <span className="guideline-icon">📱</span>
              <span>Silent mode phones</span>
            </div>
            <div className="guideline-item">
              <span className="guideline-icon">🍽️</span>
              <span>No food or drinks</span>
            </div>
            <div className="guideline-item">
              <span className="guideline-icon">💻</span>
              <span>Log out properly</span>
            </div>
            <div className="guideline-item">
              <span className="guideline-icon">🧹</span>
              <span>Keep area clean</span>
            </div>
          </div>
        </div>

        {/* Complaint Section */}
        <div className="complaint-section">
          <h3>🛠️ Report an Issue</h3>
          <p className="complaint-subtitle">Found a problem? Let us know!</p>
          
          {showSuccess && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              Thank you for your feedback! We'll address this issue soon.
              <div style={{marginTop: '10px', fontSize: '0.9rem', color: '#155724'}}>
                Returning to service monitor shortly...
              </div>
            </div>
          )}
          
          {!showSuccess && (
            <form onSubmit={handleComplaintSubmit} className="complaint-form">
              <div className="complaint-type">
                <label>Issue Type:</label>
                <div className="type-buttons">
                  <button 
                    type="button"
                    className={`type-btn ${complaintType === 'pc' ? 'active' : ''}`}
                    onClick={() => {
                      setComplaintType('pc');
                      handleComplaintFocus();
                    }}
                  >
                    💻 PC Issue
                  </button>
                  <button 
                    type="button"
                    className={`type-btn ${complaintType === 'facility' ? 'active' : ''}`}
                    onClick={() => {
                      setComplaintType('facility');
                      handleComplaintFocus();
                    }}
                  >
                    🏢 Facility Issue
                  </button>
                  <button 
                    type="button"
                    className={`type-btn ${complaintType === 'other' ? 'active' : ''}`}
                    onClick={() => {
                      setComplaintType('other');
                      handleComplaintFocus();
                    }}
                  >
                    ❓ Other
                  </button>
                </div>
              </div>
              
              <div className="complaint-input">
                <textarea
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  onFocus={handleComplaintFocus}
                  placeholder={`Describe the ${complaintType === 'pc' ? 'PC' : complaintType} issue you encountered...`}
                  rows="3"
                  maxLength="500"
                />
                <div className="char-count">{complaint.length}/500</div>
              </div>
              
              <div className="complaint-actions">
                <button type="submit" className="submit-complaint-btn" disabled={!complaint.trim()}>
                  Submit Report
                </button>
                {isComplaintActive && (
                  <button 
                    type="button" 
                    className="cancel-complaint-btn"
                    onClick={handleCancelComplaint}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Auto Return Section */}
        <div className="auto-return-section">
          {timerPaused ? (
            <div className="timer-paused">
              <span className="pause-icon">⏸️</span>
              <span className="pause-text">Timer paused - Take your time with the report</span>
            </div>
          ) : (
            <>
              <div className="countdown-display">
                <span className="countdown-text">Returning to service monitor in</span>
                <span className="countdown-number">{countdown}</span>
                <span className="countdown-text">seconds</span>
              </div>
              <div className="countdown-bar">
                <div 
                  className="countdown-progress" 
                  style={{width: `${(countdown / 10) * 100}%`}}
                ></div>
              </div>
            </>
          )}
          <button className="return-now-btn" onClick={onReturn}>
            Return to Service Monitor Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoodbyePage;
