// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // === Development helper: force show login screen on every reload ===
    // Comment out or remove this block when deploying to production
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // ================================================================

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }

    // Always finish checking quickly (no real server check here)
    setIsChecking(false);
  }, []);

  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // Optional: you can also store role here if you want
    // localStorage.setItem('role', role); // already done in Login.jsx
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (isChecking) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          color: '#555',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        userRole === 'admin' ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <StaffDashboard onLogout={handleLogout} />
        )
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;