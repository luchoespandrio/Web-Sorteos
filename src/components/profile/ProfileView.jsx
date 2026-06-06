import React, { useState, useEffect } from "react";
import { Header } from "../common/Header";
import { COLORS, FRAC_COLORS } from "../../utils/constants";
 
const { YELLOW, BG } = COLORS;
const V = "#7c3aed"; const VL = "#a855f7";
const OR = "#f97316"; const GR = "#22c55e";
 
function useIsMobile() {
  const [m,setM]=useState(()=>window.innerWidth<768);
  useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  return m;
}
 
function CancelModal({ item, onConfirm, onClose }) {
  if (!item) return null;
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"'Barlow Condensed',sans-serif" }}>
      <div style={{ width:"min(400px,94vw)",background:"#160f35",border:"1px solid rgba(239,68,68,.3)",borderRadius:18,padding:"32px 24px",textAlign:"center" }}>
        <div style={{ fontSize:44,marginBottom:12 }}>🔄</div>
        <h3 style={{ fontFamily:"'Cinzel',serif",color:"#fff",fontSize:18,fontWeight:700,marginBottom:8 }}>¿Cancelar jugada?</h3>
        <p style={{ color:"rgba(255,255,255,.5)",fontSize:14,marginBottom:6 }}>{item.name}</p>
        <div style={{ background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.25)",borderRadius:10,padding:"12px 16px",margin:"16px 0",display:"inline-block" }}>
          <span style={{ color:"rgba(255,255,255,.5)",fontSize:13 }}>Se devolverán </span>
          <span style={{ color:GR,fontWeight:900,fontSize:20 }}>{item.refund.toLocaleString()} cr.</span>
        </div>
        <p style={{ color:"rgba(255,255,255,.3)",fontSize:12,marginBottom:20 }}>Esta acción no se puede deshacer.</p>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={onClose} style={{ flex:1,padding:"11px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14 }}>Mantener</button>
          <button onClick={onConfirm} style={{ flex:2,padding:"11px",background:"linear-gradient(135deg,#ef4444,#dc2626)",border:"none",borderRadius:9,color:"#fff",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:14,fontWeight:700,letterSpacing:.5 }}>Sí, cancelar y recuperar créditos</button>
        </div>
      </div>
    </div>
  );
}
 
export function ProfileView({ currentUser, rifas, cortitos, planillas, creditRequests, onBack, onRequestCredit, onCancelRifa, onCancelCortito, onCancelPlanilla, ...headerProps }) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("rifas");
  const [cancelTarget, setCancelTarget] = useState(null);
 
  // ── Rifas ─────────────────────────────────────────────────────────────────
  const myRifas = (rifas||[]).flatMap(r => {
    const myNums = Object.entries(r.numbers||{}).filter(([,v])=>v.userId===currentUser.id).map(([n])=>n);
    if (!myNums.length) return [];
    const won = r.winner?.userId===currentUser.id;
    return [{ id:r.id, name:r.name, icon:r.icon, numbers:myNums,
      spent:myNums.length*r.pricePerNumber, status:r.status, won, winner:r.winner,
      canCancel: r.status==="active" }];
  });
 
  // ── Cortitos ──────────────────────────────────────────────────────────────
  const myCortitos = (cortitos||[]).flatMap(c => {
    const mySlots = c.players.filter(p=>p.userId===currentUser.id);
    if (!mySlots.length) return [];
    const won = c.winner?.player?.userId===currentUser.id;
    return [{ id:c.id, name:c.name, slots:mySlots.map(s=>s.slotNumber),
      spent:mySlots.length*c.costPerSlot, prize:c.costPerSlot*c.totalSlots,
      status:c.status, won, canCancel:c.status==="open" }];
  });
 
  // ── Planillas ─────────────────────────────────────────────────────────────
  const myPlanillas = (planillas||[]).flatMap(p => {
    const myNums = Object.entries(p.numbers||{}).filter(([,slots])=>slots.some(s=>s?.userId===currentUser.id)).map(([n])=>n);
    if (!myNums.length) return [];
    const allMySlots = myNums.flatMap(n=>(p.numbers[n]||[]).filter(s=>s?.userId===currentUser.id));
    const won = p.winner && myNums.includes(String(p.winner.number));
    const wonAmt = won ? allMySlots.length * Math.floor(p.prize/4) : 0;
    const cuartos = allMySlots.filter(s=>s.fraccion==="cuarto").length;
    const medios  = allMySlots.filter(s=>s.fraccion==="medio").length;
    const enteros = allMySlots.filter(s=>s.fraccion==="entero").length;
    return [{ id:p.id, name:p.name, numbers:myNums, allMySlots, cuartos, medios, enteros,
      prize:p.prize, status:p.status, won, wonAmt, canCancel:p.status==="open",
      prices:p.prices }];
  });
 
  // ── Solicitudes ───────────────────────────────────────────────────────────
  const myReqs = (creditRequests||[]).filter(r=>r.userId===currentUser.id).reverse();
  const pendingCount = myReqs.filter(r=>r.status==="pending").length;
 
  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalGames = myRifas.length + myCortitos.length + myPlanillas.length;
  const totalWins  = [...myRifas,...myCortitos,...myPlanillas].filter(x=>x.won).length;
 
  const tabs = [
    { key:"rifas",    label:"🎫 Rifas",     n:myRifas.length    },
    { key:"cortitos", label:"⚡ Cortitos",  n:myCortitos.length },
    { key:"planillas",label:"🎰 Planillas", n:myPlanillas.length},
    { key:"creditos", label:"💳 Créditos",  n:pendingCount, alert:pendingCount>0 },
  ];
 
  const card = { background:"#160f35", border:"1px solid rgba(124,58,237,.2)", borderRadius:14, padding:"14px 16px", marginBottom:10 };
 
  const StatusTag = ({status,won}) => {
    if (won) return <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(251,191,36,.12)",border:"1px solid rgba(251,191,36,.4)",color:YELLOW }}>🏆 Ganaste</span>;
    if (status==="finished") return <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",color:"#f87171" }}>Sorteada</span>;
    if (status==="open"||status==="active") return <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.3)",color:GR }}>Activa</span>;
    return <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.35)" }}>{status}</span>;
  };
 
  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    const { type, id, numbers, slots, numStr } = cancelTarget;
    if (type==="rifa")     onCancelRifa?.(id, numbers);
    if (type==="cortito")  onCancelCortito?.(id, slots);
    if (type==="planilla") onCancelPlanilla?.(id, numStr);
    setCancelTarget(null);
  };
 
  const calcRifaRefund = (j) => j.numbers.length * (rifas.find(r=>r.id===j.id)?.pricePerNumber||0);
  const calcCortitoRefund = (j) => j.slots.length * (cortitos.find(c=>c.id===j.id)?.costPerSlot||0);
  const calcPlanillaRefund = (j) => {
    const p = planillas.find(x=>x.id===j.id);
    if (!p) return 0;
    return Math.round((j.cuartos)*p.prices.cuarto + (j.medios/2)*p.prices.medio + (j.enteros/4)*p.prices.entero);
  };
 
  return (
    <div style={{ minHeight:"100vh", background:"#0d0b1e", fontFamily:"'Barlow Condensed',sans-serif" }}>
      <Header {...headerProps} currentUser={currentUser} onProfile={()=>{}} />
      <CancelModal item={cancelTarget} onConfirm={handleConfirmCancel} onClose={()=>setCancelTarget(null)} />
 
      <main style={{ maxWidth:900, margin:"0 auto", padding:isMobile?"14px 12px 28px":"28px 24px" }}>
 
        {/* Perfil */}
        <div style={{ background:"linear-gradient(135deg,#1e1548,#160f35)", border:"1px solid rgba(124,58,237,.35)", borderRadius:18, padding:isMobile?"14px":"20px 24px", marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            <div style={{ width:58,height:58,borderRadius:"50%",background:`${V}25`,border:`2px solid ${VL}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0 }}>
              {currentUser.avatar}
            </div>
            <div style={{ flex:1, minWidth:100 }}>
              <div style={{ fontFamily:"'Cinzel',serif",color:"#fff",fontSize:18,fontWeight:700 }}>{currentUser.name}</div>
              <div style={{ display:"flex",gap:8,alignItems:"center",marginTop:4,flexWrap:"wrap" }}>
                <span style={{ color:"rgba(255,255,255,.3)",fontSize:12 }}>ID #{currentUser.id}</span>
                <span style={{ padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:700,textTransform:"capitalize",
                  background:currentUser.role==="admin"?`${V}20`:currentUser.role==="supervisor"?`${OR}15`:`rgba(255,255,255,.05)`,
                  border:`1px solid ${currentUser.role==="admin"?VL:currentUser.role==="supervisor"?OR:"rgba(255,255,255,.15)"}`,
                  color:currentUser.role==="admin"?VL:currentUser.role==="supervisor"?OR:"rgba(255,255,255,.4)" }}>
                  {currentUser.role||"jugador"}
                </span>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ color:"rgba(255,255,255,.3)",fontSize:10,textTransform:"uppercase",letterSpacing:1 }}>Saldo</div>
                <div style={{ color:YELLOW,fontWeight:900,fontSize:24,fontFamily:"'Cinzel',serif" }}>{currentUser.credits.toLocaleString()} cr.</div>
              </div>
              {/* BOTÓN PEDIR CRÉDITOS - prominente */}
              <button onClick={onRequestCredit} style={{
                background:`linear-gradient(135deg,${OR},${OR}cc)`,border:"none",
                borderRadius:10,padding:"10px 20px",color:"#fff",cursor:"pointer",
                fontSize:14,fontWeight:700,fontFamily:"'Cinzel',serif",letterSpacing:.5,
                boxShadow:`0 4px 20px rgba(249,115,22,.35)`,
                display:"flex",alignItems:"center",gap:8,
              }}>
                💳 Pedir créditos
              </button>
            </div>
          </div>
        </div>
 
        {/* Stats rápidos */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18 }}>
          {[
            { icon:"🎮", val:totalGames, label:"Partidas",  color:VL  },
            { icon:"🏆", val:totalWins,  label:"Premios",   color:YELLOW },
            { icon:"💎", val:`${currentUser.credits.toLocaleString()} cr.`, label:"Saldo", color:GR },
          ].map(s=>(
            <div key={s.label} style={{ background:"#160f35",border:"1px solid rgba(124,58,237,.15)",borderRadius:12,padding:"12px",textAlign:"center" }}>
              <div style={{ fontSize:20,marginBottom:4 }}>{s.icon}</div>
              <div style={{ color:s.color,fontWeight:900,fontSize:isMobile?15:18 }}>{s.val}</div>
              <div style={{ color:"rgba(255,255,255,.3)",fontSize:10,textTransform:"uppercase",letterSpacing:.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
 
        {/* Tabs */}
        <div style={{ display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:2 }}>
          {tabs.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{
              padding:"7px 16px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",
              whiteSpace:"nowrap",fontFamily:"'Barlow Condensed',sans-serif",
              background:tab===t.key?`${V}25`:"transparent",
              border:`1px solid ${tab===t.key?VL:"rgba(255,255,255,.1)"}`,
              color:tab===t.key?VL:"rgba(255,255,255,.38)",
              position:"relative",
            }}>
              {t.label}
              {t.n>0&&<span style={{ marginLeft:6,background:t.alert?"rgba(239,68,68,.2)":"rgba(255,255,255,.1)",color:t.alert?"#f87171":"rgba(255,255,255,.5)",borderRadius:10,padding:"0 6px",fontSize:10 }}>{t.n}</span>}
            </button>
          ))}
        </div>
 
        {/* ── RIFAS ── */}
        {tab==="rifas"&&(
          myRifas.length===0
          ?<Empty msg="No compraste números en ninguna rifa todavía." />
          :myRifas.map(j=>(
            <div key={j.id} style={card}>
              <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
                <span style={{ fontSize:26 }}>{j.icon}</span>
                <div style={{ flex:1,minWidth:100 }}>
                  <div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>{j.name}</div>
                  <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginTop:5 }}>
                    {[...j.numbers].sort().slice(0,12).map(n=>(
                      <span key={n} style={{ background:`${V}20`,border:`1px solid ${V}55`,borderRadius:4,padding:"1px 7px",color:VL,fontSize:11 }}>{n}</span>
                    ))}
                    {j.numbers.length>12&&<span style={{ color:"rgba(255,255,255,.3)",fontSize:11 }}>+{j.numbers.length-12}</span>}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:"rgba(255,255,255,.35)",fontSize:11,marginBottom:5 }}>{j.spent} cr. apostados</div>
                  <StatusTag status={j.status} won={j.won}/>
                </div>
              </div>
              {j.canCancel&&(
                <div style={{ marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"flex-end" }}>
                  <button onClick={()=>setCancelTarget({ type:"rifa",id:j.id,name:j.name,numbers:j.numbers,refund:calcRifaRefund(j) })}
                    style={{ background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:8,padding:"7px 16px",color:"#f87171",cursor:"pointer",fontSize:13,fontFamily:"'Barlow Condensed',sans-serif" }}>
                    🔄 Cancelar y recuperar {calcRifaRefund(j)} cr.
                  </button>
                </div>
              )}
            </div>
          ))
        )}
 
        {/* ── CORTITOS ── */}
        {tab==="cortitos"&&(
          myCortitos.length===0
          ?<Empty msg="No jugaste ningún cortito todavía." />
          :myCortitos.map(j=>(
            <div key={j.id} style={card}>
              <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
                <span style={{ fontSize:26 }}>⚡</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>{j.name}</div>
                  <div style={{ color:"rgba(255,255,255,.4)",fontSize:12,marginTop:3 }}>Slots: {j.slots.map(s=>`#${s}`).join(", ")} · {j.spent} cr. apostados</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:5 }}>Pozo: {j.prize.toLocaleString()} cr.</div>
                  <StatusTag status={j.status} won={j.won}/>
                </div>
              </div>
              {j.canCancel&&(
                <div style={{ marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"flex-end" }}>
                  <button onClick={()=>setCancelTarget({ type:"cortito",id:j.id,name:j.name,slots:j.slots,refund:calcCortitoRefund(j) })}
                    style={{ background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:8,padding:"7px 16px",color:"#f87171",cursor:"pointer",fontSize:13,fontFamily:"'Barlow Condensed',sans-serif" }}>
                    🔄 Cancelar y recuperar {calcCortitoRefund(j)} cr.
                  </button>
                </div>
              )}
            </div>
          ))
        )}
 
        {/* ── PLANILLAS ── */}
        {tab==="planillas"&&(
          myPlanillas.length===0
          ?<Empty msg="No jugaste ninguna planilla todavía." />
          :myPlanillas.map(j=>(
            <div key={j.id} style={card}>
              <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
                <span style={{ fontSize:26 }}>🎰</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>{j.name}</div>
                  <div style={{ color:"rgba(255,255,255,.4)",fontSize:12,marginTop:3 }}>Números: {j.numbers.map(n=>`#${n}`).join(", ")}</div>
                  <div style={{ display:"flex",gap:6,marginTop:5,flexWrap:"wrap" }}>
                    {j.cuartos>0&&<span style={{ padding:"2px 8px",borderRadius:5,fontSize:10,background:`${FRAC_COLORS.cuarto}15`,color:FRAC_COLORS.cuarto,border:`1px solid ${FRAC_COLORS.cuarto}40` }}>{j.cuartos} cuarto{j.cuartos>1?"s":""}</span>}
                    {j.medios>0&&<span style={{ padding:"2px 8px",borderRadius:5,fontSize:10,background:"rgba(34,197,94,.1)",color:"#22c55e",border:"1px solid rgba(34,197,94,.3)" }}>{j.medios/2} medio{j.medios/2>1?"s":""}</span>}
                    {j.enteros>0&&<span style={{ padding:"2px 8px",borderRadius:5,fontSize:10,background:"rgba(251,191,36,.1)",color:YELLOW,border:"1px solid rgba(251,191,36,.3)" }}>{j.enteros/4} entero{j.enteros/4>1?"s":""}</span>}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  {j.won&&<div style={{ color:GR,fontWeight:700,fontSize:13,marginBottom:4 }}>+{j.wonAmt.toLocaleString()} cr.</div>}
                  <StatusTag status={j.status} won={j.won}/>
                </div>
              </div>
              {j.canCancel&&j.numbers.map(numStr=>{
                const slots=(planillas.find(p=>p.id===j.id)?.numbers?.[numStr]||[]).filter(s=>s?.userId===currentUser.id);
                if (!slots.length) return null;
                const c=slots.filter(s=>s.fraccion==="cuarto").length;
                const m=slots.filter(s=>s.fraccion==="medio").length/2;
                const e=slots.filter(s=>s.fraccion==="entero").length/4;
                const ref=Math.round(c*j.prices.cuarto+m*j.prices.medio+e*j.prices.entero);
                return (
                  <div key={numStr} style={{ marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.05)",display:"flex",justifyContent:"flex-end" }}>
                    <button onClick={()=>setCancelTarget({ type:"planilla",id:j.id,name:`${j.name} · Número ${numStr}`,numStr,refund:ref })}
                      style={{ background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:8,padding:"7px 16px",color:"#f87171",cursor:"pointer",fontSize:12,fontFamily:"'Barlow Condensed',sans-serif" }}>
                      🔄 Cancelar Nro. {numStr} · recuperar {ref} cr.
                    </button>
                  </div>
                );
              })}
            </div>
          ))
        )}
 
        {/* ── CRÉDITOS ── */}
        {tab==="creditos"&&(
          <div>
            <button onClick={onRequestCredit} style={{
              width:"100%",padding:"15px",marginBottom:16,
              background:`linear-gradient(135deg,${OR},${OR}cc)`,
              border:"none",borderRadius:12,color:"#fff",cursor:"pointer",
              fontSize:15,fontWeight:700,fontFamily:"'Cinzel',serif",letterSpacing:.5,
              boxShadow:"0 4px 20px rgba(249,115,22,.35)",
              display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            }}>
              💳 Solicitar créditos al equipo
            </button>
            {myReqs.length===0
              ?<Empty msg="No hiciste solicitudes de crédito todavía. Usá el botón de arriba para pedir." />
              :myReqs.map(r=>(
                <div key={r.id} style={{ ...card,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"rgba(255,255,255,.5)",fontSize:12 }}>{r.date}</div>
                    {r.note&&<div style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginTop:2 }}>{r.note}</div>}
                  </div>
                  <span style={{ color:YELLOW,fontWeight:700,fontSize:18 }}>{r.amount} cr.</span>
                  <span style={{ padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:700,
                    background:r.status==="pending"?"rgba(251,191,36,.1)":r.status==="approved"?"rgba(34,197,94,.1)":"rgba(239,68,68,.08)",
                    border:`1px solid ${r.status==="pending"?"rgba(251,191,36,.3)":r.status==="approved"?"rgba(34,197,94,.3)":"rgba(239,68,68,.25)"}`,
                    color:r.status==="pending"?YELLOW:r.status==="approved"?GR:"#f87171" }}>
                    {r.status==="pending"?"⏳ Pendiente":r.status==="approved"?"✓ Aprobada":"✗ Rechazada"}
                  </span>
                </div>
              ))
            }
          </div>
        )}
      </main>
    </div>
  );
}
 
function Empty({ msg }) {
  return (
    <div style={{ textAlign:"center",padding:"48px 20px",color:"rgba(255,255,255,.2)",fontSize:14,
      background:"rgba(124,58,237,.04)",borderRadius:14,border:"1px solid rgba(124,58,237,.1)" }}>
      <div style={{ fontSize:36,marginBottom:10 }}>🎲</div>{msg}
    </div>
  );
}
 