import React from "react";
import { COLORS } from "../../utils/constants";
 
const { YELLOW } = COLORS;
 
export function Header({ currentUser, onLogout, onProfile, onLobby, onHowItWorks, onCortitos, onPlanillas }) {
  return (
    <header
      style={{
        background: "#0d0d14",
        borderBottom: "1px solid rgba(255,215,0,.15)",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
        onClick={onLobby}
      >
        <span style={{ fontSize: 22 }}>👑</span>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 900, color: YELLOW, letterSpacing: 3 }}>
          RIFAS
        </span>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 400, color: "#fff", letterSpacing: 3 }}>
          REAL
        </span>
      </div>
 
      {/* Navegación */}
      <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {[
          { label: "🏠 Inicio",        fn: onLobby      },
          { label: "⚡ Cortitos",       fn: onCortitos   },
          { label: "⭐ Sorteos",        fn: onPlanillas  },
          { label: "🃏 Mis jugadas",    fn: onProfile    },
          { label: "❓ Ayuda",          fn: onHowItWorks },
        ].map(({ label, fn }) => (
          <button
            key={label}
            onClick={fn}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,.6)",
              cursor: "pointer",
              fontSize: 13,
              letterSpacing: 0.5,
              padding: "6px 12px",
              borderRadius: 6,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.6)")}
          >
            {label}
          </button>
        ))}
      </nav>
 
      {/* Usuario y créditos */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,215,0,.1)",
            border: "1px solid rgba(255,215,0,.3)",
            borderRadius: 20, padding: "4px 12px",
          }}
        >
          <span style={{ color: YELLOW, fontWeight: 700, fontSize: 15 }}>
            {currentUser.credits.toLocaleString()}
          </span>
          <span style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>cr.</span>
        </div>
 
        <div
          style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}
          onClick={onProfile}
        >
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,215,0,.12)",
            border: "1px solid rgba(255,215,0,.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>
            {currentUser.avatar}
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, lineHeight: 1 }}>{currentUser.name}</div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 10 }}>Jugador</div>
          </div>
        </div>
 
        <button
          onClick={onLogout}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,100,100,.3)",
            color: "#FF6464",
            padding: "5px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "'Barlow Condensed', sans-serif",
          }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}