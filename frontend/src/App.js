import { useState, useEffect } from 'react';
import axios from './config/axios';
import { API_ENDPOINTS } from './config/api';
import ELibrary from './ELibrary.js';
import AdminDashboard from './AdminDashboardSimple.js';
import GoodbyePage from './GoodbyePage.js';
import './App.css';
import IubatLogo from './assets/IUBAT2.png';

function App() {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [showElibrary, setShowElibrary] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const [scannedStudent, setScannedStudent] = useState(null);
  const [showGoodbye, setShowGoodbye] = useState(false);
  const [shouldShowGoodbye, setShouldShowGoodbye] = useState(false);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const [isServiceMonitor, setIsServiceMonitor] = useState(false);
  const [entryMonitorLoggedInStudents, setEntryMonitorLoggedInStudents] = useState(new Set());

  // Initialize student ID based on scanned student
  useEffect(() => {
    if (scannedStudent && showElibrary) {
      setStudentId(scannedStudent.student_id);
    }
  }, [scannedStudent, showElibrary]);

  // Handle goodbye page transition
  useEffect(() => {
    if (shouldShowGoodbye) {
      console.log('🎯 useEffect: Triggering goodbye page');
      setShowElibrary(false);
      setShowAdmin(false);
      setShowGoodbye(true);
      setShouldShowGoodbye(false);
    }
  }, [shouldShowGoodbye]);

  const handleStudentScan = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setMessage('Please enter a student ID');
      return;
    }

    const inputStudentId = studentId.trim();
    
    try {
      // First, verify the student exists
      const studentResponse = await axios.get(`${API_ENDPOINTS.STUDENTS}${inputStudentId}/`);
      
      if (studentResponse.data.status === 'success') {
        const student = studentResponse.data.student;
        
        if (isServiceMonitor) {
          // SERVICE MONITOR: Only allow access if student entered via entry monitor
          const studentKey = student.student_id;
          
          if (!entryMonitorLoggedInStudents.has(studentKey)) {
            // Student hasn't entered via entry monitor
            setMessage(`${student.name}, please scan your ID at the entry monitor first to enter the library.`);
            setLastAction('entry_required');
            setStudentId('');
            
            // Auto-clear message after 5 seconds
            setTimeout(() => {
              setMessage('');
              setLastAction('');
            }, 5000);
            return;
          }
          
          // Student is authorized, show service menu
          setScannedStudent({
            student_id: student.student_id,
            name: student.name,
            department: student.department || 'CSE'
          });
          setShowServiceMenu(true);
          setStudentId('');
        } else {
          // ENTRY MONITOR: Check if student is already tracked as logged in
          const studentKey = student.student_id;
          
          setScannedStudent({
            student_id: student.student_id,
            name: student.name,
            department: student.department || 'CSE'
          });
          
          // Check if this student is already logged in from this entry monitor
          if (entryMonitorLoggedInStudents.has(studentKey)) {
            // Student already logged in, show message without calling API
            setMessage(`${student.name} is already logged in to the library. Please use the service monitor inside for logout or e-library access.`);
            setLastAction('already_logged_in');
            setStudentId('');
            
            // Auto-clear message after 5 seconds
            setTimeout(() => {
              setMessage('');
              setScannedStudent(null);
              setLastAction('');
            }, 5000);
          } else {
            // Student not tracked, process entry
            try {
              const entryResponse = await axios.post(API_ENDPOINTS.LIBRARY_ENTRY, {
                student_id: student.student_id
              });
              
              if (entryResponse.data.action === 'login') {
                // Add student to logged-in set
                setEntryMonitorLoggedInStudents(prev => new Set([...prev, studentKey]));
                setMessage(`Welcome ${student.name}! ${entryResponse.data.message}`);
                setLastAction('login');
              } else {
                // Student was already in the system, add to set but show already logged in message
                setEntryMonitorLoggedInStudents(prev => new Set([...prev, studentKey]));
                setMessage(`${student.name} is already logged in to the library. Please use the service monitor inside for logout or e-library access.`);
                setLastAction('already_logged_in');
                
                // Reverse the logout by calling API again to restore their login state
                await axios.post(API_ENDPOINTS.LIBRARY_ENTRY, {
                  student_id: student.student_id
                });
              }
              
              setStudentId('');
              
              // Auto-clear message after 5 seconds
              setTimeout(() => {
                setMessage('');
                setScannedStudent(null);
                setLastAction('');
              }, 5000);
              
            } catch (entryError) {
              setMessage(entryError.response?.data?.message || 'Error processing library entry');
            }
          }
        }
      } else {
        setMessage(studentResponse.data.message || 'Student verification failed');
      }
    } catch (error) {
      setMessage('Student not found. Please check the ID and try again.');
    }
  };

  const handleNavigate = (view) => {
    if (view === 'main') {
      setShowElibrary(false);
      setShowGoodbye(false);
      setShowAdmin(false);
      setShowServiceMenu(false);
      setIsServiceMonitor(false);
      // Reset states for entry monitor but keep logged-in tracking
      setScannedStudent(null);
      setStudentId('');
      setMessage('');
      setLastAction('');
    } else if (view === 'service') {
      setShowElibrary(false);
      setShowGoodbye(false);
      setShowAdmin(false);
      setShowServiceMenu(false);
      setIsServiceMonitor(true);
      // Reset states for service monitor
      setScannedStudent(null);
      setStudentId('');
      setMessage('');
      setLastAction('');
    } else if (view === 'admin') {
      setShowElibrary(false);
      setShowGoodbye(false);
      setShowServiceMenu(false);
      setIsServiceMonitor(false);
      setShowAdmin(true);
    }
  };

  const getMessageClass = () => {
    if (lastAction === 'login') return 'message success';
    if (lastAction === 'logout') return 'message warning';
    if (lastAction === 'already_logged_in') return 'message info';
    if (lastAction === 'entry_required') return 'message error';
    if (message.includes('error') || message.includes('not found')) return 'message error';
    return 'message info';
  };

  const handleReturnFromGoodbye = () => {
    // Return to service monitor after goodbye (since logout happened from service monitor)
    setStudentId('');
    setMessage('');
    setScannedStudent(null);
    setShowGoodbye(false);
    setShowElibrary(false);
    setShowAdmin(false);
    setLastAction('');
    setShouldShowGoodbye(false);
    setShowServiceMenu(false);
    
    // Set to service monitor mode so user can scan again for services
    setIsServiceMonitor(true);
  };

  const handleReturnToService = () => {
    // Return from E-Library to service monitor
    setShowElibrary(false);
    setShowServiceMenu(true);
    setIsServiceMonitor(true);
  };

  const handleServiceChoice = async (choice) => {
    if (choice === 'logout') {
      // Process full library logout
      try {
        const entryResponse = await axios.post(API_ENDPOINTS.LIBRARY_ENTRY, {
          student_id: scannedStudent.student_id
        });
        
        // Remove student from entry monitor tracking since they're logging out
        setEntryMonitorLoggedInStudents(prev => {
          const updated = new Set(prev);
          updated.delete(scannedStudent.student_id);
          return updated;
        });
        
        setMessage(entryResponse.data.message);
        setLastAction(entryResponse.data.action);
        setShowServiceMenu(false);
        setShowGoodbye(true);
        
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error processing logout');
      }
    } else if (choice === 'elibrary') {
      // Go to e-library interface
      setShowServiceMenu(false);
      setShowElibrary(true);
    }
  };

  const handleBackToService = () => {
    setShowElibrary(false);
    setShowServiceMenu(true);
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
              className={`nav-btn ${!showElibrary && !showAdmin && !showGoodbye && !showServiceMenu ? 'active' : ''}`}
              onClick={() => handleNavigate('main')}
            >
              Entry Monitor
            </button>
            <button 
              className={`nav-btn ${isServiceMonitor && !showAdmin ? 'active' : ''}`}
              onClick={() => handleNavigate('service')}
            >
              Service Monitor
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
        {showGoodbye === true ? (
          <GoodbyePage 
            scannedStudent={scannedStudent}
            lastAction={lastAction}
            onReturn={handleReturnFromGoodbye}
          />
        ) : showServiceMenu === true ? (
          <div className="service-menu">
            <div className="service-container">
              <div className="student-welcome">
                <h2>Welcome, {scannedStudent?.name}!</h2>
                <p>ID: {scannedStudent?.student_id} | Department: {scannedStudent?.department}</p>
              </div>
              
              <div className="service-options">
                <h3>What would you like to do?</h3>
                
                <div className="service-buttons">
                  <button 
                    className="service-btn logout-btn"
                    onClick={() => handleServiceChoice('logout')}
                  >
                    <div className="btn-icon">🚪</div>
                    <div className="btn-text">
                      <h4>Exit Library</h4>
                      <p>Complete logout from library</p>
                    </div>
                  </button>
                  
                  <button 
                    className="service-btn elibrary-btn"
                    onClick={() => handleServiceChoice('elibrary')}
                  >
                    <div className="btn-icon">💻</div>
                    <div className="btn-text">
                      <h4>Use E-Library</h4>
                      <p>Access computers and digital resources</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : showElibrary === true ? (
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
                <div className="elibrary-actions">
                  {isServiceMonitor && (
                    <button 
                      className="back-to-service-btn"
                      onClick={handleBackToService}
                    >
                      ← Back to Services
                    </button>
                  )}
                  {!isServiceMonitor && (
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
                  )}
                </div>
              </div>
            </div>
            <ELibrary 
              scannedStudent={scannedStudent} 
              onReturnToService={handleReturnToService}
            />
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
              
              {isServiceMonitor ? (
                <>
                  <h1 className="scan-title">Library Services</h1>
                  <h2 className="scan-subtitle">E-Library & Exit Station</h2>
                  <p className="scan-description">Please scan your ID card to access services</p>
                  <p className="scan-note">Note: You must enter through the main entrance first</p>
                </>
              ) : (
                <>
                  <h1 className="scan-title">Welcome to</h1>
                  <h2 className="scan-subtitle">IUBAT Smart Library</h2>
                  <p className="scan-description">Please scan your ID card to enter the library</p>
                </>
              )}
              
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
                    {isServiceMonitor ? 'Access Services' : 'Enter Library'}
                  </button>
                </div>
              </form>

              {message && !showElibrary && !showGoodbye && !showServiceMenu && (
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
        )}
      </main>
    </div>
  );
}

export default App;