import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { useEffect } from "react";

/**
 * Optional: Scroll to top on route change (nice touch if you expand pages later)
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * A simple brand/header bar (can remove if not needed)
 */
function Header() {
  const { pathname } = useLocation();
  return (
    <header className="app-header">
      <div className="brand">
        <span className="logo-dot" /> MyAuthPortal
      </div>
      <nav>
        {pathname !== "/" && (
          <Link to="/" className="nav-link">
            Login
          </Link>
        )}
        {pathname !== "/signup" && (
          <Link to="/signup" className="nav-link">
            Signup
          </Link>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-bg">
        <div className="app-overlay" />
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* You can add more protected/public routes later */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} MyAuthPortal. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
