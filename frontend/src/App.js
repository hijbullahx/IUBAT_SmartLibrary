import { useState } from 'react';
import axios from 'axios';
import ELibrary from './ELibrary';
import './App.css';

function App() {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [showElibrary, setShowElibrary] = useState(false);

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

  return (
    <div className="App">
      <header className="header">
        <button onClick={() => setShowElibrary(false)}>Main Library</button>
        <button onClick={() => setShowElibrary(true)}>E-Library</button>
      </header>

      {!showElibrary ? (
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
      ) : (
        <ELibrary />
      )}
    </div>
  );
}

export default App;