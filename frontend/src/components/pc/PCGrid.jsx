import { useState } from 'react';
import './PCGrid.css';

// Mock PC data for initial development
const initialPCs = {
  'A1': 'available', 'A2': 'busy', 'A3': 'busy', 'A4': 'available', 'A5': 'available', 'A6': 'available',
  'B1': 'available', 'B2': 'available', 'B3': 'busy', 'B4': 'busy', 'B5': 'busy', 'B6': 'available',
  'C1': 'available', 'C2': 'busy', 'C3': 'selection', 'C4': 'available', 'C5': 'busy', 'C6': 'busy',
  'D1': 'busy', 'D2': 'busy', 'D3': 'available', 'D4': 'busy', 'D5': 'busy', 'D6': 'busy',
  'E1': 'available', 'E2': 'busy', 'E3': 'busy', 'E4': 'busy', 'E5': 'busy', 'E6': 'available',
  'F1': 'busy', 'F2': 'available', 'F3': 'busy', 'F4': 'available', 'F5': 'busy', 'F6': 'busy',
  'G1': 'available', 'G2': 'busy', 'G3': 'available', 'G4': 'busy', 'G5': 'busy', 'G6': 'available',
  'H1': 'available', 'H2': 'busy', 'H3': 'available', 'H4': 'available', 'H5': 'busy', 'H6': 'busy',
  'I1': 'available', 'I2': 'busy', 'I3': 'busy', 'I4': 'available', 'I5': 'available', 'I6': 'available'
};

const PCGrid = () => {
  const [selectedPC, setSelectedPC] = useState('C3');
  const [pcStatus] = useState(initialPCs);

  const handlePCSelect = (pcId) => {
    if (pcStatus[pcId] === 'available') {
      setSelectedPC(pcId);
    }
  };

  const renderGrid = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const cols = [1, 2, 3, 4, 5, 6];

    return (
      <div className="pc-layout">
        {/* Column Numbers */}
        <div className="col-labels">
          {cols.map(col => (
            <div key={`col-${col}`} className="col-number">{col}</div>
          ))}
        </div>

        {/* Row Labels and PC Grid */}
        <div className="grid-with-labels">
          {/* Rows */}
          <div className="row-labels">
            {rows.map(row => (
              <div key={`row-${row}`} className="row-label">{row}</div>
            ))}
          </div>

          {/* PC Grid */}
          <div className="pc-grid">
            {rows.map(row => (
              <div key={`row-${row}`} className="grid-row">
                {cols.map(col => {
                  const pcId = `${row}${col}`;
                  const status = pcId === selectedPC ? 'selection' : pcStatus[pcId];
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
      </div>
    );
  };

  return (
    <div className="pc-grid-container">
      <div className="header">
        <h2>LIBRARY PC LAYOUT</h2>
        <div className="status-indicators">
          <div className="indicator selection">SELECTION</div>
          <div className="indicator available">AVAILABLE</div>
          <div className="indicator busy">BUSY</div>
        </div>
      </div>
      {renderGrid()}
    </div>
  );
};

export default PCGrid;
