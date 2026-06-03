import React, { useState, useEffect } from "react";
import { Header } from "../common/Header";
import { COLORS, FRAC_COLORS } from "../../utils/constants";
 
const { YELLOW, BG } = COLORS;
const TEAL = "#4ECDC4";
 
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}
 
const StatusBadge = ({ status, won }) => {
  if (won) return <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, fontWeight:700, background:"rgba(255,215,0,.12)", border:"1px solid rgba(255,215,0,.4)", color:YELLOW }}>🏆 Ganaste</span>;
  if (status === "finished" || status === "finished") return <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, fontWeight:700, background:"rgba(255,80,80,.08)", border:"1px solid rgba(255,80,80,.3)", color:"#FF6B6B" }}>Sorteada</span>;
  if (status === "open" || status === "active") return <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, fontWeight:700, background:"rgba(78,205,196,.08)", border:"1px solid rgba(78,205,196,.3)", color:TEAL }}>Activa</span>;
  return <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, background:"rgba(255,255,255,.05)", color:"rgba(255,255,255,.3)" }}>{status}</span>;
};
 
export function ProfileView({
  currentUser, rifas, cortitos, planillas, creditRequests,
  onBack, onLogout, onHowItWorks, onRequestCredit, ...headerProps
}) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("rifas");
 
  // ── Rifas ─────────────────────────────────────────────────────────────────
  const myRifas = (rifas || []).flatMap(r => {
    const myNums = Object.entries(r.numbers || {}).filter(([,v]) => v.userId === currentUser.id).map(([n]) => n);
    if (!myNums.length) return [];
    const won = r.winner?.userId === currentUser.id;
    return [{ id:r.id, name:r.name, icon:r.icon, numbers:myNums,
      spent:myNums.length * r.pricePerNumber, status:r.status, won, winner:r.winner }];
  });
 
  // ── Cortitos ──────────────────────────────────────────────────────────────
  const myCortitos = (cortitos || []).flatMap(c => {
    const mySlots = c.players.filter(p => p.userId === currentUser.id);
    if (!mySlots.length) return [];
    const won = c.winner?.player?.userId === currentUser.id;
    return [{ id:c.id, name:c.name, slots:mySlots.map(s=>s.slotNumber),
      spent:mySlots.length * c.costPerSlot, prize:c.costPerSlot * c.totalSlots,
      status:c.status, won }];
  });
 
  // ── Planillas ─────────────────────────────────────────────────────────────
  const myPlanillas = (planillas || []).flatMap(p => {
    const mySlots = Object.values(p.numbers || {}).flat().filter(s => s?.userId === currentUser.id);
    if (!mySlots.length) return [];
    const myNums = [...new Set(Object.entries(p.numbers || {})
      .filter(([,slots]) => slots.some(s => s?.userId === currentUser.id)).map(([n]) => n))];
    const won = p.winner && myNums.includes(String(p.winner.number));
    const wonAmount = won ? mySlots.length * Math.floor(p.prize / 4) : 0;
    const cuartos  = mySlots.filter(s => s?.fraccion==="cuarto").length;
    const medios   = mySlots.filter(s => s?.fraccion==="medio").length;
    const enteros  = mySlots.filter(s => s?.fraccion==="entero").length;
    const spent = cuartos*p.prices?.cuarto + (medios/2)*p.prices?.medio + (enteros/4)*p.prices?.entero;
    return [{ id:p.id, name:p.name, numbers:myNums, quarters:mySlots.length,
      cuartos, medios, enteros, spent: Math.round(spent)||0,
      prize:p.prize, status:p.status, won, wonAmount }];
  });
 
  // ── Créditos ──────────────────────────────────────────────────────────────
  const myRequests = (creditRequests || []).filter(r => r.userId === currentUser.id);
 
  // ── Stats globales ────────────────────────────────────────────────────────
  const totalSpent = myRifas.reduce((s,r)=>s+r.spent,0)
    + myCortitos.reduce((s,c)=>s+c.spent,0)
    + myPlanillas.reduce((s,p)=>s+p.spent,0);
  const totalWins = [...myRifas,...myCortitos,...myPlanillas].filter(x=>x.won).length;
  const totalGames = myRifas.length + myCortitos.length + myPlanillas.length;
 
  const stats = [
    { label:"Partidas jugadas", val:totalGames,                  color:TEAL,              icon:"🎮" },
    { label:"Créditos apostados",val:`${totalSpent.toLocaleString()} cr.`, color:"rgba(255,255,255,.6)", icon:"💰" },
    { label:"Premios ganados",   val:totalWins,                  color:YELLOW,            icon:"🏆" },
    { label:"Saldo actual",      val:`${currentUser.credits.toLocaleString()} cr.`, color:YELLOW, icon:"💎" },
  ];
 
  const tabs = [
    { key:"rifas",    label:`🎫 Rifas`,     count:myRifas.length    },
    { key:"cortitos", label:`⚡ Cortitos`,  count:myCortitos.length },
    { key:"planillas",label:`🎰 Planillas`, count:myPlanillas.length},
    { key:"creditos", label:`📋 Créditos`,  count:myRequests.length },
  ];
 
  const card = { background:"#0d0d1a", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"14px 16px" };
 
  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'Barlow Condensed',sans-serif" }}>
      <Header {...headerProps} currentUser={currentUser} onLogout={onLogout}
        onProfile={() => {}} onHowItWorks={onHowItWorks} />
 
      <main style={{ maxWidth:960, margin:"0 auto", padding: isMobile?"14px 12px 28px":"28px 24px" }}>
 
        {/* Tarjeta perfil */}
        <div style={{ background:"#0d0d1a", border:"1px solid rgba(255,215,0,.18)", borderRadius:16,
          padding: isMobile?"14px 16px":"18px 24px", marginBottom:18,
          display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
          <div style={{ width:54, height:54, borderRadius:"50%", background:"rgba(255,215,0,.08)",
            border:"2px solid rgba(255,215,0,.28)", display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:26, flexShrink:0 }}>
            {currentUser.avatar}
          </div>
          <div style={{ flex:1, minWidth:100 }}>
            <h2 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:17, fontWeight:700, marginBottom:2 }}>
              {currentUser.name}
            </h2>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>ID #{currentUser.id}</span>
              <span style={{ padding:"2px 8px", borderRadius:6, fontSize:10, fontWeight:700, textTransform:"capitalize",
                background: currentUser.role==="admin"?"rgba(78,205,196,.1)":currentUser.role==="supervisor"?"rgba(124,77,255,.1)":"rgba(255,255,255,.05)",
                border:`1px solid ${currentUser.role==="admin"?"rgba(78,205,196,.3)":currentUser.role==="supervisor"?"rgba(124,77,255,.3)":"rgba(255,255,255,.1)"}`,
                color: currentUser.role==="admin"?TEAL:currentUser.role==="supervisor"?"#A07BFF":"rgba(255,255,255,.4)" }}>
                {currentUser.role}
              </span>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"rgba(255,255,255,.3)", fontSize:10, textTransform:"uppercase", letterSpacing:1 }}>Saldo</div>
            <div style={{ color:YELLOW, fontWeight:900, fontSize:22, fontFamily:"'Cinzel',serif" }}>
              {currentUser.credits.toLocaleString()} cr.
            </div>
          </div>
          <button onClick={onRequestCredit} style={{ background:"rgba(78,205,196,.08)",
            border:"1px solid rgba(78,205,196,.25)", color:TEAL, borderRadius:8,
            padding:"9px 16px", cursor:"pointer", fontSize:13,
            fontFamily:"'Barlow Condensed',sans-serif", whiteSpace:"nowrap" }}>
            + Pedir créditos
          </button>
        </div>
 
        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"repeat(4,1fr)", gap:10, marginBottom:20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ ...card, textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
              <div style={{ color:s.color, fontWeight:900, fontSize:isMobile?16:18 }}>{s.val}</div>
              <div style={{ color:"rgba(255,255,255,.3)", fontSize:10, textTransform:"uppercase", letterSpacing:.5, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
 
        {/* Tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:18, overflowX:"auto", paddingBottom:2 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding:"7px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
              whiteSpace:"nowrap", fontFamily:"'Barlow Condensed',sans-serif",
              background: tab===t.key ? "rgba(255,215,0,.1)" : "transparent",
              border:`1px solid ${tab===t.key ? YELLOW : "rgba(255,255,255,.1)"}`,
              color: tab===t.key ? YELLOW : "rgba(255,255,255,.38)",
            }}>
              {t.label} {t.count>0&&<span style={{ background:"rgba(255,255,255,.1)", borderRadius:10, padding:"0 6px", fontSize:10, marginLeft:4 }}>{t.count}</span>}
            </button>
          ))}
        </div>
 
        {/* ── TAB Rifas ── */}
        {tab==="rifas" && (
          myRifas.length === 0
            ? <Empty msg="No participaste en ninguna rifa todavía." />
            : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {myRifas.map(j => (
                  <div key={j.id} style={{ ...card, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                    <span style={{ fontSize:24 }}>{j.icon}</span>
                    <div style={{ flex:1, minWidth:120 }}>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{j.name}</div>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:4 }}>
                        {[...j.numbers].sort().slice(0,10).map(n => (
                          <span key={n} style={{ background:"rgba(255,215,0,.08)", border:"1px solid rgba(255,215,0,.2)", borderRadius:4, padding:"1px 6px", color:YELLOW, fontSize:11 }}>{n}</span>
                        ))}
                        {j.numbers.length>10&&<span style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>+{j.numbers.length-10} más</span>}
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:"rgba(255,255,255,.4)", fontSize:11 }}>{j.spent} cr. apostados</div>
                      <div style={{ marginTop:4 }}><StatusBadge status={j.status} won={j.won}/></div>
                    </div>
                  </div>
                ))}
              </div>
        )}
 
        {/* ── TAB Cortitos ── */}
        {tab==="cortitos" && (
          myCortitos.length === 0
            ? <Empty msg="No jugaste ningún cortito todavía." />
            : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {myCortitos.map(c => (
                  <div key={c.id} style={{ ...card, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                    <span style={{ fontSize:24 }}>⚡</span>
                    <div style={{ flex:1, minWidth:120 }}>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{c.name}</div>
                      <div style={{ color:"rgba(255,255,255,.4)", fontSize:12, marginTop:3 }}>
                        Slots: {c.slots.map(s=>`#${s}`).join(", ")} · {c.spent} cr. apostados
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>Pozo: {c.prize.toLocaleString()} cr.</div>
                      <div style={{ marginTop:4 }}><StatusBadge status={c.status} won={c.won}/></div>
                    </div>
                  </div>
                ))}
              </div>
        )}
 
        {/* ── TAB Planillas ── */}
        {tab==="planillas" && (
          myPlanillas.length === 0
            ? <Empty msg="No jugaste ninguna planilla todavía." />
            : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {myPlanillas.map(p => (
                  <div key={p.id} style={{ ...card, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                    <span style={{ fontSize:24 }}>🎰</span>
                    <div style={{ flex:1, minWidth:120 }}>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{p.name}</div>
                      <div style={{ color:"rgba(255,255,255,.4)", fontSize:12, marginTop:3 }}>
                        Números: {p.numbers.map(n=>`#${n}`).join(", ")}
                      </div>
                      <div style={{ display:"flex", gap:6, marginTop:5 }}>
                        {p.cuartos>0&&<span style={{ padding:"2px 7px", borderRadius:5, fontSize:10, background:"rgba(124,77,255,.12)", color:"#A07BFF", border:"1px solid rgba(124,77,255,.3)" }}>{p.cuartos} cuarto{p.cuartos>1?"s":""}</span>}
                        {p.medios>0&&<span style={{ padding:"2px 7px", borderRadius:5, fontSize:10, background:"rgba(0,200,83,.1)", color:"#00C853", border:"1px solid rgba(0,200,83,.3)" }}>{p.medios/2} medio{p.medios/2>1?"s":""}</span>}
                        {p.enteros>0&&<span style={{ padding:"2px 7px", borderRadius:5, fontSize:10, background:"rgba(201,168,76,.1)", color:"#C9A84C", border:"1px solid rgba(201,168,76,.3)" }}>{p.enteros/4} entero{p.enteros/4>1?"s":""}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      {p.won && <div style={{ color:"#00C853", fontWeight:700, fontSize:13, marginBottom:4 }}>+{p.wonAmount.toLocaleString()} cr.</div>}
                      <StatusBadge status={p.status} won={p.won}/>
                    </div>
                  </div>
                ))}
              </div>
        )}
 
        {/* ── TAB Créditos ── */}
        {tab==="creditos" && (
          myRequests.length === 0
            ? <Empty msg="No hiciste solicitudes de crédito todavía." />
            : <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[...myRequests].reverse().map(req => (
                  <div key={req.id} style={{ ...card, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"rgba(255,255,255,.5)", fontSize:12 }}>{req.date}</div>
                      {req.note && <div style={{ color:"rgba(255,255,255,.3)", fontSize:11, marginTop:2 }}>{req.note}</div>}
                    </div>
                    <span style={{ color:YELLOW, fontWeight:700, fontSize:16 }}>{req.amount} cr.</span>
                    <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, fontWeight:700,
                      background: req.status==="pending"?"rgba(255,140,0,.1)":req.status==="approved"?"rgba(0,200,83,.1)":"rgba(255,50,50,.08)",
                      border:`1px solid ${req.status==="pending"?"rgba(255,140,0,.3)":req.status==="approved"?"rgba(0,200,83,.3)":"rgba(255,50,50,.25)"}`,
                      color: req.status==="pending"?"#FF8C00":req.status==="approved"?"#00C853":"#FF6464" }}>
                      {req.status==="pending"?"⏳ Pendiente":req.status==="approved"?"✓ Aprobada":"✗ Rechazada"}
                    </span>
                  </div>
                ))}
              </div>
        )}
      </main>
    </div>
  );
}
 
function Empty({ msg }) {
  return (
    <div style={{ textAlign:"center", padding:"48px 20px", color:"rgba(255,255,255,.2)", fontSize:14,
      background:"rgba(255,255,255,.01)", borderRadius:12, border:"1px solid rgba(255,255,255,.05)" }}>
      <div style={{ fontSize:36, marginBottom:10 }}>🎲</div>
      {msg}
    </div>
  );
}
 