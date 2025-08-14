import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InitialPage.css';
import logo from '../../assets/iubat_logo.png';
import barcode from '../../assets/barcode_scan_icon.png';
import icon_admin from '../../assets/icon_admin.png';


const InitialPage = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  const handleScan = (e) => {
    e.preventDefault();
    if (studentId) {
      // Save login time and navigate to PC selection
      localStorage.setItem('loginTime', new Date().toLocaleTimeString());
      localStorage.setItem('studentId', studentId);
      navigate('/default');
    }
  };

  return (
    <div className="initial-page">
      <button className="admin-button" onClick={handleAdminClick}>
        <div>
          <img className="admin-icon" src={icon_admin} alt="Admin Icon" />
        </div>
        Admin
      </button>
      <div className="initial-content">
        <div className="main-section">
          <div className="university-section">
            <div className="image-placeholder">
              <img src={logo} alt="IUBAT Logo" />
            </div>
            <h1>IUBAT Library <br /> Entry System</h1>
          </div>
          <div className="scan-section">
            <h2>Scan Your ID</h2>
            <div className="scan-box">
              <div className="scan-img">
                <img src={barcode} alt="Barcode Logo" />
              </div>
              <form onSubmit={handleScan}>
                <div className="input-container">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID"
                    className="id-input"
                  />
                </div>
                <div className="button-container">
                  <button type="submit" className="scan-button">
                    Scan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialPage;