import React from "react";
import { COLORS } from "../../utils/constants";
import { StatRow } from "./NumberGrid"; // Reutilizamos StatRow

const { YELLOW, YELLOW2 } = COLORS;

export function ConfirmModal({ rifa, numbers, currentUser, onConfirm, onCancel }) {
  const total = numbers.length * rifa.pricePerNumber;
  const canAfford = currentUser.credits >= total;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
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
          width: "min(420px, 100%)",
          background: "#0d0d14",
          border: "1px solid rgba(255,215,0,.2)",
          borderRadius: 16,
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,.6)",
        }}
      >
        {/* Encabezado */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(0,200,83,.1)",
              border: "1px solid rgba(0,200,83,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              margin: "0 auto 12px",
            }}
          >
            ✅
          </div>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Confirmá tu jugada
          </h2>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: 13, marginTop: 4 }}>
            Revisá los detalles antes de confirmar
          </p>
        </div>

        {/* Información de la rifa */}
        <div
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 10,
            padding: "12px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 28 }}>{rifa.icon}</span>
          <div>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{rifa.name}</p>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>{rifa.subtitle}</p>
          </div>
        </div>

        {/* Números seleccionados */}
        <div style={{ marginBottom: 14 }}>
          <p
            style={{
              color: "rgba(255,255,255,.38)",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Números seleccionados
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {[...numbers].sort().map((n) => (
              <span
                key={n}
                style={{
                  background: "rgba(255,215,0,.12)",
                  border: "1px solid rgba(255,215,0,.3)",
                  borderRadius: 5,
                  padding: "3px 9px",
                  color: YELLOW,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Resumen de la jugada */}
        <div
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 10,
            padding: "12px",
            marginBottom: 18,
            display: "flex",
            flexDirection: "column",
            gap: 7,
          }}
        >
          <StatRow label="Cantidad de números" value={numbers.length} />
          <div style={{ height: 1, background: "rgba(255,255,255,.05)" }} />
          <StatRow label="Costo por número" value={`${rifa.pricePerNumber} cr.`} />
          <div style={{ height: 1, background: "rgba(255,255,255,.05)" }} />
          <StatRow label="Total a pagar" value={`${total} cr.`} highlight />
        </div>

        {/* Mensaje de error si no tiene créditos */}
        {!canAfford && (
          <p style={{ color: "#FF6464", fontSize: 13, textAlign: "center", marginBottom: 12 }}>
            ⚠ No tenés créditos suficientes
          </p>
        )}

        {/* Botones de acción */}
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
            onClick={canAfford ? onConfirm : undefined}
            style={{
              flex: 2,
              padding: "11px",
              background: canAfford
                ? `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`
                : "rgba(255,255,255,.04)",
              border: canAfford ? "none" : "1px solid rgba(255,255,255,.08)",
              borderRadius: 8,
              color: canAfford ? "#000" : "rgba(255,255,255,.2)",
              fontSize: 13,
              fontWeight: 700,
              cursor: canAfford ? "pointer" : "not-allowed",
              fontFamily: "'Cinzel', serif",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}