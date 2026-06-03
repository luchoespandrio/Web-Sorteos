import React, { useState, useEffect } from "react";
import { Header } from "../common/Header";
import { COLORS, FRAC_COLORS } from "../../utils/constants";
 
const { YELLOW, YELLOW2, BG } = COLORS;
const PURPLE  = "#7C4DFF";
const PURPLE_L = "#A07BFF";
 
const fmtCr = n => Number(n).toLocaleString("es-AR");
 
// ─── Hook mobile ─────────────────────────────────────────────────────────────
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}
 
// ─── Helpers ─────────────────────────────────────────────────────────────────
const FRAC_SIZE = { cuarto: 1, medio: 2, entero: 4 };
 
function getSlots(planilla, num) {
  return planilla.numbers?.[String(num)] || [null, null, null, null];
}
 
function freeQuarters(slots) { return slots.filter(s => s === null).length; }
 
function firstFreeIndex(slots, fraccion) {
  const size = FRAC_SIZE[fraccion];
  for (let i = 0; i <= 4 - size; i++) {
    if (slots.slice(i, i + size).every(s => s === null)) return i;
  }
  return -1;
}
 
function prizePerQuarter(planilla) { return Math.floor(planilla.prize / 4); }
 
// ─── Celda número ────────────────────────────────────────────────────────────
function NumberCell({ planilla, num, selected, onSelect, currentUser, isMobile }) {
  const slots    = getSlots(planilla, num);
  const free     = freeQuarters(slots);
  const isWinner = planilla.winner?.number === num;
  const isSelected = selected === num;
  const isFull   = free === 0;
  const isMe     = slots.some(s => s?.userId === currentUser.id);
  const canClick = !isFull && planilla.status === "open";
 
  const quarters = slots.map((slot, i) => (
    <div key={i} style={{
      background: slot ? `${FRAC_COLORS[slot.fraccion]}25` : "rgba(255,255,255,.04)",
      border: `1px solid ${slot ? `${FRAC_COLORS[slot.fraccion]}55` : "rgba(255,255,255,.08)"}`,
      borderRadius: 3,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: isMobile ? 8 : 9,
      color: slot ? FRAC_COLORS[slot.fraccion] : "transparent",
      fontWeight: 700, overflow: "hidden",
    }}>
      {slot ? (slot.userId === currentUser.id ? "✓" : slot.avatar?.slice(0, 1)) : ""}
    </div>
  ));
 
  return (
    <div
      onClick={() => canClick && onSelect(num)}
      style={{
        background: isWinner ? `${YELLOW}18` : isSelected ? `${PURPLE}22` : isFull ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.04)",
        border: `2px solid ${isWinner ? YELLOW : isSelected ? PURPLE : isMe ? "rgba(78,205,196,.4)" : isFull ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.1)"}`,
        borderRadius: 10,
        padding: isMobile ? "5px 4px 3px" : "6px 6px 4px",
        cursor: canClick ? "pointer" : "default",
        transition: "all .15s",
        position: "relative",
        userSelect: "none",
      }}
    >
      <div style={{ fontFamily:"'Cinzel',serif", fontWeight:900, fontSize: isMobile ? 12 : 13,
        color: isWinner ? YELLOW : isSelected ? PURPLE_L : "#fff",
        textAlign:"center", marginBottom: isMobile ? 3 : 4, lineHeight:1 }}>
        {num}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, height: isMobile ? 32 : 40 }}>
        {quarters}
      </div>
      <div style={{ textAlign:"center", fontSize: isMobile ? 8 : 9, marginTop: isMobile ? 2 : 4, fontWeight:600,
        color: isFull ? "rgba(255,255,255,.2)" : isMe ? "#4ECDC4" : "rgba(255,255,255,.25)" }}>
        {isFull ? "Lleno" : `${free}/4`}
      </div>
      {isWinner && (
        <div style={{ position:"absolute", inset:0, borderRadius:8, background:"rgba(255,215,0,.05)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👑</div>
      )}
    </div>
  );
}
 
// ─── Panel compra — MOBILE: bottom sheet | DESKTOP: sidebar ──────────────────
function BuyPanel({ planilla, selectedNum, currentUser, onBuy, onClose, isMobile }) {
  const [fraccion, setFraccion] = useState("cuarto");
 
  if (!planilla || selectedNum === null) return null;
 
  const slots   = getSlots(planilla, selectedNum);
  const cost    = planilla.prices[fraccion];
  const canFit  = firstFreeIndex(slots, fraccion) !== -1;
  const canPay  = currentUser.credits >= cost;
  const prizeQ  = prizePerQuarter(planilla);
 
  // En mobile → bottom sheet fijo
  if (isMobile) return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.6)", backdropFilter:"blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ position:"absolute", bottom:0, left:0, right:0,
        background:"#0d0d1a", borderTop:`2px solid ${PURPLE}55`,
        borderRadius:"20px 20px 0 0", padding:"20px 16px 32px", maxHeight:"80vh", overflowY:"auto" }}>
 
        {/* Handle */}
        <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,.15)", margin:"0 auto 16px" }}/>
 
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ color:"rgba(255,255,255,.4)", fontSize:10, textTransform:"uppercase", letterSpacing:1 }}>Número seleccionado</div>
            <div style={{ color:"#fff", fontWeight:900, fontSize:22, fontFamily:"'Cinzel',serif" }}>{selectedNum}</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", borderRadius:8, padding:"6px 14px", color:"rgba(255,255,255,.5)", cursor:"pointer", fontSize:14 }}>✕</button>
        </div>
 
        {/* Selector fracción */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
          {["cuarto","medio","entero"].map(k => {
            const fits   = firstFreeIndex(slots, k) !== -1;
            const active = fraccion === k;
            const col    = FRAC_COLORS[k];
            return (
              <button key={k} disabled={!fits} onClick={() => fits && setFraccion(k)} style={{
                padding:"12px 8px", borderRadius:12, cursor: fits?"pointer":"not-allowed",
                background: active ? `${col}22` : fits ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.01)",
                border:`2px solid ${active ? col : fits ? `${col}44` : "rgba(255,255,255,.05)"}`,
                color: active ? col : fits ? `${col}88` : "rgba(255,255,255,.15)",
              }}>
                <div style={{ fontSize:12, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", textTransform:"capitalize" }}>{k}</div>
                <div style={{ fontSize:16, fontWeight:900, marginTop:2 }}>{planilla.prices[k]} cr.</div>
              </button>
            );
          })}
        </div>
 
        {/* Resumen */}
        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
          {[
            { label:"Premio si ganás", value:`${fmtCr(prizeQ * FRAC_SIZE[fraccion])} cr.`, color:"#00C853", big:true },
            { label:"Costo",           value:`${cost} cr.`,                                  color:YELLOW },
            { label:"Tu saldo",        value:`${fmtCr(currentUser.credits)} cr.`,           color:"rgba(255,255,255,.45)" },
          ].map(r => (
            <div key={r.label} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:"rgba(255,255,255,.35)", fontSize:13 }}>{r.label}</span>
              <span style={{ color:r.color, fontSize: r.big ? 16 : 13, fontWeight:700 }}>{r.value}</span>
            </div>
          ))}
        </div>
 
        {/* Mini slots visual */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:16 }}>
          {slots.map((s,i) => (
            <div key={i} style={{ height:28, borderRadius:6,
              background: s ? `${FRAC_COLORS[s.fraccion]}25` : "rgba(255,255,255,.04)",
              border:`1px solid ${s ? `${FRAC_COLORS[s.fraccion]}55` : "rgba(255,255,255,.1)"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, color: s ? FRAC_COLORS[s.fraccion] : "rgba(255,255,255,.2)" }}>
              {s ? (s.userId === currentUser.id ? "✓" : s.avatar) : "○"}
            </div>
          ))}
        </div>
 
        {/* Botón */}
        {!canFit ? (
          <div style={{ textAlign:"center", padding:"14px", borderRadius:10, background:"rgba(255,255,255,.03)", color:"rgba(255,255,255,.25)", fontSize:13 }}>
            No hay espacio para {fraccion}
          </div>
        ) : !canPay ? (
          <div style={{ textAlign:"center", padding:"14px", borderRadius:10, background:"rgba(255,50,50,.06)", border:"1px solid rgba(255,50,50,.2)", color:"#FF6464", fontSize:14 }}>
            ⚠ Créditos insuficientes
          </div>
        ) : (
          <button onClick={() => onBuy(selectedNum, fraccion)} style={{
            width:"100%", padding:"15px",
            background:`linear-gradient(135deg,${PURPLE},${PURPLE_L})`,
            border:"none", borderRadius:12, color:"#fff",
            fontSize:16, fontWeight:700, cursor:"pointer",
            fontFamily:"'Cinzel',serif", letterSpacing:.5, textTransform:"uppercase",
          }}>
            Confirmar · {cost} cr.
          </button>
        )}
      </div>
    </div>
  );
 
  // Desktop → sidebar
  return (
    <div style={{ background:"#0d0d1a", border:`1px solid ${PURPLE}44`, borderRadius:14, padding:"20px", position:"sticky", top:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <div style={{ color:"rgba(255,255,255,.3)", fontSize:10, textTransform:"uppercase", letterSpacing:1 }}>Número</div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:18, fontFamily:"'Cinzel',serif" }}>{selectedNum}</div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:6, padding:"4px 10px", color:"rgba(255,255,255,.4)", cursor:"pointer", fontSize:12 }}>✕</button>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["cuarto","medio","entero"].map(k => {
          const fits   = firstFreeIndex(slots, k) !== -1;
          const active = fraccion === k;
          const col    = FRAC_COLORS[k];
          return (
            <button key={k} disabled={!fits} onClick={() => fits && setFraccion(k)} style={{
              flex:1, padding:"10px 4px", borderRadius:10, cursor:fits?"pointer":"not-allowed",
              background: active?`${col}22`:fits?"rgba(255,255,255,.03)":"rgba(255,255,255,.01)",
              border:`2px solid ${active?col:fits?`${col}44`:"rgba(255,255,255,.05)"}`,
              color: active?col:fits?`${col}99`:"rgba(255,255,255,.15)",
            }}>
              <div style={{ fontSize:11, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif" }}>{k.charAt(0).toUpperCase()+k.slice(1)}</div>
              <div style={{ fontSize:13, fontWeight:900, marginTop:2 }}>{planilla.prices[k]} cr.</div>
            </button>
          );
        })}
      </div>
      <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
        {[
          { label:"Fracción",  value: fraccion.charAt(0).toUpperCase()+fraccion.slice(1), color:FRAC_COLORS[fraccion] },
          { label:"Costo",     value:`${planilla.prices[fraccion]} cr.`, color:YELLOW },
          { label:"Tu saldo",  value:`${fmtCr(currentUser.credits)} cr.`, color:"rgba(255,255,255,.45)" },
        ].map(r => (
          <div key={r.label} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>{r.label}</span>
            <span style={{ color:r.color, fontSize:13, fontWeight:700 }}>{r.value}</span>
          </div>
        ))}
        <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:6, marginTop:4, display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>Premio si ganás</span>
          <span style={{ color:"#00C853", fontSize:14, fontWeight:900 }}>{fmtCr(prizeQ*FRAC_SIZE[fraccion])} cr.</span>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4, marginBottom:14 }}>
        {slots.map((s,i) => (
          <div key={i} style={{ height:24, borderRadius:5, background:s?`${FRAC_COLORS[s.fraccion]}25`:"rgba(255,255,255,.04)", border:`1px solid ${s?`${FRAC_COLORS[s.fraccion]}55`:"rgba(255,255,255,.08)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:s?FRAC_COLORS[s.fraccion]:"rgba(255,255,255,.2)" }}>
            {s?(s.userId===currentUser.id?"✓":s.avatar):"○"}
          </div>
        ))}
      </div>
      {!canFit ? (
        <div style={{ textAlign:"center", padding:"11px", borderRadius:9, background:"rgba(255,255,255,.03)", color:"rgba(255,255,255,.25)", fontSize:13 }}>Sin espacio para {fraccion}</div>
      ) : !canPay ? (
        <div style={{ textAlign:"center", padding:"11px", borderRadius:9, background:"rgba(255,50,50,.06)", border:"1px solid rgba(255,50,50,.2)", color:"#FF6464", fontSize:13 }}>⚠ Créditos insuficientes</div>
      ) : (
        <button onClick={() => onBuy(selectedNum, fraccion)} style={{ width:"100%", padding:"12px", background:`linear-gradient(135deg,${PURPLE},${PURPLE_L})`, border:"none", borderRadius:9, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Cinzel',serif", letterSpacing:.5, textTransform:"uppercase" }}>
          Confirmar · {cost} cr.
        </button>
      )}
    </div>
  );
}
 
// ─── Card planilla ────────────────────────────────────────────────────────────
function PlanillaCard({ planilla, currentUser, onSelect, isActive, isMobile }) {
  const totalSlots = planilla.totalNumbers * 4;
  const usedSlots  = Object.values(planilla.numbers || {}).flat().filter(Boolean).length;
  const pct        = Math.round((usedSlots / totalSlots) * 100);
  const myCount    = Object.values(planilla.numbers || {}).flat().filter(s => s?.userId === currentUser.id).length;
  const statusColor = planilla.status==="finished"?"#00C853":planilla.status==="running"?YELLOW:PURPLE_L;
  const statusLabel = planilla.status==="finished"?"Sorteada":planilla.status==="running"?"Sorteando…":"Abierta";
 
  return (
    <div onClick={() => planilla.status !== "running" && onSelect(planilla.id)}
      style={{ background: isActive ? `${PURPLE}18` : "#0d0d1a",
        border:`2px solid ${isActive?PURPLE:planilla.status==="finished"?"rgba(0,200,83,.2)":"rgba(255,255,255,.08)"}`,
        borderRadius:14, padding:"16px", cursor:planilla.status!=="running"?"pointer":"default", transition:"all .15s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontWeight:700, fontSize:isMobile?14:15 }}>{planilla.name}</div>
          <div style={{ color:"rgba(255,255,255,.35)", fontSize:12, marginTop:2 }}>⭐ {planilla.subtitle}</div>
        </div>
        <span style={{ padding:"3px 10px", borderRadius:8, fontSize:10, fontWeight:700, whiteSpace:"nowrap", background:`${statusColor}18`, border:`1px solid ${statusColor}44`, color:statusColor }}>{statusLabel}</span>
      </div>
      <div style={{ background:`${YELLOW}11`, border:`1px solid ${YELLOW}33`, borderRadius:9, padding:"8px 12px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ color:"rgba(255,255,255,.4)", fontSize:11 }}>Premio</span>
        <span style={{ color:YELLOW, fontWeight:900, fontSize:isMobile?17:18, fontFamily:"'Cinzel',serif" }}>{fmtCr(planilla.prize)} cr.</span>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:10 }}>
        {["cuarto","medio","entero"].map(k => (
          <div key={k} style={{ flex:1, textAlign:"center", padding:"5px 4px", borderRadius:7, background:`${FRAC_COLORS[k]}11`, border:`1px solid ${FRAC_COLORS[k]}33` }}>
            <div style={{ color:FRAC_COLORS[k], fontSize:9, textTransform:"uppercase" }}>{k}</div>
            <div style={{ color:FRAC_COLORS[k], fontSize:isMobile?11:12, fontWeight:700 }}>{planilla.prices[k]} cr.</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>{usedSlots}/{totalSlots} cuartos</span>
          <span style={{ color:PURPLE_L, fontSize:11, fontWeight:700 }}>{pct}%</span>
        </div>
        <div style={{ height:4, background:"rgba(255,255,255,.06)", borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${PURPLE},${PURPLE_L})`, borderRadius:2 }}/>
        </div>
      </div>
      {myCount > 0 && (
        <div style={{ marginTop:8, padding:"5px 10px", borderRadius:7, background:"rgba(78,205,196,.06)", border:"1px solid rgba(78,205,196,.2)", color:"#4ECDC4", fontSize:11, fontWeight:600 }}>
          ✓ Tenés {myCount} cuarto{myCount>1?"s":""}
        </div>
      )}
    </div>
  );
}
 
// ─── Banner ganador ───────────────────────────────────────────────────────────
function WinnerBanner({ planilla, isMobile }) {
  if (!planilla.winner) return null;
  const { number, slots } = planilla.winner;
  const winners = (slots || []).filter(Boolean);
  const prizeQ  = prizePerQuarter(planilla);
  return (
    <div style={{ background:`linear-gradient(135deg,${YELLOW2}18,${YELLOW}08)`, border:`2px solid ${YELLOW}55`, borderRadius:14, padding:isMobile?"14px":"20px", textAlign:"center", marginBottom:16 }}>
      <div style={{ fontSize:32, marginBottom:4 }}>🏆</div>
      <div style={{ fontFamily:"'Cinzel',serif", color:YELLOW, fontSize:isMobile?16:20, fontWeight:900 }}>¡Salió el Número {number}!</div>
      <div style={{ color:"rgba(255,255,255,.5)", fontSize:13, margin:"4px 0 12px" }}>Premio: <strong style={{ color:YELLOW }}>{fmtCr(planilla.prize)} cr.</strong></div>
      <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
        {winners.map((w,i) => (
          <div key={i} style={{ background:`${FRAC_COLORS[w.fraccion]}22`, border:`1px solid ${FRAC_COLORS[w.fraccion]}55`, borderRadius:10, padding:"8px 12px" }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{w.avatar} {w.userName}</div>
            <div style={{ color:FRAC_COLORS[w.fraccion], fontSize:11 }}>{w.fraccion} · +{fmtCr(prizeQ*FRAC_SIZE[w.fraccion])} cr.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
// ─── Vista principal ──────────────────────────────────────────────────────────
export function PlanillasView({ currentUser, db, updateDB, onBack, ...headerProps }) {
  const isMobile = useIsMobile();
  const [activePlanillaId, setActivePlanillaId] = useState(null);
  const [selectedNum, setSelectedNum]           = useState(null);
  // En mobile: "list" | "detail"
  const [mobileScreen, setMobileScreen]         = useState("list");
 
  const planillas      = db.planillas || [];
  const activePlanilla = activePlanillaId != null ? planillas.find(p => p.id === activePlanillaId) : null;
 
  // Seleccionar primera planilla abierta por defecto en desktop
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
      const slots = [...(p.numbers?.[String(num)] || [null,null,null,null])];
      const idx = firstFreeIndex(slots, fraccion);
      if (idx === -1) return prev;
      const slot = { userId:currentUser.id, userName:currentUser.name, avatar:currentUser.avatar, fraccion };
      for (let i = idx; i < idx + size; i++) slots[i] = slot;
      return {
        ...prev,
        users: prev.users.map(u => u.id===currentUser.id?{...u,credits:u.credits-cost}:u),
        planillas: prev.planillas.map(x => x.id===p.id?{...x,numbers:{...p.numbers,[String(num)]:slots}}:x),
      };
    });
    setSelectedNum(null);
  };
 
  // Cols del grid según ancho de pantalla
  const gridCols = isMobile
    ? `repeat(${activePlanilla?.totalNumbers <= 9 ? 3 : 4}, 1fr)`
    : "repeat(4, 1fr)";
 
  // ── MOBILE LAYOUT ─────────────────────────────────────────────────────────
  if (isMobile) {
    // Pantalla lista de planillas
    if (mobileScreen === "list") return (
      <div style={{ minHeight:"100vh", background:BG, fontFamily:"'Barlow Condensed',sans-serif" }}>
        <Header {...headerProps} currentUser={currentUser} />
        <main style={{ padding:"16px 12px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <button onClick={onBack} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"7px 14px", color:"rgba(255,255,255,.5)", cursor:"pointer", fontSize:13, whiteSpace:"nowrap" }}>← Volver</button>
            <div>
              <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:20, fontWeight:900, color:"#fff", margin:0 }}>🎰 Planillas</h1>
              <p style={{ color:"rgba(255,255,255,.3)", fontSize:12, margin:"2px 0 0" }}>Tocá una para jugar</p>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {planillas.map(p => (
              <PlanillaCard key={p.id} planilla={p} currentUser={currentUser}
                onSelect={handleSelectPlanilla} isActive={false} isMobile={true} />
            ))}
          </div>
        </main>
      </div>
    );
 
    // Pantalla detalle (mobile)
    return (
      <div style={{ minHeight:"100vh", background:BG, fontFamily:"'Barlow Condensed',sans-serif", paddingBottom: selectedNum !== null ? 0 : 24 }}>
        <Header {...headerProps} currentUser={currentUser} />
 
        {/* Bottom sheet de compra */}
        {selectedNum !== null && activePlanilla?.status === "open" && (
          <BuyPanel planilla={activePlanilla} selectedNum={selectedNum} currentUser={currentUser}
            onBuy={handleBuy} onClose={() => setSelectedNum(null)} isMobile={true} />
        )}
 
        <main style={{ padding:"12px 12px 24px" }}>
          {/* Cabecera detalle mobile */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <button onClick={() => { setMobileScreen("list"); setSelectedNum(null); }}
              style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"7px 14px", color:"rgba(255,255,255,.5)", cursor:"pointer", fontSize:13, whiteSpace:"nowrap" }}>
              ← Planillas
            </button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontWeight:700, fontSize:16, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {activePlanilla?.name}
              </div>
              <div style={{ color:"rgba(255,255,255,.35)", fontSize:11 }}>{activePlanilla?.subtitle}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ color:"rgba(255,255,255,.3)", fontSize:9, textTransform:"uppercase" }}>Premio</div>
              <div style={{ color:YELLOW, fontWeight:900, fontSize:16, fontFamily:"'Cinzel',serif", lineHeight:1 }}>{fmtCr(activePlanilla?.prize)} cr.</div>
            </div>
          </div>
 
          {/* Banner ganador */}
          {activePlanilla?.winner && <WinnerBanner planilla={activePlanilla} isMobile={true} />}
 
          {/* Precios */}
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            {["cuarto","medio","entero"].map(k => (
              <div key={k} style={{ flex:1, textAlign:"center", padding:"6px 4px", borderRadius:8, background:`${FRAC_COLORS[k]}11`, border:`1px solid ${FRAC_COLORS[k]}33` }}>
                <div style={{ color:FRAC_COLORS[k], fontSize:9, textTransform:"uppercase", letterSpacing:.5 }}>{k}</div>
                <div style={{ color:FRAC_COLORS[k], fontSize:13, fontWeight:700 }}>{activePlanilla?.prices[k]} cr.</div>
              </div>
            ))}
          </div>
 
          {/* Instrucción */}
          {activePlanilla?.status === "open" && !selectedNum && (
            <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", borderRadius:8, padding:"10px 12px", marginBottom:12, color:"rgba(255,255,255,.3)", fontSize:12, textAlign:"center" }}>
              👆 Tocá un número para elegir tu fracción
            </div>
          )}
 
          {/* Grid de números */}
          {activePlanilla && (
            <div style={{ display:"grid", gridTemplateColumns:gridCols, gap:8 }}>
              {Array.from({ length: activePlanilla.totalNumbers }, (_, i) => i + 1).map(num => (
                <NumberCell key={num} planilla={activePlanilla} num={num} selected={selectedNum}
                  onSelect={setSelectedNum} currentUser={currentUser} isMobile={true} />
              ))}
            </div>
          )}
 
          {/* Leyenda */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:16, justifyContent:"center" }}>
            {[
              { col:FRAC_COLORS.cuarto, label:"Cuarto 1/4" },
              { col:FRAC_COLORS.medio,  label:"Medio 2/4"  },
              { col:FRAC_COLORS.entero, label:"Entero 4/4" },
              { col:"rgba(255,255,255,.15)", label:"Libre"  },
            ].map(({ col, label }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:col }}/>
                <span style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>{label}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }
 
  // ── DESKTOP LAYOUT ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'Barlow Condensed',sans-serif" }}>
      <Header {...headerProps} currentUser={currentUser} />
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"7px 14px", color:"rgba(255,255,255,.5)", cursor:"pointer", fontSize:13 }}>← Volver</button>
          <div>
            <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:24, fontWeight:900, color:"#fff", margin:0 }}>🎰 Planillas</h1>
            <p style={{ color:"rgba(255,255,255,.3)", fontSize:13, margin:"2px 0 0" }}>Elegí tu número · Comprá por cuartos, medios o entero</p>
          </div>
        </div>
 
        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20, alignItems:"start" }}>
          {/* Lista planillas */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ color:"rgba(255,255,255,.3)", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>Planillas disponibles</div>
            {planillas.map(p => (
              <PlanillaCard key={p.id} planilla={p} currentUser={currentUser}
                onSelect={handleSelectPlanilla} isActive={p.id===activePlanillaId} isMobile={false} />
            ))}
          </div>
 
          {/* Detalle */}
          {activePlanilla ? (
            <div>
              {activePlanilla.winner && <WinnerBanner planilla={activePlanilla} isMobile={false} />}
              <div style={{ background:"#0d0d1a", border:`1px solid ${PURPLE}33`, borderRadius:14, padding:"18px 22px", marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:20, fontWeight:900 }}>{activePlanilla.name}</div>
                    <div style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginTop:3 }}>⭐ {activePlanilla.subtitle}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:"rgba(255,255,255,.3)", fontSize:10, textTransform:"uppercase", letterSpacing:1 }}>Premio</div>
                    <div style={{ color:YELLOW, fontWeight:900, fontSize:26, fontFamily:"'Cinzel',serif", lineHeight:1 }}>{fmtCr(activePlanilla.prize)} cr.</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:16, marginTop:14, flexWrap:"wrap" }}>
                  {["cuarto","medio","entero"].map(k => (
                    <div key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:10, height:10, borderRadius:2, background:FRAC_COLORS[k] }}/>
                      <span style={{ color:FRAC_COLORS[k], fontSize:12, fontWeight:700 }}>{k.charAt(0).toUpperCase()+k.slice(1)} {activePlanilla.prices[k]} cr.</span>
                    </div>
                  ))}
                </div>
              </div>
 
              <div style={{ display:"grid", gridTemplateColumns: selectedNum !== null ? "1fr 240px" : "1fr", gap:16, alignItems:"start" }}>
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:gridCols, gap:10 }}>
                    {Array.from({ length:activePlanilla.totalNumbers }, (_,i) => i+1).map(num => (
                      <NumberCell key={num} planilla={activePlanilla} num={num} selected={selectedNum}
                        onSelect={setSelectedNum} currentUser={currentUser} isMobile={false} />
                    ))}
                  </div>
                  {activePlanilla.status==="open" && !selectedNum && (
                    <p style={{ color:"rgba(255,255,255,.25)", fontSize:12, textAlign:"center", marginTop:14, padding:"10px 16px", background:"rgba(255,255,255,.02)", borderRadius:8, border:"1px solid rgba(255,255,255,.05)" }}>
                      💡 Hacé click en un número para elegir tu fracción
                    </p>
                  )}
                  <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:16, justifyContent:"center" }}>
                    {[{col:FRAC_COLORS.cuarto,label:"Cuarto 1/4"},{col:FRAC_COLORS.medio,label:"Medio 2/4"},{col:FRAC_COLORS.entero,label:"Entero 4/4"},{col:"rgba(255,255,255,.15)",label:"Disponible"}].map(({col,label}) => (
                      <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:12, height:12, borderRadius:3, background:col }}/>
                        <span style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedNum !== null && activePlanilla.status==="open" && (
                  <BuyPanel planilla={activePlanilla} selectedNum={selectedNum} currentUser={currentUser}
                    onBuy={handleBuy} onClose={() => setSelectedNum(null)} isMobile={false} />
                )}
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300, color:"rgba(255,255,255,.2)", fontSize:15 }}>
              Seleccioná una planilla para comenzar
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
 