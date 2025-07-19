import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PasswordGenerator from "./pages/PasswordGenerator.jsx";
import PasswordManager from "./pages/PasswordManager.jsx";
import { useEffect } from "react";

/**
 * Optional: Scroll to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * Navigation Header
 */
function Header() {
  const { pathname } = useLocation();
  return (
    <header className="app-header">
      <div className="brand">
        <Link to="/" className="brand-link">
          <span className="logo-dot" /> SecurePass
        </Link>
      </div>
      <nav>
        <Link to="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </Link>
        <Link to="/generator" className={`nav-link ${pathname === "/generator" ? "active" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Generator
        </Link>
        <Link to="/manager" className={`nav-link ${pathname === "/manager" ? "active" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Manager
        </Link>
        <Link to="/login" className={`nav-link ${pathname === "/login" ? "active" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Login
        </Link>
        <Link to="/signup" className={`nav-link ${pathname === "/signup" ? "active" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2"/>
            <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Signup
        </Link>
      </nav>
    </header>
  );
}

function App() {
  console.log('App component is rendering...');
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app-bg">
          <div className="app-overlay" />
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generator" element={<PasswordGenerator />} />
              <Route path="/manager" element={<PasswordManager />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <p>© {new Date().getFullYear()} SecurePass. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
