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
      student_name: `Hasibur Rahman`, // Updated to match image
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
            <div className="user-id-display">
              <h1>{userData.student_id}</h1>
              <span>Logged in</span>
            </div>
            <div className="user-details">
              <div className="detail-item">
                <label>Name:</label>
                <span>{userData.student_name}</span>
              </div>
              <div className="detail-item">
                <label>ID:</label>
                <span>{userData.student_id}</span>
              </div>
              <div className="detail-item">
                <label>Logged In:</label>
                <span>{userData.login_time}</span>
              </div>
              <div className="detail-item">
                <label>Logged Out:</label>
                <span>-</span>
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
          <h2 className="section-title">LIBRARY COMPUTER SECTION LAYOUT</h2>
          <div className="computer-grid">
            <PCGrid />
          </div>
          <div className="info-section">
            <div className="selection-box">SELECTION</div>
            <div classStatus="status-box">
              <div>AVAILABLE</div>
              <div>BUSY</div>
            </div>
            <div className="instruction-box">
              <h3>Instructions</h3>
              <p>Please TAP to Select Any COMPUTER!!!</p>
              <p>Activate Computer ?? Deactivate Computer ??</p>
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