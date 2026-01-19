// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // === During development: always start with login screen ===
    // Comment out or remove these lines when deploying to production
    if (import.meta.env.DEV) {
      localStorage.removeItem('token');
    }
    // =============================================================

    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);
    }

    setIsChecking(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;