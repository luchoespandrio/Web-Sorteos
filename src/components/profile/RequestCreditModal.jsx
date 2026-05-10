import React, { useState } from "react";
import { COLORS } from "../../utils/constants";

const { YELLOW, YELLOW2 } = COLORS;

export function RequestCreditModal({ currentUser, onSubmit, onCancel }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        background: "rgba(0,0,0,.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Barlow Condensed', sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "min(400px, 100%)",
          background: "#0d0d14",
          border: "1px solid rgba(78,205,196,.25)",
          borderRadius: 16,
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,.6)",
        }}
      >
        {/* Encabezado */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Solicitar créditos
          </h2>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: 13, marginTop: 4 }}>
            El administrador revisará tu solicitud
          </p>
        </div>

        {/* Campo: Cantidad de créditos */}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              color: "rgba(255,255,255,.4)",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            Cantidad de créditos
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej: 500"
            style={{
              width: "100%",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 8,
              padding: "11px 12px",
              color: "#fff",
              fontSize: 14,
              outline: "none",
              fontFamily: "'Barlow Condensed', sans-serif",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Campo: Nota opcional */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              color: "rgba(255,255,255,.4)",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            Nota (opcional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="¿Para qué los necesitás?"
            rows={3}
            style={{
              width: "100%",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 8,
              padding: "11px 12px",
              color: "#fff",
              fontSize: 13,
              outline: "none",
              resize: "none",
              fontFamily: "'Barlow Condensed', sans-serif",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "11px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.09)",
              borderRadius: 8,
              color: "rgba(255,255,255,.5)",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => parseInt(amount) > 0 && onSubmit(parseInt(amount), note)}
            style={{
              flex: 2,
              padding: "11px",
              background: parseInt(amount) > 0 ? `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})` : "rgba(255,255,255,.04)",
              border: "none",
              borderRadius: 8,
              color: parseInt(amount) > 0 ? "#000" : "rgba(255,255,255,.2)",
              fontSize: 13,
              fontWeight: 700,
              cursor: parseInt(amount) > 0 ? "pointer" : "not-allowed",
              fontFamily: "'Cinzel', serif",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Enviar solicitud
          </button>
        </div>
      </div>
    </div>
  );
}