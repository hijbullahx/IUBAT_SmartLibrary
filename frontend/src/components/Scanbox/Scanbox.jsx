import React from 'react';
import './Scanbox.css';
import barcode from '../../assets/barcode_scan_icon.png';

const Scanbox = ({ studentId, setStudentId, handleScan }) => {
  return (
    <div className="scan-section">
      <h2>Scan Your ID</h2>
      <div className="scan-box">
        <div className="scan-img">
          <img src={barcode} alt="Barcode Logo" />
        </div>
        <form onSubmit={handleScan}>
          <div className="input-container">
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter Student ID"
              className="id-input"
            />
          </div>
          <div className="button-container">
            <button type="submit" className="scan-button">
              Scan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Scanbox;