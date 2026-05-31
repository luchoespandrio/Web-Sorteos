import React, { useState, useEffect } from "react";
import { Header } from "../common/Header";
import { COLORS } from "../../utils/constants";
 
const { YELLOW, YELLOW2, BG } = COLORS;
const TEAL = "#4ECDC4";
 
export function SupervisorPanel({ currentUser, db, updateDB, onLobby, onLogout, ...headerProps }) {
  const perms  = currentUser.permissions || {};
  const tabs   = [
    perms.canGiveCredits     && { key:"credits",  label:"💰 Acreditar",   color:YELLOW  },
    perms.canApproveCredits  && { key:"requests", label:"📋 Solicitudes", color:"#FF8C00" },
    perms.canCreateUsers     && { key:"users",    label:"👥 Usuarios",    color:TEAL    },
    perms.canManageGames     && { key:"games",    label:"🎮 Juegos",      color:"#A07BFF" },
  ].filter(Boolean);
 
  const [tab, setTab] = useState(tabs[0]?.key || "");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h); return () => window.removeEventListener("resize", h);
  }, []);
 
  // Acreditar créditos
  const [creditTarget, setCreditTarget] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
 
  const handleGiveCredit = () => {
    const user = db.users.find(u => u.id === parseInt(creditTarget));
    const amt  = parseInt(creditAmount);
    if (!user || isNaN(amt) || amt <= 0) return;
    updateDB(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === user.id ? { ...u, credits: u.credits + amt } : u),
      creditRequests: [...prev.creditRequests, {
        id: Date.now(), userId: user.id, userName: user.name,
        amount: amt, note: `Acreditado por ${currentUser.name}`,
        date: new Date().toLocaleDateString("es-AR"), status: "approved",
      }],
    }));
    setCreditTarget(""); setCreditAmount("");
  };
 
  // Solicitudes de crédito
  const pending = (db.creditRequests || []).filter(r => r.status === "pending");
  const approveReq = id => {
    const req = db.creditRequests.find(r => r.id === id); if (!req) return;
    updateDB(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === req.userId ? { ...u, credits: u.credits + req.amount } : u),
      creditRequests: prev.creditRequests.map(r => r.id === id ? { ...r, status:"approved" } : r),
    }));
  };
  const rejectReq = id => updateDB(prev => ({ ...prev, creditRequests: prev.creditRequests.map(r => r.id===id?{...r,status:"rejected"}:r) }));
 
  // Crear usuarios
  const [newUser, setNewUser] = useState({ username:"", password:"", name:"", avatar:"👤", credits:0 });
  const createUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) return;
    const id = Math.max(...db.users.map(u => u.id)) + 1;
    updateDB(prev => ({ ...prev, users: [...prev.users, { ...newUser, id, credits:Number(newUser.credits)||0, isAdmin:false, role:"player", permissions:{ canGiveCredits:false, canApproveCredits:false, canCreateUsers:false, canManageGames:false } }] }));
    setNewUser({ username:"", password:"", name:"", avatar:"👤", credits:0 });
  };
 
  // Juegos
  const resetCortito = id => updateDB(prev => ({ ...prev, cortitos: prev.cortitos.map(c => c.id===id?{...c,status:"open",players:[],seq:[],winner:null}:c) }));
  const resetPlanilla= id => updateDB(prev => ({ ...prev, planillas: prev.planillas.map(p => p.id===id?{...p,status:"open",numbers:{},seq:[],winner:null}:p) }));
 
  const inputStyle = { background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"10px 14px", color:"#fff", fontSize:14, outline:"none", fontFamily:"'Barlow Condensed',sans-serif", width:"100%", boxSizing:"border-box" };
  const card      = { background:"#0d0d1a", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"18px" };
 
  if (tabs.length === 0) return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,.3)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🔒</div>
        <div>No tenés permisos asignados todavía.</div>
        <div style={{ fontSize:13, marginTop:6, color:"rgba(255,255,255,.2)" }}>Pedile al administrador que te asigne permisos.</div>
      </div>
    </div>
  );
 
  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'Barlow Condensed',sans-serif" }}>
      <Header {...headerProps} currentUser={currentUser} onLogout={onLogout} onSupervisor={() => {}} />
 
      <main style={{ maxWidth:900, margin:"0 auto", padding: isMobile ? "16px 12px" : "28px 24px" }}>
        {/* Encabezado */}
        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:isMobile?20:24, fontWeight:900, color:"#fff", margin:0 }}>
            🎪 Panel Supervisor
          </h1>
          <p style={{ color:"rgba(255,255,255,.3)", fontSize:13, margin:"4px 0 0" }}>
            Hola {currentUser.name} · Accesos asignados: {tabs.map(t=>t.label).join(", ")}
          </p>
        </div>
 
        {/* Tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding:"8px 18px", borderRadius:8, fontSize:13, cursor:"pointer",
              whiteSpace:"nowrap", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600,
              background: tab===t.key ? `${t.color}18` : "transparent",
              border:`1px solid ${tab===t.key ? t.color : "rgba(255,255,255,.1)"}`,
              color: tab===t.key ? t.color : "rgba(255,255,255,.4)",
            }}>{t.label}</button>
          ))}
          <button onClick={onLobby} style={{ padding:"8px 18px", borderRadius:8, fontSize:13, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'Barlow Condensed',sans-serif", background:"transparent", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.3)", marginLeft:"auto" }}>
            ← Ver juegos
          </button>
        </div>
 
        {/* ── TAB: Acreditar ── */}
        {tab === "credits" && (
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
            <div style={card}>
              <h3 style={{ color:YELLOW, fontSize:15, fontFamily:"'Cinzel',serif", marginBottom:16 }}>💰 Dar créditos</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div>
                  <label style={{ color:"rgba(255,255,255,.4)", fontSize:11, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:5 }}>Jugador</label>
                  <select value={creditTarget} onChange={e => setCreditTarget(e.target.value)} style={{ ...inputStyle }}>
                    <option value="">Seleccioná un jugador...</option>
                    {db.users.filter(u => u.role === "player").map(u => (
                      <option key={u.id} value={u.id}>{u.avatar} {u.name} · {u.credits} cr.</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color:"rgba(255,255,255,.4)", fontSize:11, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:5 }}>Monto</label>
                  <input type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} placeholder="0" style={inputStyle} min="1" />
                </div>
                <button onClick={handleGiveCredit} disabled={!creditTarget || !creditAmount || parseInt(creditAmount) <= 0}
                  style={{ padding:"12px", borderRadius:8, border:"none", cursor: creditTarget && creditAmount ? "pointer" : "not-allowed",
                    background: creditTarget && creditAmount ? `linear-gradient(135deg,${YELLOW2},${YELLOW})` : "rgba(255,255,255,.05)",
                    color: creditTarget && creditAmount ? "#000" : "rgba(255,255,255,.2)",
                    fontSize:14, fontWeight:700, fontFamily:"'Cinzel',serif", letterSpacing:.5, textTransform:"uppercase" }}>
                  Acreditar créditos
                </button>
              </div>
            </div>
 
            {/* Historial */}
            <div style={card}>
              <h3 style={{ color:"rgba(255,255,255,.6)", fontSize:15, fontFamily:"'Cinzel',serif", marginBottom:14 }}>Historial reciente</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:300, overflowY:"auto" }}>
                {[...db.creditRequests].reverse().filter(r => r.status === "approved" && r.note?.includes("Acreditado")).slice(0,10).map(r => (
                  <div key={r.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 10px", background:"rgba(255,255,255,.02)", borderRadius:7, border:"1px solid rgba(255,255,255,.05)" }}>
                    <span style={{ color:"#fff", fontSize:13 }}>{r.userName}</span>
                    <span style={{ color:YELLOW, fontWeight:700, fontSize:13 }}>+{r.amount} cr.</span>
                  </div>
                ))}
                {db.creditRequests.filter(r => r.note?.includes("Acreditado")).length === 0 && (
                  <p style={{ color:"rgba(255,255,255,.2)", fontSize:13, textAlign:"center", padding:"20px 0" }}>Sin historial todavía</p>
                )}
              </div>
            </div>
          </div>
        )}
 
        {/* ── TAB: Solicitudes ── */}
        {tab === "requests" && (
          <div style={card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h3 style={{ color:"#FF8C00", fontSize:15, fontFamily:"'Cinzel',serif" }}>📋 Solicitudes de crédito</h3>
              {pending.length > 0 && <span style={{ background:"rgba(255,140,0,.12)", border:"1px solid rgba(255,140,0,.3)", borderRadius:10, padding:"3px 10px", color:"#FF8C00", fontSize:12, fontWeight:700 }}>{pending.length} pendientes</span>}
            </div>
            {db.creditRequests.length === 0
              ? <p style={{ color:"rgba(255,255,255,.2)", fontSize:14, textAlign:"center", padding:"30px 0" }}>Sin solicitudes</p>
              : <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[...db.creditRequests].reverse().map(req => (
                    <div key={req.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth:120 }}>
                        <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{req.userName}</div>
                        <div style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>{req.date} {req.note && `· ${req.note}`}</div>
                      </div>
                      <span style={{ color:YELLOW, fontWeight:700, fontSize:16 }}>{req.amount} cr.</span>
                      {req.status === "pending"
                        ? <div style={{ display:"flex", gap:6 }}>
                            <button onClick={() => approveReq(req.id)} style={{ background:"rgba(0,200,83,.1)", border:"1px solid rgba(0,200,83,.3)", color:"#00C853", padding:"6px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 }}>✓ Aprobar</button>
                            <button onClick={() => rejectReq(req.id)} style={{ background:"rgba(255,50,50,.08)", border:"1px solid rgba(255,50,50,.25)", color:"#FF6464", padding:"6px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 }}>✗ Rechazar</button>
                          </div>
                        : <span style={{ fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:6,
                            background: req.status==="approved" ? "rgba(0,200,83,.1)" : "rgba(255,50,50,.08)",
                            color: req.status==="approved" ? "#00C853" : "#FF6464" }}>
                            {req.status==="approved" ? "✓ Aprobada" : "✗ Rechazada"}
                          </span>
                      }
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
 
        {/* ── TAB: Usuarios ── */}
        {tab === "users" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={card}>
              <h3 style={{ color:TEAL, fontSize:15, fontFamily:"'Cinzel',serif", marginBottom:14 }}>👥 Dar de alta usuario</h3>
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap:10, marginBottom:10 }}>
                <input value={newUser.name}     onChange={e=>setNewUser(p=>({...p,name:e.target.value}))}     placeholder="Nombre completo" style={inputStyle}/>
                <input value={newUser.username} onChange={e=>setNewUser(p=>({...p,username:e.target.value}))} placeholder="Usuario"         style={inputStyle}/>
                <input value={newUser.password} onChange={e=>setNewUser(p=>({...p,password:e.target.value}))} placeholder="Contraseña"       style={inputStyle}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 3fr", gap:10 }}>
                <input value={newUser.avatar}  onChange={e=>setNewUser(p=>({...p,avatar:e.target.value}))}  placeholder="Avatar 🎯" style={inputStyle}/>
                <input type="number" value={newUser.credits} onChange={e=>setNewUser(p=>({...p,credits:+e.target.value}))} placeholder="Créditos iniciales" style={inputStyle}/>
                <button onClick={createUser} disabled={!newUser.username||!newUser.password||!newUser.name}
                  style={{ padding:"10px", borderRadius:8, border:"none", cursor: newUser.username&&newUser.password&&newUser.name?"pointer":"not-allowed",
                    background: newUser.username&&newUser.password&&newUser.name ? `linear-gradient(135deg,#4ECDC4,#00C853)` : "rgba(255,255,255,.05)",
                    color: newUser.username&&newUser.password&&newUser.name ? "#000" : "rgba(255,255,255,.2)",
                    fontSize:14, fontWeight:700, fontFamily:"'Cinzel',serif" }}>
                  + Crear jugador
                </button>
              </div>
            </div>
            <div style={card}>
              <h3 style={{ color:"rgba(255,255,255,.5)", fontSize:14, fontFamily:"'Cinzel',serif", marginBottom:12 }}>Jugadores registrados</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:350, overflowY:"auto" }}>
                {db.users.filter(u => u.role === "player").map(u => (
                  <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:"rgba(255,255,255,.02)", borderRadius:8, border:"1px solid rgba(255,255,255,.05)" }}>
                    <span style={{ fontSize:20 }}>{u.avatar}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{u.name}</div>
                      <div style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>@{u.username}</div>
                    </div>
                    <span style={{ color:YELLOW, fontWeight:700 }}>{u.credits.toLocaleString()} cr.</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
 
        {/* ── TAB: Juegos ── */}
        {tab === "games" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <h3 style={{ color:"#A07BFF", fontSize:15, fontFamily:"'Cinzel',serif", marginBottom:4 }}>⚡ Cortitos</h3>
            {db.cortitos?.map(c => (
              <div key={c.id} style={{ ...card, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                <span style={{ fontSize:22 }}>📋</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{c.name}</div>
                  <div style={{ color:"rgba(255,255,255,.35)", fontSize:12 }}>{c.players.length}/{c.totalSlots} slots · {c.costPerSlot} cr./slot</div>
                </div>
                <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, fontWeight:700,
                  background: c.status==="open"?"rgba(78,205,196,.1)":"rgba(255,215,0,.1)",
                  border:`1px solid ${c.status==="open"?"rgba(78,205,196,.3)":"rgba(255,215,0,.3)"}`,
                  color: c.status==="open"?"#4ECDC4":YELLOW }}>
                  {c.status==="open"?"Abierto":c.status==="running"?"Sorteando":"Finalizado"}
                </span>
                <button onClick={() => resetCortito(c.id)} style={{ padding:"7px 14px", borderRadius:7, border:"1px solid rgba(0,200,83,.25)", background:"rgba(0,200,83,.07)", color:"#00C853", cursor:"pointer", fontSize:12, fontFamily:"'Barlow Condensed',sans-serif" }}>🔄 Reiniciar</button>
              </div>
            ))}
            <h3 style={{ color:"#A07BFF", fontSize:15, fontFamily:"'Cinzel',serif", margin:"12px 0 4px" }}>🎰 Planillas</h3>
            {db.planillas?.map(p => (
              <div key={p.id} style={{ ...card, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                <span style={{ fontSize:22 }}>🎰</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{p.name}</div>
                  <div style={{ color:"rgba(255,255,255,.35)", fontSize:12 }}>Premio: {p.prize?.toLocaleString()} cr. · {p.subtitle}</div>
                </div>
                <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, fontWeight:700,
                  background: p.status==="open"?"rgba(78,205,196,.1)":"rgba(255,215,0,.1)",
                  border:`1px solid ${p.status==="open"?"rgba(78,205,196,.3)":"rgba(255,215,0,.3)"}`,
                  color: p.status==="open"?"#4ECDC4":YELLOW }}>
                  {p.status==="open"?"Abierta":p.status==="running"?"Sorteando":"Finalizada"}
                </span>
                <button onClick={() => resetPlanilla(p.id)} style={{ padding:"7px 14px", borderRadius:7, border:"1px solid rgba(0,200,83,.25)", background:"rgba(0,200,83,.07)", color:"#00C853", cursor:"pointer", fontSize:12, fontFamily:"'Barlow Condensed',sans-serif" }}>🔄 Reiniciar</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}