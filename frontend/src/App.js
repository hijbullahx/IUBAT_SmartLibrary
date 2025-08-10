import { useState, useEffect } from 'react';
import axios from './config/axios';
import { API_ENDPOINTS } from './config/api';
import ELibrary from './ELibrary.js';
import AdminDashboard from './AdminDashboardSimple.js';
import './App.css';
import IubatLogo from './assets/IUBAT2.png';

function App() {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');
  const [showElibrary, setShowElibrary] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const [scannedStudent, setScannedStudent] = useState(null);
  const [showLibrarySection, setShowLibrarySection] = useState(false);

  // Initialize student ID based on scanned student
  useEffect(() => {
    if (scannedStudent && showElibrary) {
      setStudentId(scannedStudent.student_id);
    }
  }, [scannedStudent, showElibrary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');
    try {
      const response = await axios.post(API_ENDPOINTS.LIBRARY_ENTRY, { student_id: studentId });
      setMessage(response.data.message);
      setStudentName(response.data.student_name || '');
      setLastAction(response.data.action || '');
      setStudentId('');
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Network error. Is the Django server running?');
      }
      setStudentName('');
      setLastAction('');
    }
  };

  const handleStudentScan = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setMessage('Please enter a student ID');
      return;
    }

    try {
      const response = await axios.get(`${API_ENDPOINTS.STUDENTS}${studentId}/`);
      
      // Handle the response format from backend
      if (response.data.status === 'success') {
        const student = response.data.student;
        setScannedStudent({
          student_id: student.student_id,
          name: student.name,
          department: student.department || 'CSE'
        });
        setStudentName(student.name);
        setStudentDepartment(student.department || 'CSE');
        setShowLibrarySection(true);
        setMessage(`Welcome ${student.name}! Choose your library service.`);
      } else {
        setMessage(response.data.message || 'Student verification failed');
        setScannedStudent(null);
        setStudentName('');
        setStudentDepartment('');
        setShowLibrarySection(false);
      }
    } catch (error) {
      setMessage('Student not found. Please check the ID and try again.');
      setScannedStudent(null);
      setStudentName('');
      setStudentDepartment('');
      setShowLibrarySection(false);
    }
  };

  const handleMainLibraryAccess = async () => {
    if (!scannedStudent) return;

    try {
      const response = await axios.post(API_ENDPOINTS.LIBRARY_ENTRY, {
        student_id: scannedStudent.student_id
      });
      
      setMessage(response.data.message);
      setStudentName(response.data.student_name || scannedStudent.name);
      setLastAction(response.data.action);
      
      // Reset for next student after 4 seconds
      setTimeout(() => {
        resetForNextStudent();
      }, 4000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error processing library entry');
    }
  };

  const goToElibrary = () => {
    setShowElibrary(true);
    setShowLibrarySection(false);
  };

  const resetForNextStudent = () => {
    setStudentId('');
    setMessage('');
    setStudentName('');
    setStudentDepartment('');
    setScannedStudent(null);
    setShowLibrarySection(false);
    setShowElibrary(false);
    setLastAction('');
  };

  const handleNavigate = (view) => {
    if (view === 'main') {
      resetForNextStudent();
    } else if (view === 'admin') {
      setShowElibrary(false);
      setShowLibrarySection(false);
      setShowAdmin(true);
    }
  };

  const getMessageClass = () => {
    if (lastAction === 'login') return 'message success';
    if (lastAction === 'logout') return 'message warning';
    if (message.includes('error') || message.includes('not found')) return 'message error';
    return 'message info';
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="logo-title">
            <img src={IubatLogo} alt="IUBAT Logo" className="iubat-logo" />
            <h1>IUBAT Smart Library</h1>
          </div>
                    <nav className="nav-menu">
            <button 
              className={`nav-btn ${!showElibrary && !showAdmin ? 'active' : ''}`}
              onClick={() => handleNavigate('main')}
            >
              Smart Library
            </button>
            <button 
              className={`nav-btn ${showAdmin ? 'active' : ''}`}
              onClick={() => handleNavigate('admin')}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {showLibrarySection ? (
          <div className="library-selection">
            <div className="student-welcome-card">
              <h2>Welcome to IUBAT Smart Library</h2>
              <div className="student-info">
                <h3>{scannedStudent.name}</h3>
                <p><strong>ID:</strong> {scannedStudent.student_id}</p>
                <p><strong>Department:</strong> {scannedStudent.department}</p>
              </div>
            </div>
            
            <div className="service-selection">
              <h3>Choose Your Library Service</h3>
              <div className="service-buttons">
                <button 
                  className="service-btn main-library-btn"
                  onClick={handleMainLibraryAccess}
                >
                  <div className="service-icon">📚</div>
                  <h4>Main Library</h4>
                  <p>Access the main library for books and study area</p>
                </button>
                
                <button 
                  className="service-btn elibrary-btn"
                  onClick={goToElibrary}
                >
                  <div className="service-icon">💻</div>
                  <h4>E-Library</h4>
                  <p>Use computers for research and digital resources</p>
                </button>
              </div>
            </div>

            {message && (
              <div className={getMessageClass()}>
                <div className="message-content">
                  <p>{message}</p>
                  {lastAction && (
                    <span className={`action-badge ${lastAction}`}>
                      {lastAction === 'login' ? 'CHECKED IN' : 'CHECKED OUT'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : showElibrary ? (
          <div className="elibrary-section">
            <div className="elibrary-header">
              <h2>E-Library - Computer Lab</h2>
              <div className="student-info-bar">
                <span><strong>{scannedStudent.name}</strong> ({scannedStudent.student_id}) - {scannedStudent.department}</span>
                <button className="back-btn" onClick={() => setShowLibrarySection(true)}>
                  ← Back to Services
                </button>
              </div>
            </div>
            <ELibrary scannedStudent={scannedStudent} />
          </div>
        ) : showAdmin ? (
          <AdminDashboard />
        ) : (
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
              <h1 className="scan-title">Please !!!</h1>
              <h2 className="scan-subtitle">Scan Your ID Card</h2>
              
              <form onSubmit={handleStudentScan} className="scan-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID (e.g., 22303089)"
                    required
                    className="student-input-large"
                    autoComplete="off"
                    autoFocus
                  />
                  <button type="submit" className="scan-btn">
                    Verify Student
                  </button>
                </div>
              </form>

              {message && !showLibrarySection && (
                <div className={getMessageClass()}>
                  <p>{message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;