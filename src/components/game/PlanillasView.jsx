import React, { useState, useEffect } from "react";
import { Header } from "../common/Header";
import { COLORS, FRAC_COLORS } from "../../utils/constants";

const { YELLOW, YELLOW2, BG } = COLORS;
const PURPLE   = "#7C4DFF";
const PURPLE_L = "#A07BFF";
const OR       = "#f97316";

const fmtCr = n => Number(n).toLocaleString("es-AR");

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}

const FRAC_SIZE = { cuarto: 1, medio: 2, entero: 4 };
function getSlots(planilla, num) { return planilla.numbers?.[String(num)] || [null, null, null, null]; }
function freeQuarters(slots) { return slots.filter(s => s === null).length; }
function firstFreeIndex(slots, fraccion) {
  const size = FRAC_SIZE[fraccion];
  for (let i = 0; i <= 4 - size; i++) {
    if (slots.slice(i, i + size).every(s => s === null)) return i;
  }
  return -1;
}
function prizePerQuarter(planilla) { return Math.floor(planilla.prize / 4); }

// ─── NumberCell ───────────────────────────────────────────────────────────────
function NumberCell({ planilla, num, selected, onSelect, currentUser, isMobile }) {
  const slots    = getSlots(planilla, num);
  const free     = freeQuarters(slots);
  const isWinner = planilla.winner?.number === num;
  const isSelected = selected === num;
  const isFull   = free === 0;
  const isMe     = slots.some(s => s?.userId === currentUser.id);
  const canClick = !isFull && planilla.status === "open";

  return (
    <div onClick={() => canClick && onSelect(num)} style={{
      background: isWinner ? `${YELLOW}18` : isSelected ? `${PURPLE}25` : isFull ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.04)",
      border: `2px solid ${isWinner ? YELLOW : isSelected ? PURPLE : isMe ? "rgba(78,205,196,.4)" : isFull ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.1)"}`,
      borderRadius: 12, padding: isMobile ? "5px 4px 3px" : "7px 6px 5px",
      cursor: canClick ? "pointer" : "default", transition: "all .15s", position: "relative", userSelect: "none",
      boxShadow: isSelected ? `0 0 16px ${PURPLE}44` : isWinner ? `0 0 20px ${YELLOW}33` : "none",
    }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: isMobile ? 12 : 14, color: isWinner ? YELLOW : isSelected ? PURPLE_L : "#fff", textAlign: "center", marginBottom: isMobile ? 3 : 4, lineHeight: 1 }}>{num}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, height: isMobile ? 30 : 38 }}>
        {slots.map((slot, i) => (
          <div key={i} style={{
            background: slot ? `${FRAC_COLORS[slot.fraccion]}25` : "rgba(255,255,255,.04)",
            border: `1px solid ${slot ? `${FRAC_COLORS[slot.fraccion]}55` : "rgba(255,255,255,.08)"}`,
            borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isMobile ? 8 : 9, color: slot ? FRAC_COLORS[slot.fraccion] : "transparent", fontWeight: 700,
          }}>
            {slot ? (slot.userId === currentUser.id ? "✓" : slot.avatar?.slice(0, 1)) : ""}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: isMobile ? 8 : 9, marginTop: isMobile ? 2 : 3, fontWeight: 600, color: isFull ? "rgba(255,255,255,.2)" : isMe ? "#4ECDC4" : "rgba(255,255,255,.25)" }}>
        {isFull ? "Lleno" : `${free}/4`}
      </div>
      {isWinner && (
        <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "rgba(255,215,0,.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👑</div>
      )}
    </div>
  );
}

// ─── BuyPanel ─────────────────────────────────────────────────────────────────
function BuyPanel({ planilla, selectedNum, currentUser, onBuy, onClose, isMobile }) {
  const [fraccion, setFraccion] = useState("cuarto");
  if (!planilla || selectedNum === null) return null;
  const slots  = getSlots(planilla, selectedNum);
  const cost   = planilla.prices[fraccion];
  const canFit = firstFreeIndex(slots, fraccion) !== -1;
  const canPay = currentUser.credits >= cost;
  const prizeQ = prizePerQuarter(planilla);

  const content = (
    <>
      {isMobile && <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,.15)", margin: "0 auto 16px" }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ color: "rgba(255,255,255,.35)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Número seleccionado</div>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 24, fontFamily: "'Cinzel',serif" }}>{selectedNum}</div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "6px 14px", color: "rgba(255,255,255,.45)", cursor: "pointer", fontSize: 14 }}>✕</button>
      </div>

      {/* Fraccion selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {["cuarto", "medio", "entero"].map(k => {
          const fits  = firstFreeIndex(slots, k) !== -1;
          const active = fraccion === k;
          const col   = FRAC_COLORS[k];
          return (
            <button key={k} disabled={!fits} onClick={() => fits && setFraccion(k)} style={{
              padding: "12px 8px", borderRadius: 12, cursor: fits ? "pointer" : "not-allowed",
              background: active ? `${col}22` : fits ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.01)",
              border: `2px solid ${active ? col : fits ? `${col}44` : "rgba(255,255,255,.05)"}`,
              color: active ? col : fits ? `${col}88` : "rgba(255,255,255,.15)",
              transition: "all .15s",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif", textTransform: "capitalize" }}>{k}</div>
              <div style={{ fontSize: 15, fontWeight: 900, marginTop: 2 }}>{planilla.prices[k]} cr.</div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
        {[
          { label: "Premio si ganás", value: `${fmtCr(prizeQ * FRAC_SIZE[fraccion])} cr.`, color: "#00C853", big: true },
          { label: "Costo",           value: `${cost} cr.`,                                  color: YELLOW },
          { label: "Tu saldo",        value: `${fmtCr(currentUser.credits)} cr.`,           color: "rgba(255,255,255,.45)" },
        ].map(r => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "rgba(255,255,255,.35)", fontSize: 13 }}>{r.label}</span>
            <span style={{ color: r.color, fontSize: r.big ? 15 : 13, fontWeight: 700 }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Slots visual */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 14 }}>
        {slots.map((s, i) => (
          <div key={i} style={{ height: 28, borderRadius: 7, background: s ? `${FRAC_COLORS[s.fraccion]}25` : "rgba(255,255,255,.04)", border: `1px solid ${s ? `${FRAC_COLORS[s.fraccion]}55` : "rgba(255,255,255,.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: s ? FRAC_COLORS[s.fraccion] : "rgba(255,255,255,.2)" }}>
            {s ? (s.userId === currentUser.id ? "✓" : s.avatar) : "○"}
          </div>
        ))}
      </div>

      {!canFit ? (
        <div style={{ textAlign: "center", padding: "13px", borderRadius: 10, background: "rgba(255,255,255,.03)", color: "rgba(255,255,255,.25)", fontSize: 13 }}>No hay espacio para {fraccion}</div>
      ) : !canPay ? (
        <div style={{ textAlign: "center", padding: "13px", borderRadius: 10, background: "rgba(255,50,50,.06)", border: "1px solid rgba(255,50,50,.2)", color: "#FF6464", fontSize: 14 }}>⚠ Créditos insuficientes</div>
      ) : (
        <button onClick={() => onBuy(selectedNum, fraccion)} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg,${PURPLE},${PURPLE_L})`, border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Cinzel',serif", letterSpacing: .5, textTransform: "uppercase", boxShadow: `0 4px 20px ${PURPLE}44` }}>
          Confirmar · {cost} cr.
        </button>
      )}
    </>
  );

  if (isMobile) return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(135deg,#0d0b1e,#0a0a18)", borderTop: `2px solid ${PURPLE}55`, borderRadius: "20px 20px 0 0", padding: "20px 16px 32px", maxHeight: "80vh", overflowY: "auto" }}>
        {content}
      </div>
    </div>
  );

  return (
    <div style={{ background: "linear-gradient(135deg,#0d0b1e,#0a0a18)", border: `1px solid ${PURPLE}44`, borderRadius: 16, padding: "20px", position: "sticky", top: 20 }}>
      {content}
    </div>
  );
}

// ─── PlanillaCard ─────────────────────────────────────────────────────────────
function PlanillaCard({ planilla, currentUser, onSelect, isActive, isMobile }) {
  const totalSlots  = planilla.totalNumbers * 4;
  const usedSlots   = Object.values(planilla.numbers || {}).flat().filter(Boolean).length;
  const pct         = Math.round((usedSlots / totalSlots) * 100);
  const myCount     = Object.values(planilla.numbers || {}).flat().filter(s => s?.userId === currentUser.id).length;
  const statusColor = planilla.status === "finished" ? "#00C853" : planilla.status === "running" ? YELLOW : PURPLE_L;
  const statusLabel = planilla.status === "finished" ? "Sorteada" : planilla.status === "running" ? "Sorteando…" : "Abierta";

  return (
    <div onClick={() => planilla.status !== "running" && onSelect(planilla.id)} style={{
      background: isActive ? `linear-gradient(135deg,${PURPLE}18,rgba(13,13,26,.95))` : "rgba(13,11,30,.7)",
      border: `2px solid ${isActive ? PURPLE : planilla.status === "finished" ? "rgba(0,200,83,.2)" : "rgba(255,255,255,.07)"}`,
      borderRadius: 16, padding: "16px", cursor: planilla.status !== "running" ? "pointer" : "default",
      transition: "all .18s", marginBottom: 12,
      boxShadow: isActive ? `0 0 24px ${PURPLE}22` : "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${PURPLE}22`, border: `1px solid ${PURPLE}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎰</div>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", color: "#fff", fontWeight: 700, fontSize: isMobile ? 14 : 15 }}>{planilla.name}</div>
            <div style={{ color: "rgba(255,255,255,.35)", fontSize: 11, marginTop: 1 }}>⭐ {planilla.subtitle}</div>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ color: statusColor, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: `${statusColor}12`, border: `1px solid ${statusColor}33`, whiteSpace: "nowrap" }}>{statusLabel}</div>
          <div style={{ color: YELLOW, fontWeight: 900, fontSize: 16, fontFamily: "'Cinzel',serif", marginTop: 4 }}>{fmtCr(planilla.prize)} cr.</div>
        </div>
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ color: "rgba(255,255,255,.3)", fontSize: 11 }}>{usedSlots}/{totalSlots} cuartos ocupados</span>
          <span style={{ color: PURPLE_L, fontSize: 11, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,.06)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${PURPLE},${PURPLE_L})`, borderRadius: 3, transition: "width .4s" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {["cuarto", "medio", "entero"].map(k => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: FRAC_COLORS[k] }} />
            <span style={{ color: FRAC_COLORS[k], fontSize: 11, fontWeight: 700 }}>{k.charAt(0).toUpperCase() + k.slice(1)} {planilla.prices[k]} cr.</span>
          </div>
        ))}
      </div>

      {myCount > 0 && (
        <div style={{ marginTop: 10, padding: "5px 10px", borderRadius: 8, background: "rgba(78,205,196,.06)", border: "1px solid rgba(78,205,196,.2)", color: "#4ECDC4", fontSize: 11, fontWeight: 700 }}>
          ✓ Tenés {myCount} cuarto{myCount > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

// ─── WinnerBanner ─────────────────────────────────────────────────────────────
function WinnerBanner({ planilla, isMobile }) {
  if (!planilla.winner) return null;
  const { number, slots } = planilla.winner;
  const winners = (slots || []).filter(Boolean);
  const prizeQ  = prizePerQuarter(planilla);
  return (
    <div style={{ background: `linear-gradient(135deg,${YELLOW2}18,${YELLOW}08)`, border: `2px solid ${YELLOW}55`, borderRadius: 16, padding: isMobile ? "16px" : "22px", textAlign: "center", marginBottom: 16, boxShadow: `0 0 40px ${YELLOW}18` }}>
      <div style={{ fontSize: 36, marginBottom: 6 }}>🏆</div>
      <div style={{ fontFamily: "'Cinzel',serif", color: YELLOW, fontSize: isMobile ? 18 : 22, fontWeight: 900 }}>¡Salió el Número {number}!</div>
      <div style={{ color: "rgba(255,255,255,.5)", fontSize: 13, margin: "4px 0 14px" }}>Premio: <strong style={{ color: YELLOW }}>{fmtCr(planilla.prize)} cr.</strong></div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {winners.map((w, i) => (
          <div key={i} style={{ background: `${FRAC_COLORS[w.fraccion]}18`, border: `1px solid ${FRAC_COLORS[w.fraccion]}55`, borderRadius: 12, padding: "8px 14px" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{w.avatar} {w.userName}</div>
            <div style={{ color: FRAC_COLORS[w.fraccion], fontSize: 12 }}>{w.fraccion} · +{fmtCr(prizeQ * FRAC_SIZE[w.fraccion])} cr.</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PlanillasView ────────────────────────────────────────────────────────────
export function PlanillasView({ currentUser, db, updateDB, onBack, ...headerProps }) {
  const isMobile = useIsMobile();
  const [activePlanillaId, setActivePlanillaId] = useState(null);
  const [selectedNum, setSelectedNum]           = useState(null);
  const [mobileScreen, setMobileScreen]         = useState("list");

  const planillas      = db.planillas || [];
  const activePlanilla = activePlanillaId != null ? planillas.find(p => p.id === activePlanillaId) : null;

  useEffect(() => {
    if (!isMobile && !activePlanillaId && planillas.length > 0) {
      const first = planillas.find(p => p.status === "open") || planillas[0];
      setActivePlanillaId(first.id);
    }
  }, [planillas, activePlanillaId, isMobile]);

  useEffect(() => { setSelectedNum(null); }, [activePlanillaId]);

  const handleSelectPlanilla = (id) => {
    setActivePlanillaId(id);
    setSelectedNum(null);
    if (isMobile) setMobileScreen("detail");
  };

  const handleBuy = (num, fraccion) => {
    if (!activePlanilla) return;
    const cost = activePlanilla.prices[fraccion];
    const size = FRAC_SIZE[fraccion];
    updateDB(prev => {
      const p = prev.planillas.find(x => x.id === activePlanilla.id);
      if (!p || p.status !== "open") return prev;
      if (currentUser.credits < cost) return prev;
      const slots = [...(p.numbers?.[String(num)] || [null, null, null, null])];
      const idx = firstFreeIndex(slots, fraccion);
      if (idx === -1) return prev;
      const slot = { userId: currentUser.id, userName: currentUser.name, avatar: currentUser.avatar, fraccion };
      for (let i = idx; i < idx + size; i++) slots[i] = slot;
      return {
        ...prev,
        users:    prev.users.map(u => u.id === currentUser.id ? { ...u, credits: u.credits - cost } : u),
        planillas: prev.planillas.map(x => x.id === p.id ? { ...x, numbers: { ...p.numbers, [String(num)]: slots } } : x),
      };
    });
    setSelectedNum(null);
  };

  const gridCols = isMobile
    ? `repeat(${activePlanilla?.totalNumbers <= 9 ? 3 : 4}, 1fr)`
    : "repeat(4, 1fr)";

  const heroSection = (
    <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0d0b1e 0%,#1a0a3e 50%,#0d0b1e 100%)", padding: isMobile ? "22px 16px 24px" : "32px 40px 36px" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "50%", height: "160%", background: "radial-gradient(ellipse,rgba(124,58,237,.15),transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: .015, backgroundImage: "linear-gradient(rgba(124,58,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: PURPLE_L }} />
          <span style={{ color: PURPLE_L, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Juego en vivo</span>
        </div>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: isMobile ? 24 : 38, fontWeight: 900, color: "#fff", marginBottom: 6, lineHeight: 1.1 }}>
          🎰 <span style={{ background: `linear-gradient(135deg,${PURPLE_L},${YELLOW})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Planillas</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: isMobile ? 13 : 15 }}>
          Elegí tu número · Comprá por cuartos, medios o entero
        </p>
      </div>
    </div>
  );

  // ── MOBILE ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    if (mobileScreen === "list") return (
      <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "'Barlow Condensed',sans-serif" }}>
        <Header {...headerProps} currentUser={currentUser} />
        {heroSection}
        <main style={{ padding: "16px 12px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button onClick={onBack} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "7px 14px", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>← Volver</button>
            <span style={{ color: "rgba(255,255,255,.3)", fontSize: 13 }}>Tocá una para jugar</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {planillas.map(p => (
              <PlanillaCard key={p.id} planilla={p} currentUser={currentUser} onSelect={handleSelectPlanilla} isActive={false} isMobile={true} />
            ))}
          </div>
        </main>
      </div>
    );

    return (
      <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "'Barlow Condensed',sans-serif", paddingBottom: selectedNum !== null ? 0 : 24 }}>
        <Header {...headerProps} currentUser={currentUser} />
        {selectedNum !== null && activePlanilla?.status === "open" && (
          <BuyPanel planilla={activePlanilla} selectedNum={selectedNum} currentUser={currentUser} onBuy={handleBuy} onClose={() => setSelectedNum(null)} isMobile={true} />
        )}
        <main style={{ padding: "12px 12px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <button onClick={() => { setMobileScreen("list"); setSelectedNum(null); }} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "7px 14px", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>← Planillas</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Cinzel',serif", color: "#fff", fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activePlanilla?.name}</div>
              <div style={{ color: "rgba(255,255,255,.35)", fontSize: 11 }}>{activePlanilla?.subtitle}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ color: "rgba(255,255,255,.3)", fontSize: 9, textTransform: "uppercase" }}>Premio</div>
              <div style={{ color: YELLOW, fontWeight: 900, fontSize: 15, fontFamily: "'Cinzel',serif" }}>{fmtCr(activePlanilla?.prize)} cr.</div>
            </div>
          </div>

          {activePlanilla?.winner && <WinnerBanner planilla={activePlanilla} isMobile={true} />}

          {/* Prices */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {["cuarto", "medio", "entero"].map(k => (
              <div key={k} style={{ flex: 1, textAlign: "center", padding: "7px 4px", borderRadius: 10, background: `${FRAC_COLORS[k]}11`, border: `1px solid ${FRAC_COLORS[k]}33` }}>
                <div style={{ color: FRAC_COLORS[k], fontSize: 9, textTransform: "uppercase", letterSpacing: .5 }}>{k}</div>
                <div style={{ color: FRAC_COLORS[k], fontSize: 13, fontWeight: 700 }}>{activePlanilla?.prices[k]} cr.</div>
              </div>
            ))}
          </div>

          {activePlanilla?.status === "open" && !selectedNum && (
            <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 8, padding: "10px 12px", marginBottom: 12, color: "rgba(255,255,255,.3)", fontSize: 12, textAlign: "center" }}>
              👆 Tocá un número para elegir tu fracción
            </div>
          )}

          {activePlanilla && (
            <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 8 }}>
              {Array.from({ length: activePlanilla.totalNumbers }, (_, i) => i + 1).map(num => (
                <NumberCell key={num} planilla={activePlanilla} num={num} selected={selectedNum} onSelect={setSelectedNum} currentUser={currentUser} isMobile={true} />
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16, justifyContent: "center" }}>
            {[{ col: FRAC_COLORS.cuarto, label: "Cuarto 1/4" }, { col: FRAC_COLORS.medio, label: "Medio 2/4" }, { col: FRAC_COLORS.entero, label: "Entero 4/4" }, { col: "rgba(255,255,255,.15)", label: "Libre" }].map(({ col, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: col }} />
                <span style={{ color: "rgba(255,255,255,.3)", fontSize: 11 }}>{label}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ── DESKTOP ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "'Barlow Condensed',sans-serif" }}>
      <Header {...headerProps} currentUser={currentUser} />
      {heroSection}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "7px 16px", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 13 }}>← Volver</button>
          <span style={{ color: "rgba(255,255,255,.25)", fontSize: 13 }}>Elegí tu número · Hacé click para seleccionar fracción</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22, alignItems: "start" }}>
          {/* Sidebar planillas */}
          <div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Planillas disponibles</div>
            {planillas.map(p => (
              <PlanillaCard key={p.id} planilla={p} currentUser={currentUser} onSelect={handleSelectPlanilla} isActive={p.id === activePlanillaId} isMobile={false} />
            ))}
          </div>

          {/* Detail */}
          {activePlanilla ? (
            <div>
              {activePlanilla.winner && <WinnerBanner planilla={activePlanilla} isMobile={false} />}

              {/* Header planilla detail */}
              <div style={{ background: "linear-gradient(135deg,rgba(13,11,30,.97),rgba(10,10,22,.95))", border: `1px solid ${PURPLE}33`, borderRadius: 16, padding: "20px 24px", marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Cinzel',serif", color: "#fff", fontSize: 22, fontWeight: 900 }}>{activePlanilla.name}</div>
                    <div style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginTop: 3 }}>⭐ {activePlanilla.subtitle}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "rgba(255,255,255,.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Premio total</div>
                    <div style={{ color: YELLOW, fontWeight: 900, fontSize: 28, fontFamily: "'Cinzel',serif", lineHeight: 1 }}>{fmtCr(activePlanilla.prize)} cr.</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap" }}>
                  {["cuarto", "medio", "entero"].map(k => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: FRAC_COLORS[k] }} />
                      <span style={{ color: FRAC_COLORS[k], fontSize: 13, fontWeight: 700 }}>{k.charAt(0).toUpperCase() + k.slice(1)} — {activePlanilla.prices[k]} cr.</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: selectedNum !== null ? "1fr 260px" : "1fr", gap: 18, alignItems: "start" }}>
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10 }}>
                    {Array.from({ length: activePlanilla.totalNumbers }, (_, i) => i + 1).map(num => (
                      <NumberCell key={num} planilla={activePlanilla} num={num} selected={selectedNum} onSelect={setSelectedNum} currentUser={currentUser} isMobile={false} />
                    ))}
                  </div>
                  {activePlanilla.status === "open" && !selectedNum && (
                    <p style={{ color: "rgba(255,255,255,.25)", fontSize: 12, textAlign: "center", marginTop: 14, padding: "10px 16px", background: "rgba(255,255,255,.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,.05)" }}>
                      💡 Hacé click en un número para elegir tu fracción
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16, justifyContent: "center" }}>
                    {[{ col: FRAC_COLORS.cuarto, label: "Cuarto 1/4" }, { col: FRAC_COLORS.medio, label: "Medio 2/4" }, { col: FRAC_COLORS.entero, label: "Entero 4/4" }, { col: "rgba(255,255,255,.15)", label: "Disponible" }].map(({ col, label }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: col }} />
                        <span style={{ color: "rgba(255,255,255,.3)", fontSize: 11 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedNum !== null && activePlanilla.status === "open" && (
                  <BuyPanel planilla={activePlanilla} selectedNum={selectedNum} currentUser={currentUser} onBuy={handleBuy} onClose={() => setSelectedNum(null)} isMobile={false} />
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "rgba(255,255,255,.2)", fontSize: 15, background: "rgba(124,58,237,.04)", borderRadius: 16, border: "1px solid rgba(124,58,237,.1)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎰</div>
                Seleccioná una planilla para comenzar
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}