// Sidebar.tsx
import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Package, Truck, History, LogOut, User as UserIcon, Users } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import Protected from "@/auth/Protected";
import "./Sidebar.css";  // Asegúrate de que el archivo CSS esté importado

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const { user, logout } = useAuth();

  // Cerrar menú al navegar
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Control de clase en <body>
  useEffect(() => {
    if (!user) {
      document.body.classList.remove("menu-open");
      return;
    }
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open, user]);

  // Cerrar con ESC
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `navlink ${isActive ? "active-link" : ""}`;

  const handleToggle = () => {
    setOpen((v) => !v);
    toggleBtnRef.current?.blur();
  };

  if (!user) return null;

  return (
    <>
      <button
        ref={toggleBtnRef}
        type="button"
        className={`sidebar-toggle ${open ? "is-open" : ""}`}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="app-sidebar"
        aria-pressed={open}
        onClick={handleToggle}
      >
        <span className="burger-line" />
        <span className="burger-line" />
        <span className="burger-line" />
      </button>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside id="app-sidebar" className={`sidebar ${open ? "open" : ""}`}>
<div className="sidebar-header">
  {/* Logo estilizado */}
<div className="login-logo-container">
  <div className="logo-box">
    <div className="icon">
      <svg
        className="login-logo-svg"
        viewBox="0 0 340 300"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Isotipo BRUN & FER"
      >
        <path
          className="red"
          d="M18 18
            H286
            C315 18 334 39 334 66
            C334 90 321 109 299 118
            C323 126 337 146 337 171
            C337 201 316 222 282 222
            H84
            L23 298
            L35 170
            H247
            C260 170 270 161 270 148
            C270 135 260 126 247 126
            H86
            L106 86
            H246
            C259 86 269 78 269 65
            C269 52 259 43 246 43
            H60
            L18 18
            Z"
        />
      </svg>
    </div>
    <div className="text">
      <span className="main">BRUN &amp; FER</span>
    </div>
  </div>
</div>

  <h2 className="menu-title">MENÚ</h2>
</div>

        <div className="sidebar-user">
          <div className="sidebar-user-left">
            <UserIcon className="icon" />
            <div className="sidebar-user-meta">
              <div className="sidebar-user-name">{user?.name ?? user?.email}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>

          <button type="button" className="sidebar-logout" onClick={logout} title="Cerrar sesión">
            <LogOut className="icon" />
            <span>Salir</span>
          </button>
        </div>

        <ul role="navigation" aria-label="Secciones">
          <li>
            <NavLink to="/dashboard" end className={linkClass}>
              <Home className="icon" />
              Inicio
            </NavLink>
          </li>

          <li>
            <NavLink to="/inventario" className={linkClass}>
              <Package className="icon" />
              Inventario General
            </NavLink>
          </li>

          <li>
            <NavLink to="/vehiculos" className={linkClass}>
              <Truck className="icon" />
              Vehículos
            </NavLink>
          </li>

          <li>
            <NavLink to="/historial" className={linkClass}>
              <History className="icon" />
              Historial de Movimientos
            </NavLink>
          </li>

          <Protected action="read" resource="usuarios">
            <li>
              <NavLink to="/usuarios" className={linkClass}>
                <Users className="icon" />
                Gestión de Usuarios
              </NavLink>
            </li>
          </Protected>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;