import React from "react";
import { COLORS } from "../../utils/constants";

const { YELLOW, YELLOW2 } = COLORS;

export function WinnerModal({ winner, rifa, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,.92)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Barlow Condensed', sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "min(460px, 100%)",
          background: "#0d0d14",
          border: "2px solid rgba(255,215,0,.5)",
          borderRadius: 20,
          padding: "40px 32px",
          boxShadow: "0 0 60px rgba(255,215,0,.15)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 60, marginBottom: 12 }}>🏆</div>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            color: YELLOW,
            fontSize: 24,
            fontWeight: 900,
            marginBottom: 4,
          }}
        >
          ¡TENEMOS GANADOR!
        </h2>
        <p style={{ color: "rgba(255,255,255,.38)", fontSize: 14, marginBottom: 24 }}>
          El sorteo de <strong style={{ color: "#fff" }}>{rifa.name}</strong> finalizó
        </p>

        {/* Información del ganador */}
        <div
          style={{
            background: "rgba(255,215,0,.07)",
            border: "1px solid rgba(255,215,0,.25)",
            borderRadius: 12,
            padding: "20px",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,.4)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
            Número ganador
          </p>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: YELLOW,
              fontFamily: "'Cinzel', serif",
              marginBottom: 10,
            }}
          >
            {winner.number}
          </div>
          <p
            style={{
              color: "rgba(255,255,255,.4)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            Ganador
          </p>
          <p style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{winner.name}</p>
          <p style={{ color: YELLOW, fontSize: 14, marginTop: 6 }}>Premio: {rifa.prize}</p>
        </div>

        {/* Botón de cierre */}
        <button
          onClick={onClose}
          style={{
            background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            color: "#000",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Cinzel', serif",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          ¡Felicitaciones!
        </button>
      </div>
    </div>
  );
}