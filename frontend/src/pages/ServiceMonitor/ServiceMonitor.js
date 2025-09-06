import React, { useState, useEffect } from 'react';
import ServiceMenu from '../../components/ServiceMonitor/ServiceMenu/ServiceMenu';
import PCComplaint from '../../components/ServiceMonitor/PCComplaint/PCComplaint';
import ELibraryAccess from '../../components/ServiceMonitor/ELibraryAccess/ELibraryAccess';
import StudentStatus from '../../components/ServiceMonitor/StudentStatus/StudentStatus';
import './ServiceMonitor.css';

const ServiceMonitor = ({ 
  entryMonitorLoggedInStudents,
  setEntryMonitorLoggedInStudents,
  scannedStudent,
  setScannedStudent,
  setShowGoodbye
}) => {
  const [showServiceMenu, setShowServiceMenu] = useState(true);
  const [showELibrary, setShowELibrary] = useState(false);
  const [showPCComplaint, setShowPCComplaint] = useState(false);
  const [currentUserPc, setCurrentUserPc] = useState(null);

  const handleServiceChoice = (choice) => {
    switch(choice) {
      case 'elibrary':
        setShowELibrary(true);
        setShowServiceMenu(false);
        break;
      case 'complaint':
        setShowPCComplaint(true);
        setShowServiceMenu(false);
        break;
      case 'logout':
        setShowGoodbye(true);
        break;
      default:
        setShowServiceMenu(true);
        setShowELibrary(false);
        setShowPCComplaint(false);
    }
  };

  return (
    <div className="service-monitor">
      <StudentStatus 
        scannedStudent={scannedStudent}
        currentUserPc={currentUserPc}
      />
      
      {showServiceMenu && (
        <ServiceMenu 
          onServiceChoice={handleServiceChoice}
        />
      )}

      {showELibrary && (
        <ELibraryAccess 
          scannedStudent={scannedStudent}
          onBack={() => handleServiceChoice('menu')}
        />
      )}

      {showPCComplaint && (
        <PCComplaint 
          scannedStudent={scannedStudent}
          currentUserPc={currentUserPc}
          onBack={() => handleServiceChoice('menu')}
        />
      )}
    </div>
  );
};

export default ServiceMonitor;