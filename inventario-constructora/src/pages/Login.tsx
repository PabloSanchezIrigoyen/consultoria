// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import "@/styles/auth.css";  // Asegúrate de que la ruta al archivo CSS sea correcta

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password.trim()) {
      setErr("Ingresa tu usuario y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password, { remember });
      nav(from, { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-backdrop" />
      <div className="login-card">
        
        {/* Logo dentro de caja cuadrada */}
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

        <h1 className="login-title">Iniciar sesión</h1>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="input-panel">
            <label className="field">
              <span>Usuario</span>
              <input
                type="text"
                placeholder="usuario o correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                autoFocus
                disabled={loading}
              />
            </label>

            <label className="field">
              <span>Contraseña</span>
              <div className="password-input">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="has-toggle"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={loading}
                >
                  {show ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </label>
          </div>

          <label className="field checkbox">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
            />
            <span>Recordarme en este dispositivo</span>
          </label>

          {err && (
            <div className="login-error" role="alert" aria-live="assertive">
              {err}
            </div>
          )}

          <button
            className="btn-primary login-submit"
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? "Ingresando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}