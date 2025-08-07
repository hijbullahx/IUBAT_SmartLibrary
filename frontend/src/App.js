import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from './config/api';
import ELibrary from './ELibrary';
import AdminDashboard from './AdminDashboard';
import './App.css';
import IubatLogo from './assets/IUBAT2.png';

function App() {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  const [showElibrary, setShowElibrary] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [lastAction, setLastAction] = useState('');

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

  const handleNavigate = (view) => {
    setShowElibrary(view === 'elibrary');
    setShowAdmin(view === 'admin');
    setMessage('');
    setStudentName('');
    setLastAction('');
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
          <nav className="nav-buttons">
            <button 
              onClick={() => handleNavigate('main')}
              className={!showElibrary && !showAdmin ? 'active' : ''}
            >
              Main Library
            </button>
            <button 
              onClick={() => handleNavigate('elibrary')}
              className={showElibrary ? 'active' : ''}
            >
              E-Library
            </button>
            <button 
              onClick={() => handleNavigate('admin')}
              className={showAdmin ? 'active' : ''}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {!showElibrary && !showAdmin ? (
          <div className="main-library">
            <div className="entry-section">
              <h2>Main Library Entry/Exit System</h2>
              <p className="description">
                Scan your student ID barcode or enter manually to check in/out of the main library
              </p>
              
              <form onSubmit={handleSubmit} className="entry-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID (e.g., 21303018)"
                    required
                    className="student-input"
                    autoComplete="off"
                  />
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                </div>
              </form>

              {message && (
                <div className={getMessageClass()}>
                  <div className="message-content">
                    {studentName && (
                      <h3>{studentName}</h3>
                    )}
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
          </div>
        ) : showElibrary ? (
          <ELibrary />
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

export default App;