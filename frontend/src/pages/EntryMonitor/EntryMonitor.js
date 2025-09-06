import React, { useState } from 'react';
import ScanID from '../../components/ScanID/ScanID';
import './EntryMonitor.css';

const EntryMonitor = ({ 
  entryMonitorLoggedInStudents, 
  setEntryMonitorLoggedInStudents 
}) => {
  const [message, setMessage] = useState('');
  const [lastAction, setLastAction] = useState('');

  const getMessageClass = () => {
    if (lastAction === 'login') return 'message success';
    if (lastAction === 'logout') return 'message warning';
    if (lastAction === 'already_logged_in') return 'message info';
    if (lastAction === 'entry_required') return 'message error';
    if (message.includes('error') || message.includes('not found')) return 'message error';
    return 'message info';
  };

  return (
    <div className="scan-screen">
      <div className="scan-container">
        <div className="barcode-icon">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="2" height="16" fill="#2c3e50"/>
            <rect x="5" y="4" width="1" height="16" fill="#2c3e50"/>
            <rect x="7" y="4" width="2" height="16" fill="#2c3e50"/>
            <rect x="10" y="4" width="1" height="16" fill="#2c3e50"/>
            <rect x="12" y="4" width="3" height="16" fill="#2c3e50"/>
            <rect x="16" y="4" width="1" height="16" fill="#2c3e50"/>
            <rect x="18" y="4" width="2" height="16" fill="#2c3e50"/>
            <rect x="21" y="4" width="1" height="16" fill="#2c3e50"/>
          </svg>
        </div>

        <h1 className="scan-title">Welcome to</h1>
        <h2 className="scan-subtitle">IUBAT Smart Library</h2>
        <p className="scan-description">Please scan your ID card to enter the library</p>

        <ScanID 
          entryMonitorLoggedInStudents={entryMonitorLoggedInStudents}
          setEntryMonitorLoggedInStudents={setEntryMonitorLoggedInStudents}
          setMessage={setMessage}
          setLastAction={setLastAction}
          isServiceMonitor={false}
        />

        {message && (
          <div className={getMessageClass()}>
            <p>{message}</p>
            {lastAction === 'entry_required' && (
              <p style={{marginTop: '10px', fontSize: '0.9rem', fontWeight: '500'}}>
                👈 Please use the Entry Monitor to scan in first
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryMonitor;