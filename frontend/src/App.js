import { useState } from 'react';
import axios from 'axios';
import ELibrary from './ELibrary';
import AdminDashboard from './AdminDashboard'; // Import the new component
import './App.css';

function App() {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [showElibrary, setShowElibrary] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false); // New state for admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');
    try {
      const response = await axios.post('/api/entry/library/', { student_id: studentId });
      setMessage(response.data.message);
      setStudentId('');
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Network error. Is the Django server running?');
      }
    }
  };

  const handleNavigate = (view) => {
    setShowElibrary(view === 'elibrary');
    setShowAdmin(view === 'admin');
  };

  return (
    <div className="App">
      <header className="header">
        <button onClick={() => handleNavigate('main')}>Main Library</button>
        <button onClick={() => handleNavigate('elibrary')}>E-Library</button>
        <button onClick={() => handleNavigate('admin')}>Admin</button>
      </header>

      {!showElibrary && !showAdmin ? (
        <div>
          <h1>Main Library Entry/Exit</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Scan Student ID Barcode"
              required
            />
            <button type="submit">Submit</button>
          </form>
          <div className="message">
            {message && <p>{message}</p>}
          </div>
        </div>
      ) : showElibrary ? (
        <ELibrary />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
}

export default App;