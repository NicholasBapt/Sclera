import { useState } from "react";
import { Outlet } from "react-router-dom";
import { isDemoMode } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="app-content">
        <Header onMenuClick={() => setNavOpen(true)} />

        {isDemoMode && (
          <div className="demo-banner" role="status">
            <strong>DEMO MODE</strong>
            <span>Fictional sample data · Employee editing is disabled</span>
          </div>
        )}

        <main className="main-content">
          <Outlet />
        </main>

        <footer className="app-footer">
          <span>SCLERA / PEOPLE INTELLIGENCE</span>
          <span>DESIGNED TO SEE FURTHER · 2026</span>
        </footer>
      </div>
    </div>
  );
}
