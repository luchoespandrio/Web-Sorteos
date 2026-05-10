import React from "react";
import { COLORS } from "../../utils/constants";

const { YELLOW, YELLOW2, BG } = COLORS;

export function LoginScreen({ form, setForm, onLogin, error }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Barlow Condensed', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo decorativo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(rgba(255,215,0,1) 1px,transparent 1px), linear-gradient(90deg,rgba(255,215,0,1) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(255,215,0,.05) 0%, transparent 65%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Formulario de login */}
      <div
        style={{
          width: "min(380px, 90vw)",
          background: "#0d0d14",
          border: "1px solid rgba(255,215,0,.22)",
          borderRadius: 16,
          padding: "44px 36px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>👑</div>
          <div>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 28,
                fontWeight: 900,
                color: YELLOW,
                letterSpacing: 4,
              }}
            >
              RIFAS
            </span>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 28,
                fontWeight: 400,
                color: "#fff",
                letterSpacing: 4,
              }}
            >
              {" "}
              REAL
            </span>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,.3)",
              fontSize: 11,
              letterSpacing: 4,
              marginTop: 4,
              textTransform: "uppercase",
            }}
          >
            Sistema de Rifas
          </p>
        </div>

        {/* Campos de usuario y contraseña */}
        {[
          { key: "username", label: "USUARIO", type: "text", placeholder: "Ingresá tu usuario", icon: "👤" },
          { key: "password", label: "CONTRASEÑA", type: "password", placeholder: "Ingresá tu contraseña", icon: "🔒" },
        ].map((f) => (
          <div key={f.key} style={{ marginBottom: 14, textAlign: "left" }}>
            <label
              style={{
                color: "rgba(255,255,255,.5)",
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
              }}
            >
              {f.label}
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,.3)",
                  fontSize: 14,
                }}
              >
                {f.icon}
              </span>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && onLogin()}
                placeholder={f.placeholder}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 8,
                  padding: "11px 12px 11px 36px",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: 0.5,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        ))}

        {/* Error de login */}
        {error && (
          <p style={{ color: "#FF6464", fontSize: 13, marginBottom: 14 }}>⚠ {error}</p>
        )}

        {/* Botón de ingresar */}
        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: "13px",
            background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
            border: "none",
            borderRadius: 8,
            color: "#000",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 2,
            cursor: "pointer",
            fontFamily: "'Cinzel', serif",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          INGRESAR
        </button>

        {/* Credenciales de ejemplo */}
        <div
          style={{
            background: "rgba(255,255,255,.025)",
            borderRadius: 8,
            padding: "10px 14px",
            border: "1px solid rgba(255,255,255,.06)",
          }}
        >
          <p style={{ color: "rgba(255,255,255,.25)", fontSize: 11, lineHeight: 1.9 }}>
            Admin: <span style={{ color: "rgba(255,215,0,.6)" }}>admin / admin</span>
            <br />
            Jugadores: <span style={{ color: "rgba(255,215,0,.6)" }}>juanperez / 1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}