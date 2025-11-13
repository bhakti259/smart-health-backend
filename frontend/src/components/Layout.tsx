// src/components/Layout.tsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SessionTimer from "./SessionTimer";
//import "./layout.css";

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Smart Health Dashboard</h1>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ marginRight: 12 }}>Dashboard</Link>
          <Link to="/history">History</Link>
          <SessionTimer />
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer style={{ marginTop: 40, color: "#666", fontSize: 13 }}>
        Built with FastAPI + React • Demo
      </footer>
    </div>
  );
}
