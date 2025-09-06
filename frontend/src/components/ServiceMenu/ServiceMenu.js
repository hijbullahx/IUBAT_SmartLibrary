import React from 'react';
import './ServiceMenu.css';

const ServiceMenu = ({ onServiceChoice }) => {
  return (
    <div className="service-menu">
      <h2>Library Services</h2>
      <div className="service-buttons">
        <button 
          className="service-btn elibrary"
          onClick={() => onServiceChoice('elibrary')}
        >
          Access E-Library
        </button>
        <button 
          className="service-btn complaint"
          onClick={() => onServiceChoice('complaint')}
        >
          Report PC Issue
        </button>
        <button 
          className="service-btn logout"
          onClick={() => onServiceChoice('logout')}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ServiceMenu;