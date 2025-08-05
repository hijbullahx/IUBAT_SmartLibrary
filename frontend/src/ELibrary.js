import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ELibrary() {
  const [pcs, setPcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPCStatus = async () => {
    try {
      const response = await axios.get('/api/elibrary/pc_status/');
      setPcs(response.data.pcs);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch PC status. Is the Django server running?');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCStatus();
  }, []);

  if (loading) return <p>Loading PC status...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>E-Library PC Status</h2>
      <div className="pc-list">
        {pcs.map((pc) => (
          <div key={pc.pc_number} className={`pc-card ${pc.status}`}>
            <h3>PC {pc.pc_number}</h3>
            <p>Status: {pc.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ELibrary;