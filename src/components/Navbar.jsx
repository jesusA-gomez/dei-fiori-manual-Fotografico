import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function Navbar() {
  const { session, rol, signOut } = useAuth();

  return (
    <div className="navbar">
      <Link to="/" className="brand">
        <span className="mark">dei fiori</span>
        <span className="tag">manual fotográfico</span>
      </Link>
      {session && (
        <div className="nav-actions">
          <span className="pill">{rol === "admin" ? "Admin" : rol === "owner" ? "Dueña" : "Equipo"}</span>
          <button className="btn secondary" onClick={signOut}>
            Salir
          </button>
        </div>
      )}
    </div>
  );
}
