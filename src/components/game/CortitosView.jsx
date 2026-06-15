import { useState, useEffect, useRef } from "react";
import { COLORS, BALL_COLORS, CORTITOS_INIT } from "../../utils/constants";
import { Header } from "../common/Header";
 
const { YELLOW, YELLOW2, BG } = COLORS;
const V = "#7c3aed"; const VL = "#a855f7"; const OR = "#f97316";
 
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}
 
const bColor = (n) => BALL_COLORS[(n - 1) % BALL_COLORS.length];
 
// ─── Animated Roulette ────────────────────────────────────────────────────────
function AnimatedRoulette({ cortito }) {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const rafRef = useRef(null);
  const isFinished = cortito.status === "finished";
  const isRunning  = cortito.status === "running";
  const seq        = cortito?.seq || [];
  const lastBall   = seq.length > 0 ? seq[seq.length - 1] : null;
 
  useEffect(() => {
    if (isRunning) {
      setSpinning(true);
      let a = angle;
      const spin = () => {
        a += 4;
        setAngle(a);
        rafRef.current = requestAnimationFrame(spin);
      };
      rafRef.current = requestAnimationFrame(spin);
      return () => cancelAnimationFrame(rafRef.current);
    } else {
      setSpinning(false);
      cancelAnimationFrame(rafRef.current);
    }
  }, [isRunning]);
 
  const balls = Array.from({ length: 8 }, (_, i) => i + 1);
 
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0 16px" }}>
      {/* Roulette bowl */}
      <div style={{ position: "relative", width: 180, height: 180 }}>
        {/* Outer ring */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #1e1040, #05050f)",
          border: `3px solid rgba(201,168,76,.55)`,
          boxShadow: "0 0 40px rgba(201,168,76,.2), inset 0 0 40px rgba(0,0,0,.6)",
        }} />
        {/* Inner shadow ring */}
        <div style={{
          position: "absolute", inset: 12, borderRadius: "50%",
          border: "1px solid rgba(201,168,76,.15)",
          background: "radial-gradient(circle at 38% 32%, rgba(30,16,64,.8), rgba(5,5,15,.9))",
        }} />
        {/* Spinning balls */}
        <div style={{
          position: "absolute", inset: 0,
          transform: spinning ? `rotate(${angle}deg)` : "rotate(0deg)",
          transition: spinning ? "none" : "transform .5s ease-out",
        }}>
          {balls.map((num, i) => {
            const a = (i / balls.length) * 360 - 90;
            const r = 62;
            const x = Math.cos(a * Math.PI / 180) * r;
            const y = Math.sin(a * Math.PI / 180) * r;
            const isLast = lastBall === num && !spinning;
            return (
              <div key={num} style={{
                position: "absolute",
                left: `calc(50% + ${x}px - 14px)`,
                top:  `calc(50% + ${y}px - 14px)`,
                width: 28, height: 28, borderRadius: "50%",
                background: `radial-gradient(circle at 33% 33%, rgba(255,255,255,.35), ${bColor(num)})`,
                boxShadow: isLast
                  ? `0 0 16px ${bColor(num)}, 0 2px 8px rgba(0,0,0,.5)`
                  : `0 2px 8px rgba(0,0,0,.5)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 900, color: "#fff",
                border: isLast ? `2px solid #fff` : "none",
                transform: spinning ? `rotate(-${angle}deg)` : "none",
                transition: spinning ? "none" : "box-shadow .3s",
                zIndex: isLast ? 2 : 1,
              }}>{num}</div>
            );
          })}
        </div>
        {/* Center hub */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 32, height: 32, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,.3), rgba(5,5,15,.9))",
          border: "2px solid rgba(201,168,76,.4)",
          zIndex: 3,
        }} />
        {/* Status overlay */}
        {isFinished && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(0,200,83,.06)",
            border: "3px solid rgba(0,200,83,.4)",
          }} />
        )}
      </div>
      {/* Spout */}
      <div style={{ width: 60, height: 8, background: "rgba(201,168,76,.25)", borderRadius: 4, marginTop: 4, border: "1px solid rgba(201,168,76,.2)" }} />
 
      {/* Status label */}
      <div style={{ marginTop: 14, textAlign: "center" }}>
        {isRunning && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: YELLOW, animation: "pulse 1s infinite" }} />
            <span style={{ color: YELLOW, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>Sorteando…</span>
          </div>
        )}
        {isFinished && cortito.winner && (
          <div style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 10, padding: "8px 16px", marginTop: 4 }}>
            <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Ganador</div>
            <div style={{ color: YELLOW, fontWeight: 900, fontSize: 16, fontFamily: "'Cinzel',serif" }}>
              {cortito.winner.player?.avatar} {cortito.winner.player?.userName}
            </div>
            <div style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>Slot #{cortito.winner.slotNumber}</div>
          </div>
        )}
        {!isRunning && !isFinished && (
          <p style={{ color: "rgba(255,255,255,.25)", fontSize: 11, textAlign: "center", letterSpacing: .5, textTransform: "uppercase", margin: 0 }}>
            Arranca cuando la planilla se completa
          </p>
        )}
      </div>
    </div>
  );
}
 
// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ cortito }) {
  const filled = cortito.players.length;
  const total  = cortito.totalSlots;
  if (cortito.status === "finished")
    return <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(0,200,83,.1)", border: "1px solid rgba(0,200,83,.3)", color: "#00C853", whiteSpace: "nowrap" }}>✓ Finalizado</span>;
  if (cortito.status === "running")
    return <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `rgba(251,191,36,.12)`, border: `1px solid ${YELLOW}66`, color: YELLOW, whiteSpace: "nowrap" }}>🎰 Sorteando…</span>;
  return <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(168,85,247,.1)", border: "1px solid rgba(168,85,247,.3)", color: VL, whiteSpace: "nowrap" }}>{filled}/{total} completa</span>;
}
 
// ─── Casillero ────────────────────────────────────────────────────────────────
function Casillero({ filled }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: "50%", margin: "0 auto",
      background: filled ? "rgba(0,200,83,.15)" : "rgba(255,255,255,.04)",
      border: `1.5px solid ${filled ? "rgba(0,200,83,.5)" : "rgba(255,255,255,.1)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {filled && <span style={{ color: "#00C853", fontSize: 10, fontWeight: 700 }}>✓</span>}
    </div>
  );
}
 
// ─── PlanillaCard ─────────────────────────────────────────────────────────────
function PlanillaCard({ cortito, currentUser, onJoinClick, isSelected, onSelect }) {
  const cas      = {};
  (cortito.seq || []).forEach(n => { cas[n] = (cas[n] || 0) + 1; });
  const mySlots   = cortito.players.filter(p => p.userId === currentUser.id);
  const freeSlots = cortito.totalSlots - cortito.players.length;
  const prize     = cortito.costPerSlot * cortito.totalSlots;
  const casCols   = Array.from({ length: cortito.casillerosToWin }, (_, i) => i + 1);
 
  return (
    <div onClick={() => onSelect(cortito.id)} style={{
      background: isSelected
        ? "linear-gradient(135deg, rgba(124,58,237,.12), rgba(10,10,20,.95))"
        : "rgba(13,11,30,.7)",
      border: `1px solid ${isSelected ? "rgba(168,85,247,.45)" : cortito.status === "finished" ? "rgba(0,200,83,.2)" : "rgba(255,255,255,.07)"}`,
      borderRadius: 16, overflow: "hidden", cursor: "pointer",
      boxShadow: isSelected ? "0 0 32px rgba(124,58,237,.15)" : "none",
      transition: "all .22s", marginBottom: 14,
    }}>
      {/* Header */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${OR}22`, border: `1px solid ${OR}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", color: "#fff", fontSize: 14, fontWeight: 700 }}>{cortito.name}</div>
            <div style={{ color: "rgba(255,255,255,.35)", fontSize: 11 }}>{cortito.description}</div>
          </div>
          {mySlots.length > 0 && (
            <span style={{ padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700, background: "rgba(78,205,196,.1)", border: "1px solid rgba(78,205,196,.3)", color: "#4ECDC4" }}>
              {mySlots.length === 1 ? `Slot #${mySlots[0].slotNumber}` : `${mySlots.length} slots`}
            </span>
          )}
        </div>
        <StatusBadge cortito={cortito} />
      </div>
 
      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Barlow Condensed',sans-serif" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,.02)" }}>
              <th style={{ padding: "7px 10px 7px 16px", textAlign: "center", color: "rgba(255,255,255,.28)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", width: 36 }}>N°</th>
              <th style={{ padding: "7px 10px", textAlign: "left", color: "rgba(255,255,255,.28)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Jugador</th>
              {casCols.map(i => (
                <th key={i} style={{ padding: "5px 3px", textAlign: "center", width: 32 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: bColor(i), boxShadow: `0 2px 6px ${bColor(i)}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", margin: "0 auto" }}>{i}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cortito.totalSlots }, (_, i) => {
              const sn       = i + 1;
              const player   = cortito.players.find(p => p.slotNumber === sn);
              const filled   = Math.min(cas[sn] || 0, cortito.casillerosToWin);
              const isWinner = cortito.winner?.slotNumber === sn;
              const isMe     = player?.userId === currentUser.id;
              return (
                <tr key={sn} style={{ borderBottom: "1px solid rgba(255,255,255,.03)", background: isWinner ? "rgba(201,168,76,.07)" : isMe ? "rgba(124,58,237,.05)" : i % 2 ? "rgba(255,255,255,.01)" : "transparent" }}>
                  <td style={{ padding: "8px 10px 8px 16px", textAlign: "center" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", margin: "0 auto", background: `${bColor(sn)}18`, border: `1.5px solid ${bColor(sn)}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: bColor(sn) }}>{sn}</div>
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    {player ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {isWinner && <span style={{ fontSize: 12 }}>⭐</span>}
                        <span style={{ fontSize: 13 }}>{player.avatar}</span>
                        <span style={{ color: isWinner ? YELLOW : isMe ? "#4ECDC4" : "rgba(255,255,255,.7)", fontSize: 12, fontWeight: isWinner || isMe ? 700 : 400 }}>{player.userName}</span>
                        {isMe && <span style={{ color: "rgba(78,205,196,.45)", fontSize: 9 }}>(vos)</span>}
                      </div>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,.18)", fontSize: 11, fontStyle: "italic" }}>— Vacante —</span>
                    )}
                  </td>
                  {casCols.map(ci => (
                    <td key={ci} style={{ padding: "8px 3px", textAlign: "center" }}>
                      <Casillero filled={ci <= filled} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
 
      {/* Footer */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "Entrada",     value: `${cortito.costPerSlot} cr.`,    color: YELLOW },
            { label: "Pozo",        value: `${prize.toLocaleString()} cr.`, color: "#00C853" },
            { label: "Disponibles", value: `${freeSlots} slots`,             color: "rgba(255,255,255,.4)" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: "rgba(255,255,255,.25)", fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              <div style={{ color: s.color, fontWeight: 700, fontSize: 13 }}>{s.value}</div>
            </div>
          ))}
        </div>
        {cortito.status === "open" && freeSlots > 0 && (
          <button onClick={e => { e.stopPropagation(); onJoinClick(cortito); }} style={{
            background: `linear-gradient(135deg,${YELLOW2},${YELLOW})`, border: "none",
            borderRadius: 8, padding: "8px 18px", color: "#000", fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Cinzel',serif", letterSpacing: 1, textTransform: "uppercase",
          }}>{mySlots.length > 0 ? "+ Más slots" : "Unirme"}</button>
        )}
        {cortito.status === "finished" && cortito.winner && (
          <span style={{ color: YELLOW, fontSize: 12, fontWeight: 700 }}>🏆 {cortito.winner.player?.userName || `Slot #${cortito.winner.slotNumber}`}</span>
        )}
      </div>
    </div>
  );
}
 
// ─── BolilleroPanel ───────────────────────────────────────────────────────────
function BolilleroPanel({ cortito }) {
  const seq = cortito?.seq || [];
 
  return (
    <div style={{ background: "linear-gradient(135deg, rgba(13,11,30,.97), rgba(10,10,22,.95))", border: "1px solid rgba(201,168,76,.2)", borderRadius: 18, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(201,168,76,.1)", background: "rgba(0,0,0,.2)", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ color: YELLOW, fontSize: 14 }}>✦</span>
          <span style={{ fontFamily: "'Cinzel',serif", color: YELLOW, fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>Bolillero automático</span>
          <span style={{ color: YELLOW, fontSize: 14 }}>✦</span>
        </div>
        <p style={{ color: "rgba(255,255,255,.3)", fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>
          El sistema se ejecuta de forma automática y transparente.<br />No necesitás estar conectado para que funcione.
        </p>
      </div>
 
      {/* Roulette */}
      <div style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,.05) 0%, transparent 70%)", padding: "0 20px" }}>
        <AnimatedRoulette cortito={cortito} />
      </div>
 
      {/* Sequence */}
      {seq.length > 0 && (
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Secuencia — {seq.length} bolillas</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, maxHeight: 120, overflowY: "auto" }}>
            {seq.map((n, i) => {
              const isLast = i === seq.length - 1;
              return (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: isLast ? bColor(n) : `${bColor(n)}33`,
                  border: `1.5px solid ${isLast ? bColor(n) : `${bColor(n)}55`}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                  color: isLast ? "#fff" : bColor(n),
                  boxShadow: isLast ? `0 0 10px ${bColor(n)}88` : "none",
                  flexShrink: 0,
                }}>{n}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
 
// ─── SlotModal ────────────────────────────────────────────────────────────────
function SlotModal({ cortito, currentUser, onConfirm, onClose }) {
  const [selected, setSelected] = useState(new Set());
  const [hovered, setHovered]   = useState(null);
  const prize         = cortito.costPerSlot * cortito.totalSlots;
  const maxAffordable = Math.floor(currentUser.credits / cortito.costPerSlot);
  const totalCost     = selected.size * cortito.costPerSlot;
  const canAffordMore = (selected.size + 1) * cortito.costPerSlot <= currentUser.credits;
  const myExisting    = new Set(cortito.players.filter(p => p.userId === currentUser.id).map(p => p.slotNumber));
 
  const toggleSlot = (sn) => {
    const isOccupied = cortito.players.some(p => p.slotNumber === sn);
    if (isOccupied || myExisting.has(sn)) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(sn)) { next.delete(sn); return next; }
      if (!canAffordMore) return prev;
      next.add(sn); return next;
    });
  };
 
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed',sans-serif", padding: 16 }}>
      <div style={{ width: "min(480px,100%)", background: "linear-gradient(135deg, #0d0b1e, #0a0a18)", border: "1px solid rgba(168,85,247,.3)", borderRadius: 18, padding: "24px", boxShadow: "0 24px 64px rgba(0,0,0,.7)", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: "'Cinzel',serif", color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{cortito.name}</h2>
            <p style={{ color: "rgba(255,255,255,.35)", fontSize: 12, margin: "4px 0 0" }}>{cortito.description}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "5px 12px", color: "rgba(255,255,255,.45)", cursor: "pointer", fontSize: 14, flexShrink: 0 }}>✕</button>
        </div>
 
        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          {[
            { label: "Entrada x slot", value: `${cortito.costPerSlot} cr.`, color: YELLOW },
            { label: "Premio total",   value: `${prize.toLocaleString()} cr.`, color: "#00C853" },
            { label: "Tu saldo",       value: `${currentUser.credits.toLocaleString()} cr.`, color: "rgba(255,255,255,.5)" },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, minWidth: 80, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: "8px 10px" }}>
              <div style={{ color: "rgba(255,255,255,.25)", fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              <div style={{ color: s.color, fontWeight: 700, fontSize: 14 }}>{s.value}</div>
            </div>
          ))}
        </div>
 
        <p style={{ color: "rgba(255,255,255,.35)", fontSize: 12, marginBottom: 14, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
          💡 Elegí uno o más slots libres. Podés tomar hasta {maxAffordable} slot{maxAffordable !== 1 ? "s" : ""} con tu saldo.
        </p>
 
        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }}>
          {Array.from({ length: cortito.totalSlots }, (_, i) => {
            const sn         = i + 1;
            const occupant   = cortito.players.find(p => p.slotNumber === sn);
            const isMyExist  = myExisting.has(sn);
            const isFree     = !occupant && !isMyExist;
            const isSel      = selected.has(sn);
            const isHov      = hovered === sn;
            const cantAfford = isFree && !isSel && !canAffordMore;
            let bg, border, color, cursor;
            if (isMyExist)   { bg = "rgba(78,205,196,.12)"; border = `2px solid rgba(78,205,196,.5)`;  color = "#4ECDC4"; cursor = "default"; }
            else if (occupant) { bg = "rgba(255,255,255,.03)"; border = "2px solid rgba(255,255,255,.06)"; color = "rgba(255,255,255,.18)"; cursor = "not-allowed"; }
            else if (isSel)  { bg = `${bColor(sn)}33`; border = `2px solid ${bColor(sn)}`;            color = bColor(sn); cursor = "pointer"; }
            else if (cantAfford) { bg = "rgba(255,255,255,.02)"; border = "2px solid rgba(255,255,255,.04)"; color = "rgba(255,255,255,.15)"; cursor = "not-allowed"; }
            else { bg = isHov ? `${bColor(sn)}22` : `${bColor(sn)}10`; border = `2px solid ${isHov ? `${bColor(sn)}88` : `${bColor(sn)}35`}`; color = bColor(sn); cursor = "pointer"; }
            return (
              <button key={sn} onClick={() => toggleSlot(sn)} onMouseEnter={() => setHovered(sn)} onMouseLeave={() => setHovered(null)}
                style={{ aspectRatio: "1", borderRadius: "50%", background: bg, border, color, cursor, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, transition: "all .15s", transform: (isSel || (isHov && isFree && !cantAfford)) ? "scale(1.1)" : "scale(1)", position: "relative" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{sn}</span>
                {isMyExist  && <span style={{ fontSize: 8 }}>✓mío</span>}
                {occupant && !isMyExist && <span style={{ fontSize: 12 }}>{occupant.avatar}</span>}
                {isSel && <div style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#000" }}>✓</div>}
              </button>
            );
          })}
        </div>
 
        {/* Summary */}
        <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 10, background: selected.size > 0 ? "rgba(201,168,76,.06)" : "rgba(255,255,255,.02)", border: `1px solid ${selected.size > 0 ? "rgba(201,168,76,.2)" : "rgba(255,255,255,.06)"}`, transition: "all .2s" }}>
          {selected.size === 0 ? (
            <p style={{ color: "rgba(255,255,255,.2)", fontSize: 12, textAlign: "center", margin: 0 }}>No seleccionaste ningún slot todavía</p>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ color: "rgba(255,255,255,.35)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Slots elegidos</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                  {[...selected].sort((a, b) => a - b).map(sn => (
                    <span key={sn} style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: `${bColor(sn)}22`, border: `1px solid ${bColor(sn)}55`, color: bColor(sn) }}>#{sn}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "rgba(255,255,255,.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Total</div>
                <div style={{ color: YELLOW, fontWeight: 700, fontSize: 18 }}>{totalCost.toLocaleString()} cr.</div>
              </div>
            </div>
          )}
        </div>
 
        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, color: "rgba(255,255,255,.4)", fontSize: 13, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif" }}>Cancelar</button>
          <button disabled={selected.size === 0} onClick={() => selected.size > 0 && onConfirm([...selected])} style={{ flex: 2, padding: "11px", background: selected.size > 0 ? `linear-gradient(135deg,${YELLOW2},${YELLOW})` : "rgba(255,255,255,.06)", border: "none", borderRadius: 10, color: selected.size > 0 ? "#000" : "rgba(255,255,255,.2)", fontSize: 13, fontWeight: 700, cursor: selected.size > 0 ? "pointer" : "not-allowed", fontFamily: "'Cinzel',serif", letterSpacing: .5, textTransform: "uppercase", transition: "all .2s" }}>
            {selected.size === 0 ? "Seleccioná al menos un slot" : `Confirmar ${selected.size} slot${selected.size > 1 ? "s" : ""} · ${totalCost.toLocaleString()} cr.`}
          </button>
        </div>
      </div>
    </div>
  );
}
 
// ─── CortitosView ─────────────────────────────────────────────────────────────
export function CortitosView({ currentUser, db, updateDB, onBack, onLogout, onProfile, onLobby, onHowItWorks, onCortitos, onPlanillas, onSupervisor }) {
  const cortitos = db.cortitos || CORTITOS_INIT;
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId]     = useState(cortitos[0]?.id || null);
  const [joinTarget, setJoinTarget]     = useState(null);
  const [mobileScreen, setMobileScreen] = useState("list");
 
  const handleConfirmJoin = (slotNumbers) => {
    if (!joinTarget || !slotNumbers?.length) return;
    updateDB(prev => {
      const cortito = prev.cortitos.find(c => c.id === joinTarget.id);
      if (!cortito) return prev;
      const validSlots = slotNumbers.filter(sn => !cortito.players.some(p => p.slotNumber === sn));
      if (!validSlots.length) return prev;
      const totalCost = validSlots.length * cortito.costPerSlot;
      const user = prev.users.find(u => u.id === currentUser.id);
      if (!user || user.credits < totalCost) return prev;
      return {
        ...prev,
        users: prev.users.map(u => u.id === currentUser.id ? { ...u, credits: u.credits - totalCost } : u),
        cortitos: prev.cortitos.map(c => c.id === cortito.id
          ? { ...c, players: [...c.players, ...validSlots.map(sn => ({ userId: currentUser.id, userName: currentUser.name, avatar: currentUser.avatar, slotNumber: sn }))] }
          : c),
      };
    });
    setJoinTarget(null);
  };
 
  const activeCortito = cortitos.find(c => c.id === selectedId) || cortitos[0];
  const hp = { currentUser, onLogout, onProfile, onLobby, onHowItWorks, onCortitos: onCortitos || (() => {}), onPlanillas: onPlanillas || (() => {}), onSupervisor };
 
  const heroSection = (
    <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0d0b1e 0%,#1a0a3e 40%,#2d1200 100%)", padding: isMobile ? "22px 16px 24px" : "32px 40px 36px", marginBottom: 0 }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "50%", height: "160%", background: "radial-gradient(ellipse,rgba(249,115,22,.12),transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: .015, backgroundImage: "linear-gradient(rgba(249,115,22,1) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: OR }} />
          <span style={{ color: OR, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Juego en vivo</span>
        </div>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: isMobile ? 24 : 38, fontWeight: 900, color: "#fff", marginBottom: 6, lineHeight: 1.1 }}>
          ⚡ <span style={{ background: `linear-gradient(135deg,${OR},${YELLOW})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Cortitos</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: isMobile ? 13 : 15 }}>
          Completá casilleros y ganá el pozo · Arranca automático cuando se llena
        </p>
      </div>
    </div>
  );
 
  if (isMobile) {
    if (mobileScreen === "list") return (
      <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "'Barlow Condensed',sans-serif" }}>
        <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
        <Header {...hp} />
        {joinTarget && <SlotModal cortito={joinTarget} currentUser={currentUser} onConfirm={handleConfirmJoin} onClose={() => setJoinTarget(null)} />}
        {heroSection}
        <main style={{ padding: "16px 12px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button onClick={onBack} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "7px 14px", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 13 }}>← Volver</button>
            <span style={{ color: "rgba(255,255,255,.3)", fontSize: 13 }}>Tocá una planilla para jugar</span>
          </div>
          {cortitos.map(c => (
            <PlanillaCard key={c.id} cortito={c} currentUser={currentUser} onJoinClick={() => setJoinTarget(c)} isSelected={false} onSelect={id => { setSelectedId(id); setMobileScreen("detail"); }} />
          ))}
        </main>
      </div>
    );
 
    return (
      <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "'Barlow Condensed',sans-serif" }}>
        <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
        <Header {...hp} />
        {joinTarget && <SlotModal cortito={joinTarget} currentUser={currentUser} onConfirm={handleConfirmJoin} onClose={() => setJoinTarget(null)} />}
        <main style={{ padding: "12px 12px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <button onClick={() => setMobileScreen("list")} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "7px 14px", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>← Cortitos</button>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'Cinzel',serif" }}>{activeCortito?.name}</div>
              <div style={{ color: "rgba(255,255,255,.3)", fontSize: 11 }}>{activeCortito?.description}</div>
            </div>
          </div>
          <PlanillaCard cortito={activeCortito} currentUser={currentUser} onJoinClick={() => setJoinTarget(activeCortito)} isSelected={true} onSelect={() => {}} />
          <div style={{ marginTop: 14 }}>
            <BolilleroPanel cortito={activeCortito} />
          </div>
        </main>
      </div>
    );
  }
 
  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "'Barlow Condensed',sans-serif" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
      <Header {...hp} />
      {joinTarget && <SlotModal cortito={joinTarget} currentUser={currentUser} onConfirm={handleConfirmJoin} onClose={() => setJoinTarget(null)} />}
      {heroSection}
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 22px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "7px 16px", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 13 }}>← Volver</button>
          <span style={{ color: "rgba(255,255,255,.25)", fontSize: 13 }}>Seleccioná una planilla · Hacé click en "Unirme" para participar</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 24, alignItems: "start" }}>
          <div>
            {cortitos.map(c => (
              <PlanillaCard key={c.id} cortito={c} currentUser={currentUser} onJoinClick={() => setJoinTarget(c)} isSelected={selectedId === c.id} onSelect={setSelectedId} />
            ))}
          </div>
          <div style={{ position: "sticky", top: 80 }}>
            <BolilleroPanel cortito={activeCortito} />
          </div>
        </div>
      </main>
    </div>
  );
}
 