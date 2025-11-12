// src/components/Layout.tsx
import { Link, Outlet } from "react-router-dom";
//import "./layout.css";

export default function Layout() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Smart Health Dashboard</h1>
        <nav>
          <Link to="/" style={{ marginRight: 12 }}>Dashboard</Link>
          <Link to="/history">History</Link>
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
