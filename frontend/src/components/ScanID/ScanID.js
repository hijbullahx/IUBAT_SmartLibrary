import React, { useState } from 'react';
import axios from '../../config/axios';
import { API_ENDPOINTS } from '../../config/api';
import './ScanID.css';

const ScanID = ({ 
  entryMonitorLoggedInStudents, 
  setEntryMonitorLoggedInStudents, 
  setMessage, 
  setLastAction,
  isServiceMonitor 
}) => {
  const [studentId, setStudentId] = useState('');

  const handleStudentScan = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setMessage('Please enter a student ID');
      return;
    }

    const inputStudentId = studentId.trim();
    
    try {
      const studentResponse = await axios.get(`${API_ENDPOINTS.STUDENTS}${inputStudentId}/`);
      
      if (studentResponse.data.status === 'success') {
        const student = studentResponse.data.student;
        const studentKey = student.student_id;
        
        if (isServiceMonitor && !entryMonitorLoggedInStudents.has(studentKey)) {
          setMessage(`${student.name}, please scan your ID at the entry monitor first to enter the library.`);
          setLastAction('entry_required');
          setStudentId('');
          
          setTimeout(() => {
            setMessage('');
            setLastAction('');
          }, 5000);
          return;
        }
        
        if (!isServiceMonitor && entryMonitorLoggedInStudents.has(studentKey)) {
          setMessage(`${student.name} is already logged in to the library. Please use the service monitor inside for logout or e-library access.`);
          setLastAction('already_logged_in');
          setStudentId('');
          
          setTimeout(() => {
            setMessage('');
            setLastAction('');
          }, 5000);
          return;
        }

        try {
          const entryResponse = await axios.post(API_ENDPOINTS.LIBRARY_ENTRY, {
            student_id: student.student_id
          });
          
          if (entryResponse.data.action === 'login') {
            setEntryMonitorLoggedInStudents(prev => new Set([...prev, studentKey]));
            setMessage(`Welcome ${student.name}! ${entryResponse.data.message}`);
            setLastAction('login');
          }
          
          setStudentId('');
          
          setTimeout(() => {
            setMessage('');
            setLastAction('');
          }, 5000);
          
        } catch (entryError) {
          setMessage(entryError.response?.data?.message || 'Error processing library entry');
        }
      } else {
        setMessage(studentResponse.data.message || 'Student verification failed');
      }
    } catch (error) {
      setMessage('Student not found. Please check the ID and try again.');
    }
  };

  return (
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
  );
};

export default ScanID;