import { useState } from 'react';
import './PCGrid.css';

// Mock PC data corrected to 6x6 grid (A1 to F6)
const initialPCs = {
  'A1': 'available', 'A2': 'busy', 'A3': 'busy', 'A4': 'available', 'A5': 'available', 'A6': 'available',
  'B1': 'available', 'B2': 'available', 'B3': 'busy', 'B4': 'busy', 'B5': 'busy', 'B6': 'available',
  'C1': 'available', 'C2': 'busy', 'C3': 'selection', 'C4': 'available', 'C5': 'busy', 'C6': 'busy',
  'D1': 'busy', 'D2': 'busy', 'D3': 'available', 'D4': 'busy', 'D5': 'available', 'D6': 'available', // Fixed D5, D6
  'E1': 'available', 'E2': 'busy', 'E3': 'busy', 'E4': 'busy', 'E5': 'available', 'E6': 'available', // Fixed E5, E6
  'F1': 'busy', 'F2': 'available', 'F3': 'busy', 'F4': 'available', 'F5': 'available', 'F6': 'available' // Fixed F5, F6
};

const PCGrid = () => {
  const [selectedPC, setSelectedPC] = useState('C3');
  const [pcStatus] = useState(initialPCs);

  const handlePCSelect = (pcId) => {
    if (pcStatus[pcId] === 'available') {
      setSelectedPC(pcId);
    }
  };

  const renderPCGrid = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F']; // Limited to 6 rows
    const cols = [1, 2, 3, 4, 5, 6]; // Limited to 6 columns

    return (
      <div className="pc-layout">
        {/* Column numbers */}
        <div className="col-numbers">
          {cols.map(col => (
            <div key={`col-${col}`} className="col-number">{col}</div>
          ))}
        </div>
        
        {/* Grid with row labels */}
        <div className="grid-container">
          {rows.map(row => (
            <div key={`row-${row}`} className="grid-row">
              <div className="row-label">{row}</div>
              {cols.map(col => {
                const pcId = `${row}${col}`;
                const status = pcId === selectedPC ? 'selection' : pcStatus[pcId] || 'available';
                return (
                  <div
                    key={pcId}
                    className={`pc-cell ${status}`}
                    onClick={() => handlePCSelect(pcId)}
                  >
                    <div className="computer-label">COMPUTER</div>
                    <div className="computer-id">{pcId}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pc-grid-container">
      <div className="header">
        <h2>LIBRARY COMPUTER SECTION LAYOUT</h2>
        <div className="status-indicators">
          <div className="indicator selection">SELECTION</div>
          <div className="indicator available">AVAILABLE</div>
          <div className="indicator busy">BUSY</div>
        </div>
      </div>
      {renderPCGrid()}
    </div>
  );
};

export default PCGrid;