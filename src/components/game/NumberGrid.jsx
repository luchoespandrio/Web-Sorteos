import React, { useState } from "react";
import { Header } from "../common/Header";
import { COLORS } from "../../utils/constants";
 
const { YELLOW, YELLOW2, BG } = COLORS;
 
const NUM_COLORS = {
  disponible: { bg: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.7)",  border: "rgba(255,255,255,.1)"  },
  selected:   { bg: "rgba(255,215,0,.18)",   color: YELLOW,                  border: "rgba(255,215,0,.55)"   },
  mine:       { bg: "rgba(0,200,83,.14)",    color: "#00C853",               border: "rgba(0,200,83,.38)"    },
  reservado:  { bg: "rgba(255,140,0,.13)",   color: "#FF8C00",               border: "rgba(255,140,0,.28)"   },
  vendido:    { bg: "rgba(255,50,50,.1)",    color: "rgba(255,100,100,.5)",  border: "rgba(255,50,50,.18)"   },
};
 
export function StatRow({ label, value, highlight = false, dim = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>{label}</span>
      <span style={{
        color: highlight ? YELLOW : dim ? "rgba(255,255,255,.28)" : "#fff",
        fontWeight: highlight ? 700 : 500,
        fontSize: 13,
      }}>
        {value}
      </span>
    </div>
  );
}
 
// ── MODIFICADO: nuevas props isAdmin y onOpenBolillero ─────────────────────────
export function NumberGrid({ rifa, currentUser, onConfirm, onBack, isAdmin = false, onOpenBolillero }) {
 
  const [selected, setSelected] = useState([]);
  const total  = rifa.totalNumbers || 100;
  const padLen = total >= 10 ? 2 : 1;
  const pad    = (i) => i.toString().padStart(padLen, "0");
 
  const getStatus = (i) => {
    const p = pad(i);
    if (selected.includes(p)) return "selected";
    const e = rifa.numbers[p];
    if (!e) return "disponible";
    if (e.userId === currentUser.id) return "mine";
    return e.status;
  };
 
  const toggle = (i) => {
    // No se puede seleccionar si la rifa ya no está activa
    if (rifa.status !== "active") return;
    const p  = pad(i);
    const st = getStatus(i);
    if (st === "vendido" || st === "reservado" || st === "mine") return;
    setSelected((prev) => (prev.includes(p) ? prev.filter((n) => n !== p) : [...prev, p]));
  };
 
  const cost      = selected.length * rifa.pricePerNumber;
  const canAfford = currentUser.credits >= cost;
  const cols      = total <= 20 ? 5 : 10;
 
  // Banderas de estado
  const isReadyToDraw = rifa.status === "readyToDraw";
  const isFinished    = rifa.status === "finished";
  const isActive      = rifa.status === "active";
 
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Barlow Condensed', sans-serif" }}>
      <Header
        currentUser={currentUser}
        onLogout={() => {}}
        onProfile={() => {}}
        onLobby={onBack}
        onHowItWorks={() => {}}
      />
 
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
 
        {/* ── Encabezado ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
            color: "rgba(255,255,255,.6)", borderRadius: 7, padding: "7px 14px",
            cursor: "pointer", fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif",
          }}>
            ← Volver
          </button>
 
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: 20, fontWeight: 700 }}>
              {rifa.name}
            </h2>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: 13 }}>
              {rifa.subtitle} · Premio: {rifa.prize} · {total} números en juego
            </p>
          </div>
 
          {/* ── NUEVO: botón Iniciar Bolillero (solo admin, solo cuando readyToDraw) ── */}
          {isAdmin && isReadyToDraw && (
            <button
              onClick={onOpenBolillero}
              style={{
                marginLeft: "auto",
                background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
                border: "none", borderRadius: 9, padding: "10px 22px",
                color: "#000", fontSize: 13, fontWeight: 900,
                cursor: "pointer", fontFamily: "'Cinzel', serif",
                letterSpacing: 1, textTransform: "uppercase",
                boxShadow: "0 4px 20px rgba(255,215,0,.4)",
                animation: "readyPulse 2s ease-in-out infinite",
              }}
            >
              🎰 Iniciar Bolillero
            </button>
          )}
          {/* ────────────────────────────────────────────────────────────────── */}
 
          {/* Créditos del usuario */}
          {!isReadyToDraw && (
            <div style={{
              marginLeft: isAdmin && isReadyToDraw ? 0 : "auto",
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,215,0,.08)", border: "1px solid rgba(255,215,0,.28)",
              borderRadius: 20, padding: "5px 14px",
            }}>
              <span style={{ color: YELLOW, fontWeight: 700 }}>
                {currentUser.credits.toLocaleString()}
              </span>
              <span style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>cr.</span>
            </div>
          )}
        </div>
 
        {/* ── NUEVO: aviso "Lista para sortear" ────────────────────────────── */}
        {isReadyToDraw && (
          <div style={{
            background: "rgba(255,215,0,.06)", border: "1px solid rgba(255,215,0,.3)",
            borderRadius: 12, padding: "16px 20px", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ fontSize: 28 }}>🏆</span>
            <div>
              <p style={{ color: YELLOW, fontSize: 15, fontWeight: 700, marginBottom: 3 }}>
                ¡Todos los números fueron vendidos!
              </p>
              <p style={{ color: "rgba(255,255,255,.45)", fontSize: 13 }}>
                {isAdmin
                  ? "Apretá \"Iniciar Bolillero\" para realizar el sorteo en vivo."
                  : "El sorteo se realizará en breve. El administrador iniciará el bolillero manualmente."}
              </p>
            </div>
          </div>
        )}
        {/* ────────────────────────────────────────────────────────────────── */}
 
        {/* ── NUEVO: aviso rifa finalizada ─────────────────────────────────── */}
        {isFinished && rifa.winner && (
          <div style={{
            background: "rgba(0,200,83,.06)", border: "1px solid rgba(0,200,83,.28)",
            borderRadius: 12, padding: "14px 20px", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>🎉</span>
            <div>
              <p style={{ color: "#00C853", fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                Rifa finalizada · Ganador: {rifa.winner.name}
              </p>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>
                Número ganador: {rifa.winner.number} · Premio: {rifa.winner.prize?.toLocaleString()} cr.
              </p>
            </div>
          </div>
        )}
        {/* ────────────────────────────────────────────────────────────────── */}
 
        {/* Grid de números + panel lateral */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 20 }}>
 
          {/* Tablero */}
          <div style={{
            background: "#0d0d14", border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 12, padding: "20px",
          }}>
            <h3 style={{
              color: "rgba(255,255,255,.45)", fontSize: 11,
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 16,
            }}>
              {isReadyToDraw
                ? "Todos los números vendidos — sorteo pendiente"
                : isFinished
                ? "Rifa finalizada"
                : `Seleccioná tus números (${total} disponibles)`}
            </h3>
 
            <div style={{
              display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: 5, marginBottom: 18,
            }}>
              {Array.from({ length: total }, (_, i) => {
                const st = getStatus(i);
                const c  = NUM_COLORS[st];
                // Solo clickable si la rifa está activa y el número está disponible
                const clickable = isActive && (st === "disponible" || st === "selected");
                const isWinnerNum = isFinished && rifa.winner && pad(i) === rifa.winner.number;
 
                return (
                  <div
                    key={i}
                    onClick={() => toggle(i)}
                    style={{
                      aspectRatio: "1",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isWinnerNum ? "rgba(255,215,0,.25)" : c.bg,
                      border: `${isWinnerNum ? 2 : 1}px solid ${isWinnerNum ? YELLOW : c.border}`,
                      borderRadius: 6, color: isWinnerNum ? YELLOW : c.color,
                      fontSize: 11, fontWeight: isWinnerNum ? 900 : 600,
                      cursor: clickable ? "pointer" : "default",
                      transition: "transform .12s",
                      boxShadow: isWinnerNum ? `0 0 10px rgba(255,215,0,.4)` : "none",
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
 
            {/* Leyenda */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[
                { st: "disponible", label: "Disponible" },
                { st: "selected",   label: "Seleccionado" },
                { st: "mine",       label: "Tuyo" },
                { st: "reservado",  label: "Reservado" },
                { st: "vendido",    label: "Vendido" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{
                    width: 13, height: 13, borderRadius: 3,
                    background: NUM_COLORS[l.st].bg, border: `1px solid ${NUM_COLORS[l.st].border}`,
                  }} />
                  <span style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Panel lateral */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
 
            {/* Si la rifa está activa → mostrar selección normal */}
            {isActive && (
              <>
                <div style={{
                  background: "#0d0d14", border: "1px solid rgba(255,255,255,.07)",
                  borderRadius: 12, padding: "18px",
                }}>
                  <h4 style={{
                    color: "rgba(255,255,255,.38)", fontSize: 11,
                    letterSpacing: 2, textTransform: "uppercase", marginBottom: 12,
                  }}>
                    Tu selección
                  </h4>
                  {selected.length === 0 ? (
                    <p style={{ color: "rgba(255,255,255,.18)", fontSize: 13, textAlign: "center", padding: "16px 0" }}>
                      Hacé click en los números
                    </p>
                  ) : (
                    <>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                        {[...selected].sort().map((n) => (
                          <span key={n}
                            onClick={() => setSelected((prev) => prev.filter((x) => x !== n))}
                            title="Click para quitar"
                            style={{
                              background: "rgba(255,215,0,.12)", border: "1px solid rgba(255,215,0,.35)",
                              borderRadius: 5, padding: "3px 9px", color: YELLOW,
                              fontSize: 13, fontWeight: 600, cursor: "pointer",
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
                      <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
                        <StatRow label="Costo por número"    value={`${rifa.pricePerNumber} cr.`} />
                        <StatRow label="Cantidad"            value={selected.length} />
                        <StatRow label="Total a pagar"       value={`${cost} cr.`} highlight />
                        <StatRow label="Créditos disponibles" value={`${currentUser.credits} cr.`} dim />
                      </div>
                    </>
                  )}
                </div>
 
                <button
                  onClick={() => selected.length > 0 && canAfford && onConfirm(selected)}
                  style={{
                    padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                    letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Cinzel', serif",
                    cursor: selected.length > 0 && canAfford ? "pointer" : "not-allowed",
                    background: selected.length > 0 && canAfford
                      ? `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`
                      : "rgba(255,255,255,.04)",
                    border: selected.length > 0 && canAfford ? "none" : "1px solid rgba(255,255,255,.08)",
                    color: selected.length > 0 && canAfford ? "#000" : "rgba(255,255,255,.2)",
                    opacity: selected.length > 0 ? 1 : 0.6,
                    transition: "all .2s",
                  }}
                >
                  {selected.length > 0 ? "Confirmar jugada" : "Seleccioná números"}
                </button>
 
                {selected.length > 0 && !canAfford && (
                  <p style={{ color: "#FF6464", fontSize: 12, textAlign: "center" }}>
                    ⚠ Créditos insuficientes
                  </p>
                )}
              </>
            )}
 
            {/* Si está lista para sortear → panel informativo */}
            {isReadyToDraw && (
              <div style={{
                background: "#0d0d14", border: "1px solid rgba(255,215,0,.2)",
                borderRadius: 12, padding: "20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>🏆</div>
                <p style={{ color: YELLOW, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                  Lista para sortear
                </p>
                <p style={{ color: "rgba(255,255,255,.35)", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
                  Todos los números están vendidos. El sorteo es manual y transparente — el admin lo inicia en vivo.
                </p>
                {/* Info del pozo */}
                <div style={{
                  background: "rgba(0,200,83,.06)", border: "1px solid rgba(0,200,83,.2)",
                  borderRadius: 8, padding: "10px 14px",
                }}>
                  <p style={{ color: "rgba(255,255,255,.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                    Pozo acumulado
                  </p>
                  <p style={{ color: "#00C853", fontWeight: 700, fontSize: 20 }}>
                    {(Object.keys(rifa.numbers).length * rifa.pricePerNumber).toLocaleString()} cr.
                  </p>
                </div>
              </div>
            )}
 
            {/* Si terminó → info del ganador en el panel */}
            {isFinished && rifa.winner && (
              <div style={{
                background: "#0d0d14", border: "1px solid rgba(255,215,0,.2)",
                borderRadius: 12, padding: "20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                <p style={{ color: "rgba(255,255,255,.35)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                  Ganador
                </p>
                <p style={{ color: YELLOW, fontWeight: 900, fontSize: 18, fontFamily: "'Cinzel', serif", marginBottom: 4 }}>
                  {rifa.winner.name}
                </p>
                <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13 }}>
                  Número: <strong style={{ color: YELLOW }}>{rifa.winner.number}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
 
      {/* ── Keyframe para el botón pulsante del admin ── */}
      <style>{`
        @keyframes readyPulse {
          0%,100% { box-shadow: 0 4px 20px rgba(255,215,0,.35); }
          50%      { box-shadow: 0 4px 35px rgba(255,215,0,.65), 0 0 60px rgba(255,215,0,.2); }
        }
      `}</style>
    </div>
  );
}