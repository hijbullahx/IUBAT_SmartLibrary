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
  const [showGoodbye, setShowGoodbye] = useState(false);

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

    // Check if this is the same student scanning again (exit scenario)
    if (scannedStudent && scannedStudent.student_id === studentId.trim()) {
      // Process exit from main library
      try {
        const entryResponse = await axios.post(API_ENDPOINTS.LIBRARY_ENTRY, {
          student_id: studentId.trim()
        });
        
        setMessage(entryResponse.data.message);
        setLastAction(entryResponse.data.action);
        setShowGoodbye(true);
        setShowElibrary(false);
        
        // Auto return to welcome screen after 5 seconds
        setTimeout(() => {
          setStudentId('');
          setMessage('');
          setStudentName('');
          setStudentDepartment('');
          setScannedStudent(null);
          setShowGoodbye(false);
          setLastAction('');
        }, 5000);
        
      } catch (entryError) {
        setMessage(entryError.response?.data?.message || 'Error processing library exit');
      }
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

        // Automatically process main library entry for new student
        try {
          const entryResponse = await axios.post(API_ENDPOINTS.LIBRARY_ENTRY, {
            student_id: student.student_id
          });
          
          setMessage(entryResponse.data.message);
          setLastAction(entryResponse.data.action);
          
          // Show e-library interface after successful main library entry
          setShowElibrary(true);
          setShowGoodbye(false);
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

  const handleNavigate = (view) => {
    if (view === 'main') {
      setStudentId('');
      setMessage('');
      setStudentName('');
      setStudentDepartment('');
      setScannedStudent(null);
      setShowElibrary(false);
      setShowGoodbye(false);
      setLastAction('');
    } else if (view === 'admin') {
      setShowElibrary(false);
      setShowGoodbye(false);
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
        {showGoodbye ? (
          <div className="goodbye-screen">
            <div className="goodbye-container">
              <div className="goodbye-icon">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#27ae60"/>
                  <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="goodbye-title">Thank You!</h1>
              <h2 className="goodbye-subtitle">{scannedStudent?.name}</h2>
              <div className="goodbye-message">
                <p className="exit-status">
                  {lastAction === 'logout' ? '✓ Successfully checked out from Main Library' : '✓ Successfully checked in to Main Library'}
                </p>
                <div className="library-rules">
                  <h3>Library Guidelines Reminder:</h3>
                  <ul>
                    <li>📚 Please return borrowed books on time</li>
                    <li>🔇 Maintain silence in study areas</li>
                    <li>📱 Keep mobile phones on silent mode</li>
                    <li>🍽️ No food or drinks in the library</li>
                    <li>💻 Properly log out from computers</li>
                    <li>🧹 Keep your area clean and organized</li>
                  </ul>
                </div>
                <p className="farewell-message">
                  {lastAction === 'logout' 
                    ? "Have a great day! Come back soon for more learning." 
                    : "Welcome to IUBAT Smart Library! Enjoy your study session."
                  }
                </p>
              </div>
              <div className="auto-return-notice">
                <p>Returning to main screen automatically...</p>
                <div className="countdown-bar"></div>
              </div>
            </div>
          </div>
        ) : showElibrary ? (
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
                <div className="scan-for-next">
                  <form onSubmit={handleStudentScan} className="next-scan-form">
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Scan next student ID..."
                      className="next-student-input"
                      autoComplete="off"
                    />
                  </form>
                </div>
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

              {message && !showElibrary && !showGoodbye && (
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