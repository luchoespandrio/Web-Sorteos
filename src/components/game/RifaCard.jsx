import React from "react";
import { COLORS } from "../../utils/constants";
 
const { YELLOW, YELLOW2 } = COLORS;
 
export function RifaCard({ rifa, currentUser, onSelect }) {
  const total      = rifa.totalNumbers || 100;
  const sold       = Object.values(rifa.numbers).filter(
    (n) => n.status === "vendido" || n.status === "reservado"
  ).length;
  const pct        = Math.round((sold / total) * 100);
  const myNums     = Object.entries(rifa.numbers).filter(([, v]) => v.userId === currentUser.id);
  const isActive = rifa.status === "active";
  const isFinished    = rifa.status === "finished";
  const isReadyToDraw = rifa.status === "readyToDraw";
 
  // La card es clickeable en todos los estados salvo "finished"
  const isClickable = !isFinished;
 
  return (
    <div
      onClick={() => isClickable && onSelect(rifa)}
      style={{
        background: "#0d0d14",
        border: `1px solid ${
          isFinished    ? "rgba(255,215,0,.25)"  :
          isReadyToDraw ? "rgba(255,215,0,.45)"  :
                          "rgba(255,255,255,.08)"}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: isClickable ? "pointer" : "default",
        transition: "transform .2s, box-shadow .2s",
        opacity: isFinished ? 0.75 : 1,
        boxShadow: isReadyToDraw ? "0 0 24px rgba(255,215,0,.12)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isClickable) return;
        e.currentTarget.style.transform    = "translateY(-4px)";
        e.currentTarget.style.boxShadow    = isReadyToDraw
          ? "0 12px 40px rgba(255,215,0,.25)"
          : "0 12px 40px rgba(255,215,0,.1)";
        e.currentTarget.style.borderColor  = "rgba(255,215,0,.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform   = "none";
        e.currentTarget.style.boxShadow   = isReadyToDraw ? "0 0 24px rgba(255,215,0,.12)" : "none";
        e.currentTarget.style.borderColor = isFinished
          ? "rgba(255,215,0,.25)"
          : isReadyToDraw
          ? "rgba(255,215,0,.45)"
          : "rgba(255,255,255,.08)";
      }}
    >
      {/* ── Zona del icono ── */}
      <div style={{
        height: 130,
        background: isFinished
          ? "linear-gradient(135deg,#1a1408,#111)"
          : isReadyToDraw
          ? "linear-gradient(135deg,#1a1500,#111)"
          : "linear-gradient(135deg,#1a1a28,#111)",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderBottom: "1px solid rgba(255,255,255,.05)",
        position: "relative",
      }}>
        <span style={{ fontSize: 60 }}>{rifa.icon}</span>
 
        {/* Overlay: Sorteada */}
        {isFinished && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              background: "rgba(255,215,0,.9)", borderRadius: 8,
              padding: "6px 16px", fontFamily: "'Cinzel', serif",
              fontWeight: 900, fontSize: 13, color: "#000", letterSpacing: 1,
            }}>
              🏆 SORTEADA
            </div>
          </div>
        )}
 
        {/* ── NUEVO: Overlay "Lista para sortear" ── */}
        {isReadyToDraw && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              background: "rgba(255,215,0,.18)",
              border: "1px solid rgba(255,215,0,.6)",
              borderRadius: 8, padding: "6px 14px",
              fontFamily: "'Cinzel', serif", fontWeight: 700,
              fontSize: 12, color: YELLOW, letterSpacing: 1,
              animation: "readyPulse 2s ease-in-out infinite",
            }}>
              🎰 Lista para sortear
            </div>
          </div>
        )}
        {/* ──────────────────────────────────────── */}
 
        {/* Precio por número */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "rgba(255,215,0,.12)", border: "1px solid rgba(255,215,0,.35)",
          borderRadius: 16, padding: "3px 10px", color: YELLOW,
          fontSize: 12, fontWeight: 700,
        }}>
          {rifa.pricePerNumber} cr.
        </div>
 
        {/* Mis números */}
        {myNums.length > 0 && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "rgba(0,200,83,.12)", border: "1px solid rgba(0,200,83,.35)",
            borderRadius: 16, padding: "3px 10px", color: "#00C853", fontSize: 11,
          }}>
            ✓ {myNums.length} núm.
          </div>
        )}
      </div>
 
      {/* ── Cuerpo ── */}
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{
          fontFamily: "'Cinzel', serif", color: "#fff",
          fontSize: 15, fontWeight: 700, marginBottom: 2,
        }}>
          {rifa.name}
        </h3>
        <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12, marginBottom: 12 }}>
          {rifa.subtitle}
        </p>
 
        {/* Ganador */}
        {isFinished && rifa.winner && (
          <div style={{
            background: "rgba(255,215,0,.08)", border: "1px solid rgba(255,215,0,.2)",
            borderRadius: 8, padding: "8px 12px", marginBottom: 10, textAlign: "center",
          }}>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              Ganador · Nro {rifa.winner.number}
            </p>
            <p style={{ color: YELLOW, fontWeight: 700, fontSize: 14 }}>{rifa.winner.name}</p>
          </div>
        )}
 
        {/* ── NUEVO: Badge "Todos vendidos" cuando readyToDraw ── */}
        {isReadyToDraw && (
          <div style={{
            background: "rgba(255,215,0,.07)", border: "1px solid rgba(255,215,0,.25)",
            borderRadius: 8, padding: "7px 12px", marginBottom: 10,
            display: "flex", alignItems: "center", gap: 7,
          }}>
            <span style={{ fontSize: 14 }}>✅</span>
            <div>
              <p style={{ color: YELLOW, fontSize: 12, fontWeight: 700 }}>
                ¡Todos los números vendidos!
              </p>
              <p style={{ color: "rgba(255,255,255,.35)", fontSize: 10 }}>
                El admin realizará el sorteo en breve
              </p>
            </div>
          </div>
        )}
        {/* ──────────────────────────────────────────────────── */}
 
        {/* Barra de progreso */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: "rgba(255,255,255,.38)", fontSize: 11 }}>
              {sold}/{total} números
            </span>
            <span style={{ color: YELLOW, fontSize: 11, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,.07)", borderRadius: 2 }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: `linear-gradient(90deg, ${YELLOW2}, ${YELLOW})`,
              borderRadius: 2,
            }} />
          </div>
        </div>
 
        {/* Premio y botón */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,.28)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>
              Premio
            </p>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{rifa.prize}</p>
          </div>
 
          {/* Botón según estado */}
          {isActive && (
            <div style={{
              background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
              borderRadius: 7, padding: "8px 16px", color: "#000",
              fontSize: 12, fontWeight: 700,
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: .5,
              pointerEvents: "none",
            }}>
              Elegir números
            </div>
          )}
          {isReadyToDraw && (
            <div style={{
              background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.4)",
              borderRadius: 7, padding: "8px 14px", color: YELLOW,
              fontSize: 12, fontWeight: 700,
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: .5,
              pointerEvents: "none",
            }}>
              🎰 Ver sorteo
            </div>
          )}
        </div>
      </div>
 
      {/* Keyframe pulsante */}
      <style>{`
        @keyframes readyPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,215,0,.3); }
          50%      { box-shadow: 0 0 12px 3px rgba(255,215,0,.25); }
        }
      `}</style>
    </div>
  );
}
 