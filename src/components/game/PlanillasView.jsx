import React, { useState, useEffect, useRef } from "react";
import { Header } from "../common/Header";
import { COLORS, FRAC_COLORS } from "../../utils/constants";
 
const { YELLOW, YELLOW2, BG } = COLORS;
const PURPLE = "#7C4DFF";
const PURPLE_L = "#A07BFF";
 
// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtCr = (n) => Number(n).toLocaleString("es-AR");
 
// Devuelve los slots de un número: array de 4 posiciones, cada una null o {userId, userName, avatar, fraccion}
function getSlots(planilla, num) {
  return planilla.numbers?.[String(num)] || [null, null, null, null];
}
 
// Cuántos cuartos ocupa una fracción
const FRAC_SIZE = { cuarto: 1, medio: 2, entero: 4 };
 
// Primer índice libre consecutivo para una fracción
function firstFreeIndex(slots, fraccion) {
  const size = FRAC_SIZE[fraccion];
  for (let i = 0; i <= 4 - size; i++) {
    const range = slots.slice(i, i + size);
    if (range.every((s) => s === null)) return i;
  }
  return -1;
}
 
// Cuántos cuartos libres hay
function freeQuarters(slots) {
  return slots.filter((s) => s === null).length;
}
 
// Premio que recibe cada cuarto del número ganador
function prizePerQuarter(planilla) {
  return Math.floor(planilla.prize / 4);
}
 
// ─── Componente de celda 2×2 de un número ────────────────────────────────────
function NumberCell({ planilla, num, selected, onSelect, currentUser }) {
  const slots    = getSlots(planilla, num);
  const free     = freeQuarters(slots);
  const isWinner = planilla.winner?.number === num;
 
  // Dibujar los 4 cuartos en grid 2×2
  const quarters = slots.map((slot, i) => {
    const col = FRAC_COLORS;
    let bg, color, label;
 
    if (!slot) {
      bg    = "rgba(255,255,255,.04)";
      color = "rgba(255,255,255,.15)";
      label = "";
    } else {
      bg    = `${col[slot.fraccion]}22`;
      color = col[slot.fraccion];
      label = slot.avatar || slot.userName?.split(" ")[0]?.slice(0, 4);
    }
 
    return (
      <div key={i} style={{
        background: bg,
        border: `1px solid ${slot ? `${FRAC_COLORS[slot.fraccion]}55` : "rgba(255,255,255,.07)"}`,
        borderRadius: 4,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, color, fontWeight: 700, overflow: "hidden",
        lineHeight: 1, padding: "1px",
      }}>
        {label}
      </div>
    );
  });
 
  const isSelected = selected === num;
  const isFull     = free === 0;
  const isMe       = slots.some((s) => s?.userId === currentUser.id);
 
  return (
    <div
      onClick={() => !isFull && planilla.status === "open" && onSelect(num)}
      style={{
        background: isWinner
          ? `linear-gradient(135deg,${YELLOW2}22,${YELLOW}11)`
          : isSelected
          ? `${PURPLE}22`
          : isFull
          ? "rgba(255,255,255,.02)"
          : "rgba(255,255,255,.03)",
        border: `2px solid ${
          isWinner  ? YELLOW :
          isSelected ? PURPLE :
          isMe      ? "rgba(78,205,196,.4)" :
          isFull    ? "rgba(255,255,255,.05)" :
                      "rgba(255,255,255,.1)"
        }`,
        borderRadius: 10,
        padding: "6px 6px 4px",
        cursor: isFull || planilla.status !== "open" ? "default" : "pointer",
        transition: "all .15s",
        position: "relative",
        minWidth: 0,
      }}
    >
      {/* Número */}
      <div style={{
        fontFamily: "'Cinzel',serif", fontWeight: 900,
        fontSize: 13, color: isWinner ? YELLOW : isSelected ? PURPLE_L : "#fff",
        textAlign: "center", marginBottom: 4, lineHeight: 1,
      }}>{num}</div>
 
      {/* Grid 2×2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, height: 40 }}>
        {quarters}
      </div>
 
      {/* Estado */}
      <div style={{
        textAlign: "center", fontSize: 9, marginTop: 4, fontWeight: 600,
        color: isFull ? "rgba(255,255,255,.25)" : isMe ? "#4ECDC4" : "rgba(255,255,255,.3)",
      }}>
        {isFull ? "Completo" : `${free}/4`}
      </div>
 
      {isWinner && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 8,
          background: "rgba(255,215,0,.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>👑</div>
      )}
    </div>
  );
}
 
// ─── Panel de compra lateral ──────────────────────────────────────────────────
function BuyPanel({ planilla, selectedNum, currentUser, onBuy, onClose }) {
  const [fraccion, setFraccion] = useState("cuarto");
 
  if (!planilla || selectedNum === null) return null;
 
  const slots    = getSlots(planilla, selectedNum);
  const free     = freeQuarters(slots);
  const size     = FRAC_SIZE[fraccion];
  const canFit   = firstFreeIndex(slots, fraccion) !== -1;
  const cost     = planilla.prices[fraccion];
  const canPay   = currentUser.credits >= cost;
  const prizeQ   = prizePerQuarter(planilla);
 
  const fracs = [
    { key: "cuarto", label: "Cuarto", emoji: "▪", slots: 1, prize: prizeQ },
    { key: "medio",  label: "Medio",  emoji: "◑", slots: 2, prize: prizeQ * 2 },
    { key: "entero", label: "Entero", emoji: "⬛", slots: 4, prize: prizeQ * 4 },
  ].filter((f) => firstFreeIndex(slots, f.key) !== -1 || f.key === fraccion);
 
  return (
    <div style={{
      background: "#0d0d1a",
      border: `1px solid ${PURPLE}44`,
      borderRadius: 14,
      padding: "20px",
      position: "sticky", top: 20,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ color: "rgba(255,255,255,.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>
            Elegí tu jugada
          </div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "'Cinzel',serif" }}>
            Número {selectedNum}
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 6, padding: "4px 10px", color: "rgba(255,255,255,.4)",
          cursor: "pointer", fontSize: 12,
        }}>✕</button>
      </div>
 
      {/* Selector de fracción */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { key: "cuarto", label: "Cuarto", price: planilla.prices.cuarto },
          { key: "medio",  label: "Medio",  price: planilla.prices.medio  },
          { key: "entero", label: "Entero", price: planilla.prices.entero },
        ].map(({ key, label, price }) => {
          const fits    = firstFreeIndex(slots, key) !== -1;
          const active  = fraccion === key;
          const col     = FRAC_COLORS[key];
          return (
            <button
              key={key}
              disabled={!fits}
              onClick={() => fits && setFraccion(key)}
              style={{
                flex: 1, padding: "10px 4px", borderRadius: 10, cursor: fits ? "pointer" : "not-allowed",
                background: active ? `${col}22` : fits ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.01)",
                border: `2px solid ${active ? col : fits ? `${col}44` : "rgba(255,255,255,.05)"}`,
                color: active ? col : fits ? `${col}99` : "rgba(255,255,255,.15)",
                transition: "all .15s",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif" }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 900, marginTop: 2 }}>{price} cr.</div>
            </button>
          );
        })}
      </div>
 
      {/* Resumen */}
      <div style={{
        background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)",
        borderRadius: 10, padding: "12px 14px", marginBottom: 14,
      }}>
        {[
          { label: "Número",    value: selectedNum,                       color: PURPLE_L },
          { label: "Fracción",  value: fraccion.charAt(0).toUpperCase() + fraccion.slice(1), color: FRAC_COLORS[fraccion] },
          { label: "Costo",     value: `${planilla.prices[fraccion]} cr.`, color: YELLOW },
          { label: "Tu crédito",value: `${fmtCr(currentUser.credits)} cr.`, color: "rgba(255,255,255,.5)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>{label}</span>
            <span style={{ color, fontSize: 13, fontWeight: 700 }}>{value}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 6, marginTop: 4,
          display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>Premio si ganás</span>
          <span style={{ color: "#00C853", fontSize: 14, fontWeight: 900 }}>
            {fmtCr(prizeQ * FRAC_SIZE[fraccion])} cr.
          </span>
        </div>
      </div>
 
      {/* Slots libres visual */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginBottom: 14 }}>
        {slots.map((s, i) => (
          <div key={i} style={{
            height: 24, borderRadius: 5,
            background: s ? `${FRAC_COLORS[s.fraccion]}33` : "rgba(255,255,255,.04)",
            border: `1px solid ${s ? `${FRAC_COLORS[s.fraccion]}66` : "rgba(255,255,255,.08)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, color: s ? FRAC_COLORS[s.fraccion] : "rgba(255,255,255,.2)",
          }}>
            {s ? (s.userId === currentUser.id ? "✓" : s.avatar) : "○"}
          </div>
        ))}
      </div>
 
      {/* Botón */}
      {!canFit ? (
        <div style={{
          textAlign: "center", padding: "11px", borderRadius: 9,
          background: "rgba(255,255,255,.03)", color: "rgba(255,255,255,.25)", fontSize: 13,
        }}>
          No hay espacio para {fraccion}
        </div>
      ) : !canPay ? (
        <div style={{
          textAlign: "center", padding: "11px", borderRadius: 9,
          background: "rgba(255,50,50,.06)", border: "1px solid rgba(255,50,50,.2)",
          color: "#FF6464", fontSize: 13,
        }}>
          ⚠ Créditos insuficientes
        </div>
      ) : (
        <button
          onClick={() => onBuy(selectedNum, fraccion)}
          style={{
            width: "100%", padding: "12px",
            background: `linear-gradient(135deg,${PURPLE},${PURPLE_L})`,
            border: "none", borderRadius: 9, color: "#fff",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Cinzel',serif", letterSpacing: 0.5, textTransform: "uppercase",
          }}
        >
          Confirmar con crédito
        </button>
      )}
    </div>
  );
}
 
// ─── Tabla de jugadores cargados ──────────────────────────────────────────────
function PlayersTable({ planilla }) {
  const [showAll, setShowAll] = useState(false);
 
  // Recolectar todos los slots ocupados
  const all = [];
  for (let n = 1; n <= planilla.totalNumbers; n++) {
    const slots = getSlots(planilla, n);
    slots.forEach((s) => {
      if (s) all.push({ ...s, number: n });
    });
  }
 
  const visible = showAll ? all : all.slice(0, 5);
 
  if (all.length === 0) return null;
 
  return (
    <div style={{
      background: "#0d0d1a",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 14, padding: "16px", marginTop: 16,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 12,
      }}>
        <div style={{
          color: "#fff", fontWeight: 700, fontSize: 14,
          fontFamily: "'Barlow Condensed',sans-serif",
        }}>
          👥 Jugadores cargados
        </div>
        <span style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>{all.length} jugadas</span>
      </div>
 
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: "6px 12px", alignItems: "center" }}>
        {["#", "Jugador", "Número", "Fracción"].map((h) => (
          <div key={h} style={{ color: "rgba(255,255,255,.25)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>{h}</div>
        ))}
        {visible.map((p, i) => (
          <React.Fragment key={i}>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 11 }}>{i + 1}</div>
            <div style={{ color: "#fff", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span>{p.avatar}</span> {p.userName}
            </div>
            <div style={{
              background: `${PURPLE}22`, border: `1px solid ${PURPLE}44`,
              borderRadius: 6, padding: "2px 8px", color: PURPLE_L,
              fontSize: 11, fontWeight: 700, textAlign: "center",
            }}>{p.number}</div>
            <div style={{
              background: `${FRAC_COLORS[p.fraccion]}22`,
              border: `1px solid ${FRAC_COLORS[p.fraccion]}44`,
              borderRadius: 6, padding: "2px 8px",
              color: FRAC_COLORS[p.fraccion], fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: 2,
                background: FRAC_COLORS[p.fraccion], display: "inline-block",
              }}/>
              {p.fraccion.charAt(0).toUpperCase() + p.fraccion.slice(1)}
            </div>
          </React.Fragment>
        ))}
      </div>
 
      {all.length > 5 && (
        <button onClick={() => setShowAll(!showAll)} style={{
          marginTop: 10, background: "none", border: "none",
          color: PURPLE_L, cursor: "pointer", fontSize: 12,
          fontFamily: "'Barlow Condensed',sans-serif",
        }}>
          {showAll ? "Ver menos ↑" : `Ver todos los jugadores (${all.length}) →`}
        </button>
      )}
    </div>
  );
}
 
// ─── Card de planilla en el listado ──────────────────────────────────────────
function PlanillaCard({ planilla, currentUser, onSelect, isActive }) {
  const totalSlots = planilla.totalNumbers * 4;
  const usedSlots  = Object.values(planilla.numbers || {})
    .flat().filter(Boolean).length;
  const pct        = Math.round((usedSlots / totalSlots) * 100);
  const myCount    = Object.values(planilla.numbers || {})
    .flat().filter((s) => s?.userId === currentUser.id).length;
 
  const statusColor =
    planilla.status === "finished" ? "#00C853" :
    planilla.status === "running"  ? YELLOW :
    PURPLE_L;
  const statusLabel =
    planilla.status === "finished" ? "Sorteado" :
    planilla.status === "running"  ? "Sorteando…" :
    "Abierto";
 
  return (
    <div
      onClick={() => planilla.status !== "running" && onSelect(planilla.id)}
      style={{
        background: isActive ? `${PURPLE}18` : "#0d0d1a",
        border: `2px solid ${isActive ? PURPLE : planilla.status === "finished" ? "rgba(0,200,83,.2)" : "rgba(255,255,255,.08)"}`,
        borderRadius: 14, padding: "18px 20px",
        cursor: planilla.status !== "running" ? "pointer" : "default",
        transition: "all .15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", color: "#fff", fontWeight: 700, fontSize: 15 }}>
            {planilla.name}
          </div>
          <div style={{ color: "rgba(255,255,255,.35)", fontSize: 12, marginTop: 2 }}>
            ⭐ {planilla.subtitle}
          </div>
        </div>
        <span style={{
          padding: "3px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700,
          background: `${statusColor}18`, border: `1px solid ${statusColor}44`,
          color: statusColor,
        }}>{statusLabel}</span>
      </div>
 
      {/* Premio */}
      <div style={{
        background: `${YELLOW}11`, border: `1px solid ${YELLOW}33`,
        borderRadius: 9, padding: "8px 12px", marginBottom: 12,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>Premio total</span>
        <span style={{ color: YELLOW, fontWeight: 900, fontSize: 18, fontFamily: "'Cinzel',serif" }}>
          {fmtCr(planilla.prize)} cr.
        </span>
      </div>
 
      {/* Precios */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["cuarto","medio","entero"].map((k) => (
          <div key={k} style={{
            flex: 1, textAlign: "center", padding: "5px 4px", borderRadius: 7,
            background: `${FRAC_COLORS[k]}11`, border: `1px solid ${FRAC_COLORS[k]}33`,
          }}>
            <div style={{ color: FRAC_COLORS[k], fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
            <div style={{ color: FRAC_COLORS[k], fontSize: 12, fontWeight: 700 }}>{planilla.prices[k]} cr.</div>
          </div>
        ))}
      </div>
 
      {/* Progreso */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ color: "rgba(255,255,255,.3)", fontSize: 11 }}>
            {usedSlots}/{totalSlots} cuartos vendidos
          </span>
          <span style={{ color: PURPLE_L, fontSize: 11, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,.06)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg,${PURPLE},${PURPLE_L})`,
            borderRadius: 3, transition: "width .4s",
          }}/>
        </div>
      </div>
 
      {myCount > 0 && (
        <div style={{
          marginTop: 10, padding: "5px 10px", borderRadius: 7,
          background: "rgba(78,205,196,.06)", border: "1px solid rgba(78,205,196,.2)",
          color: "#4ECDC4", fontSize: 11, fontWeight: 600,
        }}>
          ✓ Tenés {myCount} cuarto{myCount > 1 ? "s" : ""} en esta planilla
        </div>
      )}
    </div>
  );
}
 
// ─── Vista de ganador ─────────────────────────────────────────────────────────
function WinnerBanner({ planilla, users }) {
  if (!planilla.winner) return null;
  const { number, slots } = planilla.winner;
  const winners = slots.filter(Boolean);
  const prizeQ  = prizePerQuarter(planilla);
 
  return (
    <div style={{
      background: `linear-gradient(135deg,${YELLOW2}18,${YELLOW}08)`,
      border: `2px solid ${YELLOW}55`,
      borderRadius: 14, padding: "20px",
      textAlign: "center", marginBottom: 20,
    }}>
      <div style={{ fontSize: 36, marginBottom: 6 }}>🏆</div>
      <div style={{ fontFamily: "'Cinzel',serif", color: YELLOW, fontSize: 20, fontWeight: 900 }}>
        ¡Salió el Número {number}!
      </div>
      <div style={{ color: "rgba(255,255,255,.5)", fontSize: 13, margin: "6px 0 14px" }}>
        Premio total: <strong style={{ color: YELLOW }}>{fmtCr(planilla.prize)} cr.</strong>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {winners.map((w, i) => (
          <div key={i} style={{
            background: `${FRAC_COLORS[w.fraccion]}22`,
            border: `1px solid ${FRAC_COLORS[w.fraccion]}55`,
            borderRadius: 10, padding: "8px 14px",
          }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{w.avatar} {w.userName}</div>
            <div style={{ color: FRAC_COLORS[w.fraccion], fontSize: 11 }}>
              {w.fraccion.charAt(0).toUpperCase() + w.fraccion.slice(1)} · +{fmtCr(prizeQ * FRAC_SIZE[w.fraccion])} cr.
            </div>
          </div>
        ))}
        {[...Array(4 - winners.length)].map((_, i) => (
          <div key={`empty-${i}`} style={{
            background: "rgba(255,255,255,.02)", border: "1px dashed rgba(255,255,255,.1)",
            borderRadius: 10, padding: "8px 14px",
            color: "rgba(255,255,255,.2)", fontSize: 11,
          }}>Sin dueño</div>
        ))}
      </div>
    </div>
  );
}
 
// ─── Vista principal ──────────────────────────────────────────────────────────
export function PlanillasView({ currentUser, db, updateDB, onBack, ...headerProps }) {
  const [activePlanillaId, setActivePlanillaId] = useState(null);
  const [selectedNum, setSelectedNum]           = useState(null);
  const gridRef = useRef(null);
 
  const planillas    = db.planillas || [];
  const activePlanilla = activePlanillaId != null
    ? planillas.find((p) => p.id === activePlanillaId)
    : null;
 
  // Seleccionar la primera planilla abierta por defecto
  useEffect(() => {
    if (!activePlanillaId && planillas.length > 0) {
      const first = planillas.find((p) => p.status === "open") || planillas[0];
      setActivePlanillaId(first.id);
    }
  }, [planillas, activePlanillaId]);
 
  // Al cambiar planilla, limpiar selección
  useEffect(() => { setSelectedNum(null); }, [activePlanillaId]);
 
  // ── Comprar fracción ────────────────────────────────────────────────────────
  const handleBuy = (num, fraccion) => {
    if (!activePlanilla) return;
    const cost    = activePlanilla.prices[fraccion];
    const size    = FRAC_SIZE[fraccion];
 
    updateDB((prev) => {
      const p = prev.planillas.find((x) => x.id === activePlanilla.id);
      if (!p || p.status !== "open") return prev;
      if (currentUser.credits < cost)  return prev;
 
      const slots  = [...(p.numbers?.[String(num)] || [null, null, null, null])];
      const idx    = firstFreeIndex(slots, fraccion);
      if (idx === -1) return prev;
 
      const slot = { userId: currentUser.id, userName: currentUser.name, avatar: currentUser.avatar, fraccion };
      for (let i = idx; i < idx + size; i++) slots[i] = slot;
 
      const newNumbers = { ...p.numbers, [String(num)]: slots };
 
      return {
        ...prev,
        users: prev.users.map((u) =>
          u.id === currentUser.id ? { ...u, credits: u.credits - cost } : u
        ),
        planillas: prev.planillas.map((x) =>
          x.id === p.id ? { ...x, numbers: newNumbers } : x
        ),
      };
    });
 
    setSelectedNum(null);
  };
 
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Barlow Condensed',sans-serif" }}>
      <Header {...headerProps} currentUser={currentUser} />
 
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
 
        {/* ── Encabezado ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 8, padding: "7px 14px", color: "rgba(255,255,255,.5)",
            cursor: "pointer", fontSize: 13,
          }}>← Volver</button>
          <div>
            <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 900, color: "#fff", margin: 0 }}>
              ⭐ Sorteos
            </h1>
            <p style={{ color: "rgba(255,255,255,.3)", fontSize: 13, margin: "2px 0 0" }}>
              Elegí tu número · Comprá por cuartos, medios o entero
            </p>
          </div>
        </div>
 
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>
 
          {/* ── Lista de planillas (izquierda) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
              Planillas disponibles
            </div>
            {planillas.map((p) => (
              <PlanillaCard
                key={p.id}
                planilla={p}
                currentUser={currentUser}
                onSelect={setActivePlanillaId}
                isActive={p.id === activePlanillaId}
              />
            ))}
          </div>
 
          {/* ── Detalle de planilla (derecha) ── */}
          {activePlanilla ? (
            <div>
              {/* Banner ganador */}
              {activePlanilla.winner && (
                <WinnerBanner planilla={activePlanilla} users={db.users} />
              )}
 
              {/* Header planilla */}
              <div style={{
                background: "#0d0d1a",
                border: `1px solid ${PURPLE}33`,
                borderRadius: 14, padding: "18px 22px",
                marginBottom: 16,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Cinzel',serif", color: "#fff", fontSize: 20, fontWeight: 900 }}>
                      {activePlanilla.name}
                    </div>
                    <div style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginTop: 3 }}>
                      ⭐ {activePlanilla.subtitle}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "rgba(255,255,255,.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Premio</div>
                    <div style={{ color: YELLOW, fontWeight: 900, fontSize: 26, fontFamily: "'Cinzel',serif", lineHeight: 1 }}>
                      {fmtCr(activePlanilla.prize)} cr.
                    </div>
                  </div>
                </div>
 
                {/* Leyenda precios */}
                <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
                  {["cuarto","medio","entero"].map((k) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: FRAC_COLORS[k] }}/>
                      <span style={{ color: FRAC_COLORS[k], fontSize: 12, fontWeight: 700 }}>
                        {k.charAt(0).toUpperCase() + k.slice(1)} {activePlanilla.prices[k]} cr.
                      </span>
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(255,255,255,.08)", border: "1px dashed rgba(255,255,255,.2)" }}/>
                    <span style={{ color: "rgba(255,255,255,.35)", fontSize: 12 }}>Disponible libre</span>
                  </div>
                </div>
              </div>
 
              {/* Layout grid + panel */}
              <div style={{ display: "grid", gridTemplateColumns: selectedNum !== null ? "1fr 240px" : "1fr", gap: 16, alignItems: "start" }}>
 
                {/* Grid de números */}
                <div ref={gridRef}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 10,
                  }}>
                    {Array.from({ length: activePlanilla.totalNumbers }, (_, i) => i + 1).map((num) => (
                      <NumberCell
                        key={num}
                        planilla={activePlanilla}
                        num={num}
                        selected={selectedNum}
                        onSelect={setSelectedNum}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>
 
                  {/* Instrucción */}
                  {activePlanilla.status === "open" && !selectedNum && (
                    <p style={{
                      color: "rgba(255,255,255,.25)", fontSize: 12, textAlign: "center",
                      marginTop: 14, padding: "10px 16px",
                      background: "rgba(255,255,255,.02)", borderRadius: 8,
                      border: "1px solid rgba(255,255,255,.05)",
                    }}>
                      💡 Hacé click en un número para elegir tu fracción y comprar
                    </p>
                  )}
 
                  {/* Leyenda inferior */}
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16, justifyContent: "center" }}>
                    {[
                      { col: FRAC_COLORS.cuarto, label: "Cuarto · 1/4 del número" },
                      { col: FRAC_COLORS.medio,  label: "Medio · 2/4 del número" },
                      { col: FRAC_COLORS.entero, label: "Entero · 4/4 del número" },
                      { col: "rgba(255,255,255,.15)", label: "Disponible libre" },
                    ].map(({ col, label }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: col }}/>
                        <span style={{ color: "rgba(255,255,255,.3)", fontSize: 11 }}>{label}</span>
                      </div>
                    ))}
                  </div>
 
                  {/* Tabla jugadores */}
                  <PlayersTable planilla={activePlanilla} />
                </div>
 
                {/* Panel de compra */}
                {selectedNum !== null && activePlanilla.status === "open" && (
                  <BuyPanel
                    planilla={activePlanilla}
                    selectedNum={selectedNum}
                    currentUser={currentUser}
                    onBuy={handleBuy}
                    onClose={() => setSelectedNum(null)}
                  />
                )}
              </div>
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 300, color: "rgba(255,255,255,.2)", fontSize: 15,
            }}>
              Seleccioná una planilla para comenzar
            </div>
          )}
        </div>
      </main>
    </div>
  );
}