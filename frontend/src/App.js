import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');
    try {
      // Make a POST request to the Django API
      const response = await axios.post('/api/entry/library/', { student_id: studentId });
      setMessage(response.data.message);
      setStudentId(''); // Clear the input field
    } catch (error) {
      // Handle errors from the API
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Network error. Is the Django server running?');
      }
    }
  };

  return (
    <div className="App">
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
  );
}

export default App;