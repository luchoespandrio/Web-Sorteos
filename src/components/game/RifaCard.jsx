import React from "react";
import { COLORS } from "../../utils/constants";

const { YELLOW, YELLOW2 } = COLORS;

export function RifaCard({ rifa, currentUser, onSelect }) {
  const total = rifa.totalNumbers || 100;
  const sold = Object.values(rifa.numbers).filter(
    (n) => n.status === "vendido" || n.status === "reservado"
  ).length;
  const pct = Math.round((sold / total) * 100);
  const myNums = Object.entries(rifa.numbers).filter(
    ([, v]) => v.userId === currentUser.id
  );
  const isFinished = rifa.status === "finished";

  return (
    <div
      onClick={() => !isFinished && onSelect(rifa)}
      style={{
        background: "#0d0d14",
        border: `1px solid ${isFinished ? "rgba(255,215,0,.25)" : "rgba(255,255,255,.08)"}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: isFinished ? "default" : "pointer",
        transition: "transform .2s, box-shadow .2s",
        opacity: isFinished ? 0.75 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isFinished) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,215,0,.1)";
          e.currentTarget.style.borderColor = "rgba(255,215,0,.2)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = isFinished
          ? "rgba(255,215,0,.25)"
          : "rgba(255,255,255,.08)";
      }}
    >
      {/* Header de la rifa (icono y estado) */}
      <div
        style={{
          height: 130,
          background: isFinished
            ? "linear-gradient(135deg,#1a1408,#111)"
            : "linear-gradient(135deg,#1a1a28,#111)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,.05)",
          position: "relative",
        }}
      >
        <span style={{ fontSize: 60 }}>{rifa.icon}</span>

        {/* Overlay si la rifa terminó */}
        {isFinished && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "rgba(255,215,0,.9)",
                borderRadius: 8,
                padding: "6px 16px",
                fontFamily: "'Cinzel', serif",
                fontWeight: 900,
                fontSize: 13,
                color: "#000",
                letterSpacing: 1,
              }}
            >
              🏆 SORTEADA
            </div>
          </div>
        )}

        {/* Precio por número */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(255,215,0,.12)",
            border: "1px solid rgba(255,215,0,.35)",
            borderRadius: 16,
            padding: "3px 10px",
            color: YELLOW,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {rifa.pricePerNumber} cr.
        </div>

        {/* Mis números */}
        {myNums.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "rgba(0,200,83,.12)",
              border: "1px solid rgba(0,200,83,.35)",
              borderRadius: 16,
              padding: "3px 10px",
              color: "#00C853",
              fontSize: 11,
            }}
          >
            ✓ {myNums.length} núm.
          </div>
        )}
      </div>

      {/* Cuerpo de la rifa */}
      <div style={{ padding: "14px 16px" }}>
        <h3
          style={{
            fontFamily: "'Cinzel', serif",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 2,
          }}
        >
          {rifa.name}
        </h3>
        <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12, marginBottom: 12 }}>
          {rifa.subtitle}
        </p>

        {/* Ganador (si la rifa terminó) */}
        {isFinished && rifa.winner && (
          <div
            style={{
              background: "rgba(255,215,0,.08)",
              border: "1px solid rgba(255,215,0,.2)",
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,.4)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Ganador · Nro {rifa.winner.number}
            </p>
            <p style={{ color: YELLOW, fontWeight: 700, fontSize: 14 }}>
              {rifa.winner.name}
            </p>
          </div>
        )}

        {/* Barra de progreso */}
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <span style={{ color: "rgba(255,255,255,.38)", fontSize: 11 }}>
              {sold}/{total} números
            </span>
            <span style={{ color: YELLOW, fontSize: 11, fontWeight: 600 }}>
              {pct}%
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,.07)",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${YELLOW2}, ${YELLOW})`,
                borderRadius: 2,
              }}
            />
          </div>
        </div>

        {/* Premio y botón */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                color: "rgba(255,255,255,.28)",
                fontSize: 10,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Premio
            </p>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
              {rifa.prize}
            </p>
          </div>
          {!isFinished && (
            <button
              style={{
                background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
                border: "none",
                borderRadius: 7,
                padding: "8px 16px",
                color: "#000",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: 0.5,
                pointerEvents: "none", // Deshabilitado porque el onClick está en el div padre
              }}
            >
              Elegir números
            </button>
          )}
        </div>
      </div>
    </div>
  );
}