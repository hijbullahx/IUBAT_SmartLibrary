import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PCGrid from '../../components/PCGrid/PCGrid';
import Scanbox from '../../components/Scanbox/Scanbox';
import './DefaultPage.css';

const DefaultPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [exitId, setExitId] = useState('');

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    const loginTime = localStorage.getItem('loginTime');
    
    if (!studentId || !loginTime) {
      navigate('/');
      return;
    }

    setUserData({
      student_id: studentId,
      student_name: `Student ${studentId}`, // Replace with API call if available
      login_time: loginTime
    });
  }, [navigate]);

  const handleExitScan = (e) => {
    e.preventDefault();
    if (exitId && exitId === userData.student_id) {
      localStorage.removeItem('studentId');
      localStorage.removeItem('loginTime');
      navigate('/');
    } else {
      alert('Invalid ID or mismatch with logged-in student ID.');
    }
  };

  if (!userData) return null;

  return (
    <div className="default-page">
      <div className="dashboard-container">
        <div className="left-panel">
          <div className="user-profile">
            <div className="profile-header">
              <h2>Welcome {userData.student_name}</h2>
            </div>
            <div className="user-info">
              <div className="info-item">
                <label>ID:</label>
                <span>{userData.student_id}</span>
              </div>
              <div className="info-item">
                <label>Logged In:</label>
                <span>{userData.login_time}</span>
              </div>
            </div>
            <div className="scanner-section">
              <Scanbox
                studentId={exitId}
                setStudentId={setExitId}
                handleScan={handleExitScan}
              />
            </div>
          </div>
        </div>
        <div className="right-panel">
          <PCGrid />
          <div className="instructions">
            <div className="instruction-box">
              <h3>Instructions</h3>
              <ul>
                <li>Please TAP to Select Any COMPUTER</li>
                <li>After finishing, you must deactivate your computer</li>
                <li>Scan your ID again & TAP to Deactivate</li>
                <li>Please inform desk for any help</li>
              </ul>
            </div>
            <div className="warning-box">
              <h3>Warning!</h3>
              <p>Do not left turn ON your Computer after usage & your Selected Computer must be Deactivate TO EXIT.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;