import { useState } from 'react';

function AdminDashboardTest() {
  const [message, setMessage] = useState('Admin Dashboard Test Working');

  return (
    <div>
      <h2>Admin Dashboard Test</h2>
      <p>{message}</p>
    </div>
  );
}

export default AdminDashboardTest;
