import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, endpoints } from '../../services/api';
import './ScannerBox.css';

const ScannerBox = ({ type = 'entry' }) => {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(endpoints.LIBRARY_ENTRY, { student_id: studentId });
      if (response.data.status === 'success') {
        if (type === 'entry') {
          navigate('/default', { state: { studentData: response.data } });
        } else {
          setMessage(response.data.message);
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="scanner-box">
      <div className="scan-area">
        <div className="scan-frame">
          {/* Scanner UI */}
          <div className="scan-lines"></div>
        </div>
        <h2>Please !!!</h2>
        <h3>Scan Your ID Card</h3>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
            autoFocus
          />
          <button type="submit">Submit</button>
        </form>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default ScannerBox;
