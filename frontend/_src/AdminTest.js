import React, { useState } from 'react';
import axios from './config/axios';
import { API_ENDPOINTS } from './config/api';

function AdminTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing admin login...\n');
    
    try {
      console.log('=== BROWSER DEBUG INFO ===');
      console.log('Current URL:', window.location.href);
      console.log('Document domain:', document.domain);
      console.log('Browser cookies before login:', document.cookie);
      
      const response = await axios.post(API_ENDPOINTS.ADMIN_LOGIN, {
        username: 'admin',
        password: 'admin123'
      });
      
      console.log('Login response received:', response);
      console.log('Browser cookies after login:', document.cookie);
      
      setResult(prev => prev + `✅ Login successful: ${JSON.stringify(response.data)}\n`);
      return true;
    } catch (error) {
      console.error('Login error details:', error);
      setResult(prev => prev + `❌ Login failed: ${error.message}\n`);
      if (error.response) {
        setResult(prev => prev + `Response: ${JSON.stringify(error.response.data)}\n`);
      }
      return false;
    }
  };

  const testReport = async () => {
    setResult(prev => prev + 'Testing time-based report...\n');
    
    try {
      console.log('=== REPORT REQUEST DEBUG ===');
      console.log('Browser cookies before report:', document.cookie);
      console.log('Making request to:', API_ENDPOINTS.ADMIN_REPORTS_TIME);
      
      const response = await axios.get(API_ENDPOINTS.ADMIN_REPORTS_TIME, {
        params: {
          start_date: '2025-08-01',
          end_date: '2025-08-10'
        }
      });
      
      console.log('Report response received:', response);
      setResult(prev => prev + `✅ Report successful: Found ${response.data.report?.length || 0} entries\n`);
    } catch (error) {
      console.error('Report error details:', error);
      setResult(prev => prev + `❌ Report failed: ${error.message}\n`);
      if (error.response) {
        setResult(prev => prev + `Status: ${error.response.status}\n`);
        setResult(prev => prev + `Response: ${JSON.stringify(error.response.data)}\n`);
      }
    }
  };

  const clearAllCookies = () => {
    // Clear all cookies for the current domain
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    setResult(prev => prev + '🧹 Cleared all browser cookies\n');
  };

  const runFullTest = async () => {
    setLoading(true);
    setResult('');
    
    // Clear all cookies first
    clearAllCookies();
    
    // Add browser cookie information
    setResult('🍪 Current cookies: ' + document.cookie + '\n\n');
    
    const loginSuccess = await testLogin();
    if (loginSuccess) {
      // Show cookies after login
      setResult(prev => prev + '\n🍪 Cookies after login: ' + document.cookie + '\n');
      await testReport();
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Admin Authentication Test</h2>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={runFullTest} disabled={loading} style={{ marginRight: '10px' }}>
          {loading ? 'Testing...' : 'Run Test'}
        </button>
        <button onClick={clearAllCookies} style={{ backgroundColor: '#ff6b35', color: 'white' }}>
          Clear Cookies
        </button>
      </div>
      
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        marginTop: '20px',
        whiteSpace: 'pre-wrap'
      }}>
        {result || 'Click "Run Test" to start'}
      </pre>
    </div>
  );
}

export default AdminTest;
