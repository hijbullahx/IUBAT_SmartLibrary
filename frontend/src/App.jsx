import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitialPage from "./pages/InitialPage/InitialPage";
import Entry from "./pages/Entry/Entry.jsx";
import AdminLogin from "./components/auth/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/default" element={<Entry />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;