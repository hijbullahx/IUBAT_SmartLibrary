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
      // First, verify the student exists
      const studentResponse = await axios.get(`${API_ENDPOINTS.STUDENTS}${studentId}/`);
      
      if (studentResponse.data.status === 'success') {
        const student = studentResponse.data.student;
        setScannedStudent({
          student_id: student.student_id,
          name: student.name,
          department: student.department || 'CSE'
        });
        setStudentName(student.name);
        setStudentDepartment(student.department || 'CSE');

        // Automatically process main library entry
        try {
          const entryResponse = await axios.post(API_ENDPOINTS.LIBRARY_ENTRY, {
            student_id: student.student_id
          });
          
          setMessage(entryResponse.data.message);
          setLastAction(entryResponse.data.action);
          
          // Show e-library interface after successful main library entry
          setShowElibrary(true);
          setStudentId(''); // Clear the input for e-library use
          
        } catch (entryError) {
          setMessage(entryError.response?.data?.message || 'Error processing main library entry');
        }
      } else {
        setMessage(studentResponse.data.message || 'Student verification failed');
        setScannedStudent(null);
        setStudentName('');
        setStudentDepartment('');
      }
    } catch (error) {
      setMessage('Student not found. Please check the ID and try again.');
      setScannedStudent(null);
      setStudentName('');
      setStudentDepartment('');
    }
  };

  const resetForNextStudent = () => {
    setStudentId('');
    setMessage('');
    setStudentName('');
    setStudentDepartment('');
    setScannedStudent(null);
    setShowElibrary(false);
    setLastAction('');
  };

  const handleNavigate = (view) => {
    if (view === 'main') {
      resetForNextStudent();
    } else if (view === 'admin') {
      setShowElibrary(false);
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
        {showElibrary ? (
          <div className="elibrary-section">
            <div className="elibrary-header">
              <h2>IUBAT Smart Library - E-Library Section</h2>
              <div className="student-info-bar">
                <div className="student-details">
                  <span><strong>{scannedStudent.name}</strong> ({scannedStudent.student_id}) - {scannedStudent.department}</span>
                  {message && (
                    <div className="entry-status">
                      <span className={`status-badge ${lastAction}`}>
                        {lastAction === 'login' ? '✓ ENTERED MAIN LIBRARY' : '✓ EXITED MAIN LIBRARY'}
                      </span>
                    </div>
                  )}
                </div>
                <button className="new-student-btn" onClick={resetForNextStudent}>
                  New Student
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
              <h1 className="scan-title">Welcome to</h1>
              <h2 className="scan-subtitle">IUBAT Smart Library</h2>
              <p className="scan-description">Please scan your ID card to enter the library</p>
              
              <form onSubmit={handleStudentScan} className="scan-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID (e.g., 22303142)"
                    required
                    className="student-input-large"
                    autoComplete="off"
                    autoFocus
                  />
                  <button type="submit" className="scan-btn">
                    Enter Library
                  </button>
                </div>
              </form>

              {message && !showElibrary && (
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