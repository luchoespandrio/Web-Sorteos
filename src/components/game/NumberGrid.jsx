import React, { useState } from "react";
import { Header } from "../common/Header";
import { COLORS } from "../../utils/constants";

const { YELLOW, YELLOW2, BG } = COLORS; // <-- Añadí YELLOW2

// Colores para los números según su estado
const NUM_COLORS = {
  disponible: {
    bg: "rgba(255,255,255,.06)",
    color: "rgba(255,255,255,.7)",
    border: "rgba(255,255,255,.1)",
  },
  selected: {
    bg: "rgba(255,215,0,.18)",
    color: YELLOW,
    border: "rgba(255,215,0,.55)",
  },
  mine: {
    bg: "rgba(0,200,83,.14)",
    color: "#00C853",
    border: "rgba(0,200,83,.38)",
  },
  reservado: {
    bg: "rgba(255,140,0,.13)",
    color: "#FF8C00",
    border: "rgba(255,140,0,.28)",
  },
  vendido: {
    bg: "rgba(255,50,50,.1)",
    color: "rgba(255,100,100,.5)",
    border: "rgba(255,50,50,.18)",
  },
};

// Componente para mostrar una fila de estadísticas
export function StatRow({ label, value, highlight = false, dim = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>{label}</span>
      <span
        style={{
          color: highlight ? YELLOW : dim ? "rgba(255,255,255,.28)" : "#fff",
          fontWeight: highlight ? 700 : 500,
          fontSize: 13,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// Componente principal NumberGrid
export function NumberGrid({ rifa, currentUser, onConfirm, onBack }) {
  const [selected, setSelected] = useState([]);
  const total = rifa.totalNumbers || 100;

  // Determinar el padding de los números (ej: "01" o "1")
  const padLen = total >= 100 ? 2 : total >= 10 ? 2 : 1;
  const pad = (i) => i.toString().padStart(padLen, "0");

  // Obtener el estado de un número
  const getStatus = (i) => {
    const p = pad(i);
    if (selected.includes(p)) return "selected";
    const e = rifa.numbers[p];
    if (!e) return "disponible";
    if (e.userId === currentUser.id) return "mine";
    return e.status;
  };

  // Alternar selección de un número
  const toggle = (i) => {
    const p = pad(i);
    const st = getStatus(i);
    if (st === "vendido" || st === "reservado" || st === "mine") return;
    setSelected((prev) => (prev.includes(p) ? prev.filter((n) => n !== p) : [...prev, p]));
  };

  // Calcular costo total
  const cost = selected.length * rifa.pricePerNumber;
  const canAfford = currentUser.credits >= cost;

  // Columnas según la cantidad de números
  const cols = total <= 20 ? 5 : total <= 50 ? 10 : 10;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: "'Barlow Condensed', sans-serif",
      }}
    >
      <Header
        currentUser={currentUser}
        onLogout={() => {}}
        onProfile={() => {}}
        onLobby={onBack}
        onHowItWorks={() => {}}
      />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        {/* Encabezado */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.1)",
              color: "rgba(255,255,255,.6)",
              borderRadius: 7,
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            ← Volver
          </button>
          <div>
            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {rifa.name}
            </h2>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: 13 }}>
              {rifa.subtitle} · Premio: {rifa.prize} · {total} números en juego
            </p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,215,0,.08)",
              border: "1px solid rgba(255,215,0,.28)",
              borderRadius: 20,
              padding: "5px 14px",
            }}
          >
            <span style={{ color: YELLOW, fontWeight: 700 }}>
              {currentUser.credits.toLocaleString()}
            </span>
            <span style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>cr.</span>
          </div>
        </div>

        {/* Grid principal */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 260px",
            gap: 20,
          }}
        >
          {/* Tablero de números */}
          <div
            style={{
              background: "#0d0d14",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <h3
              style={{
                color: "rgba(255,255,255,.45)",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Seleccioná tus números ({total} disponibles)
            </h3>

            {/* Grid de números */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: 5,
                marginBottom: 18,
              }}
            >
              {Array.from({ length: total }, (_, i) => {
                const st = getStatus(i);
                const c = NUM_COLORS[st];
                const clickable = st === "disponible" || st === "selected";
                return (
                  <div
                    key={i}
                    onClick={() => toggle(i)}
                    style={{
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                      borderRadius: 6,
                      color: c.color,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: clickable ? "pointer" : "default",
                      transition: "transform .12s",
                      textDecoration: st === "vendido" ? "line-through" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (clickable) e.currentTarget.style.transform = "scale(1.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {pad(i)}
                  </div>
                );
              })}
            </div>

            {/* Leyenda de estados */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[
                { st: "disponible", label: "Disponible" },
                { st: "selected", label: "Seleccionado" },
                { st: "mine", label: "Tuyo" },
                { st: "reservado", label: "Reservado" },
                { st: "vendido", label: "Vendido" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 3,
                      background: NUM_COLORS[l.st].bg,
                      border: `1px solid ${NUM_COLORS[l.st].border}`,
                    }}
                  />
                  <span style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel lateral (selección y confirmación) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                background: "#0d0d14",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 12,
                padding: "18px",
              }}
            >
              <h4
                style={{
                  color: "rgba(255,255,255,.38)",
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Tu selección
              </h4>
              {selected.length === 0 ? (
                <p
                  style={{
                    color: "rgba(255,255,255,.18)",
                    fontSize: 13,
                    textAlign: "center",
                    padding: "16px 0",
                  }}
                >
                  Hacé click en los números
                </p>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 5,
                      marginBottom: 14,
                    }}
                  >
                    {[...selected].sort().map((n) => (
                      <span
                        key={n}
                        onClick={() => setSelected((prev) => prev.filter((x) => x !== n))}
                        title="Click para quitar"
                        style={{
                          background: "rgba(255,215,0,.12)",
                          border: "1px solid rgba(255,215,0,.35)",
                          borderRadius: 5,
                          padding: "3px 9px",
                          color: YELLOW,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,50,50,.12)";
                          e.currentTarget.style.color = "#FF6464";
                          e.currentTarget.style.borderColor = "rgba(255,50,50,.35)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255,215,0,.12)";
                          e.currentTarget.style.color = YELLOW;
                          e.currentTarget.style.borderColor = "rgba(255,215,0,.35)";
                        }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,.05)",
                      paddingTop: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 7,
                    }}
                  >
                    <StatRow label="Costo por número" value={`${rifa.pricePerNumber} cr.`} />
                    <StatRow label="Cantidad de números" value={selected.length} />
                    <StatRow label="Total a pagar" value={`${cost} cr.`} highlight />
                    <StatRow label="Créditos disponibles" value={`${currentUser.credits} cr.`} dim />
                  </div>
                </>
              )}
            </div>

            {/* Botón de confirmar */}
            <button
              onClick={() => selected.length > 0 && canAfford && onConfirm(selected)}
              style={{
                padding: "14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "'Cinzel', serif",
                cursor: selected.length > 0 && canAfford ? "pointer" : "not-allowed",
                background:
                  selected.length > 0 && canAfford
                    ? `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})` // <-- Usamos YELLOW2 aquí
                    : "rgba(255,255,255,.04)",
                border:
                  selected.length > 0 && canAfford ? "none" : "1px solid rgba(255,255,255,.08)",
                color: selected.length > 0 && canAfford ? "#000" : "rgba(255,255,255,.2)",
                opacity: selected.length > 0 ? 1 : 0.6,
                transition: "all .2s",
              }}
            >
              {selected.length > 0 ? "Confirmar jugada" : "Seleccioná números"}
            </button>

            {/* Mensaje de error si no tiene créditos */}
            {selected.length > 0 && !canAfford && (
              <p style={{ color: "#FF6464", fontSize: 12, textAlign: "center" }}>
                ⚠ Créditos insuficientes
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Exportar NumberGrid como default (opcional, pero útil si lo importás así en otros lados)
// export default NumberGrid;