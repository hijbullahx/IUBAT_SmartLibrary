import React from 'react';
import './StudentStatus.css';

const StudentStatus = ({ scannedStudent, currentUserPc }) => {
  return (
    <div className="student-status">
      {scannedStudent && (
        <>
          <h2>Welcome, {scannedStudent.name}</h2>
          <div className="status-details">
            <p>ID: {scannedStudent.student_id}</p>
            <p>Department: {scannedStudent.department}</p>
            {currentUserPc && (
              <p>Current PC: {currentUserPc}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentStatus;