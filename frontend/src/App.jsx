import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InitialPage from './pages/initial/InitialPage';
import DefaultPage from './pages/default/DefaultPage';
import AdminLogin from './components/auth/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/default" element={<DefaultPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;