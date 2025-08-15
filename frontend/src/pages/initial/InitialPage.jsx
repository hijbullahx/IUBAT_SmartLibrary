import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InitialPage.css';
import logo from '../../assets/iubat_logo.png';
import icon_admin from '../../assets/icon_admin.png';
import Scanbox from '../../components/Scanbox/Scanbox';
const InitialPage = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  const handleScan = (e) => {
    e.preventDefault();
    if (studentId) {
      localStorage.setItem('loginTime', new Date().toLocaleTimeString());
      localStorage.setItem('studentId', studentId);
      navigate('/default');
    }
  };

  return (
    <div className="initial-page">
      <button className="admin-button" onClick={handleAdminClick}>
        <img className="admin-icon" src={icon_admin} alt="Admin Icon" />
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
          <Scanbox
            studentId={studentId}
            setStudentId={setStudentId}
            handleScan={handleScan}
          />
        </div>
      </div>
    </div>
  );
};

export default InitialPage;