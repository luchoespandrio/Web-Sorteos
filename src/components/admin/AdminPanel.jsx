import React, { useState } from "react";
import { COLORS, PLANILLAS_INIT } from "../../utils/constants";
import { Roulette } from "../game/Roulette";
 
const YELLOW  = "#FFD700";
const YELLOW2 = "#F0B90B";
const BG      = "#0a0a0f";
const PURPLE  = "#7C4DFF";
const PURPLE_L= "#A07BFF";
const FRAC_COLORS = { cuarto: "#7C4DFF", medio: "#00C853", entero: "#C9A84C" };
 
const CORTITOS_INIT_LOCAL = [
  { id:1, name:"Planilla 1", description:"Completá 5 casilleros para ganar el pozo",
    costPerSlot:100, totalSlots:10, casillerosToWin:5, bolMin:1, bolMax:10,
    players:[], status:"open", seq:[], winner:null },
];
 
export function AdminPanel({ db, setDb, onLogout, onLobby, toast }) {
  const { users, rifas, creditRequests, cortitos = CORTITOS_INIT_LOCAL, planillas = PLANILLAS_INIT } = db;
 
  const [tab, setTab] = useState("rifas");
 
  // ── Rifas ──────────────────────────────────────────────────────────────────
  const [newRifa, setNewRifa]   = useState({ name:"", subtitle:"", icon:"🎁", pricePerNumber:50, prize:"", totalNumbers:100 });
  const [editRifa, setEditRifa] = useState(null);
 
  // ── Usuarios ───────────────────────────────────────────────────────────────
  const [newUser, setNewUser]       = useState({ username:"", password:"", name:"", avatar:"👤", credits:0, isAdmin:false });
  const [editUser, setEditUser]     = useState(null);
  const [editCredits, setEditCredits] = useState({ id:null, val:"" });
 
  // ── Cortitos ───────────────────────────────────────────────────────────────
  const [newCortito, setNewCortito]   = useState({ name:"", description:"", costPerSlot:100, totalSlots:10, casillerosToWin:5, bolMin:1, bolMax:10 });
  const [editCortito, setEditCortito] = useState(null);
 
  // ── Planillas ──────────────────────────────────────────────────────────────
  const [newPlanilla, setNewPlanilla]   = useState({ name:"", subtitle:"Sale 7 veces", prize:20000, timesOut:7, totalNumbers:12, prices:{ cuarto:5, medio:10, entero:20 } });
  const [editPlanilla, setEditPlanilla] = useState(null);
 
  // ── Ruleta / confirmaciones ────────────────────────────────────────────────
  const [showRoulette, setShowRoulette] = useState(false);
  const [rouletteNumbers, setRouletteNumbers] = useState([]);
  const [rifaToDraw, setRifaToDraw]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [resetConfirm,  setResetConfirm]  = useState(null);
 
  // ── Helpers ────────────────────────────────────────────────────────────────
  const inputStyle = {
    background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.09)",
    borderRadius:7, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none",
    fontFamily:"'Barlow Condensed',sans-serif", width:"100%", boxSizing:"border-box",
  };
  const btnStyle = {
    padding:"5px 11px", borderRadius:6, cursor:"pointer",
    fontSize:11, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600,
  };
  const primaryBtn = (enabled) => ({
    ...btnStyle,
    background: enabled ? `linear-gradient(135deg,${YELLOW2},${YELLOW})` : "rgba(255,255,255,.04)",
    border:"none",
    color: enabled ? "#000" : "rgba(255,255,255,.28)",
    fontWeight:700, padding:"10px", borderRadius:8,
  });
 
  // ── Rifas ──────────────────────────────────────────────────────────────────
  const createRifa = () => {
    if (!newRifa.name || !newRifa.prize) { toast("Completá nombre y premio","warn"); return; }
    const id = rifas.length ? Math.max(...rifas.map(r=>r.id))+1 : 1;
    setDb(prev => ({ ...prev, rifas:[...prev.rifas,{ id,...newRifa, totalNumbers:parseInt(newRifa.totalNumbers)||100, status:"active", numbers:{}, winner:null }] }));
    setNewRifa({ name:"", subtitle:"", icon:"🎁", pricePerNumber:50, prize:"", totalNumbers:100 });
    toast("Rifa creada","success");
  };
  const saveEditRifa = () => {
    setDb(prev => ({ ...prev, rifas:prev.rifas.map(r=>r.id===editRifa.id?{...r,...editRifa,totalNumbers:parseInt(editRifa.totalNumbers)||100}:r) }));
    setEditRifa(null); toast("Rifa actualizada","success");
  };
  const deleteRifa = (id) => { setDb(prev=>({...prev,rifas:prev.rifas.filter(r=>r.id!==id)})); setDeleteConfirm(null); toast("Rifa eliminada","warn"); };
  const resetRifa  = (id) => {
    setDb(prev=>({...prev,rifas:prev.rifas.map(r=>r.id===id?{...r,status:"active",numbers:{},winner:null,winnerId:null,winnerNumber:null}:r)}));
    setResetConfirm(null); toast("Rifa reiniciada","success");
  };
 
  // ── Cortitos ───────────────────────────────────────────────────────────────
  const createCortito = () => {
    if (!newCortito.name) { toast("Completá los campos","warn"); return; }
    const id = cortitos.length ? Math.max(...cortitos.map(c=>c.id))+1 : 1;
    setDb(prev=>({...prev,cortitos:[...prev.cortitos,{id,...newCortito,totalSlots:parseInt(newCortito.totalSlots)||10,costPerSlot:parseInt(newCortito.costPerSlot)||100,status:"open",players:[],seq:[],winner:null}]}));
    setNewCortito({ name:"", description:"", costPerSlot:100, totalSlots:10, casillerosToWin:5, bolMin:1, bolMax:10 });
    toast("Cortito creado","success");
  };
  const saveEditCortito = () => {
    setDb(prev=>({...prev,cortitos:prev.cortitos.map(c=>c.id===editCortito.id?{...c,...editCortito,totalSlots:parseInt(editCortito.totalSlots)||10,costPerSlot:parseInt(editCortito.costPerSlot)||100}:c)}));
    setEditCortito(null); toast("Cortito actualizado","success");
  };
  const deleteCortito = (id) => { setDb(prev=>({...prev,cortitos:prev.cortitos.filter(c=>c.id!==id)})); setDeleteConfirm(null); toast("Cortito eliminado","warn"); };
  const resetCortito  = (id) => {
    setDb(prev=>({...prev,cortitos:prev.cortitos.map(c=>c.id===id?{...c,status:"open",players:[],seq:[],winner:null}:c)}));
    setResetConfirm(null); toast("Cortito reiniciado","success");
  };
 
  // ── Planillas ──────────────────────────────────────────────────────────────
  const createPlanilla = () => {
    if (!newPlanilla.name || !newPlanilla.prize) { toast("Completá nombre y premio","warn"); return; }
    const id = planillas.length ? Math.max(...planillas.map(p=>p.id))+1 : 1;
    setDb(prev=>({
      ...prev,
      planillas:[...(prev.planillas||[]),{
        id,
        name: newPlanilla.name,
        subtitle: newPlanilla.subtitle,
        prize: parseInt(newPlanilla.prize)||0,
        timesOut: parseInt(newPlanilla.timesOut)||7,
        totalNumbers: parseInt(newPlanilla.totalNumbers)||12,
        status:"open",
        prices:{
          cuarto: parseInt(newPlanilla.prices.cuarto)||5,
          medio:  parseInt(newPlanilla.prices.medio)||10,
          entero: parseInt(newPlanilla.prices.entero)||20,
        },
        numbers:{}, seq:[], winner:null,
      }],
    }));
    setNewPlanilla({ name:"", subtitle:"Sale 7 veces", prize:20000, timesOut:7, totalNumbers:12, prices:{cuarto:5,medio:10,entero:20} });
    toast("Planilla creada","success");
  };
  const saveEditPlanilla = () => {
    setDb(prev=>({
      ...prev,
      planillas: prev.planillas.map(p=>p.id===editPlanilla.id
        ?{...p,...editPlanilla,
          prize:parseInt(editPlanilla.prize)||0,
          timesOut:parseInt(editPlanilla.timesOut)||7,
          totalNumbers:parseInt(editPlanilla.totalNumbers)||12,
          prices:{
            cuarto:parseInt(editPlanilla.prices?.cuarto)||5,
            medio:parseInt(editPlanilla.prices?.medio)||10,
            entero:parseInt(editPlanilla.prices?.entero)||20,
          },
        }:p
      ),
    }));
    setEditPlanilla(null); toast("Planilla actualizada","success");
  };
  const deletePlanilla = (id) => { setDb(prev=>({...prev,planillas:prev.planillas.filter(p=>p.id!==id)})); setDeleteConfirm(null); toast("Planilla eliminada","warn"); };
  const resetPlanilla  = (id) => {
    setDb(prev=>({...prev,planillas:prev.planillas.map(p=>p.id===id?{...p,status:"open",numbers:{},seq:[],winner:null}:p)}));
    setResetConfirm(null); toast("Planilla reiniciada","success");
  };
 
  // ── Usuarios ───────────────────────────────────────────────────────────────
  const createUser = () => {
    if (!newUser.username||!newUser.password||!newUser.name){ toast("Completá todos los campos","warn"); return; }
    const id = users.length ? Math.max(...users.map(u=>u.id))+1 : 1;
    setDb(prev=>({...prev,users:[...prev.users,{...newUser,id,credits:Number(newUser.credits)||0}]}));
    setNewUser({ username:"", password:"", name:"", avatar:"👤", credits:0, isAdmin:false });
    toast("Usuario creado","success");
  };
  const saveEditUser = () => {
    setDb(prev=>({...prev,users:prev.users.map(u=>u.id===editUser.id?{...u,...editUser}:u)}));
    setEditUser(null); toast("Usuario actualizado","success");
  };
  const deleteUser = (id) => { setDb(prev=>({...prev,users:prev.users.filter(u=>u.id!==id)})); setDeleteConfirm(null); toast("Usuario eliminado","warn"); };
 
  // ── Créditos ───────────────────────────────────────────────────────────────
  const approveCredit = (id) => {
    const req = creditRequests.find(r=>r.id===id); if(!req) return;
    setDb(prev=>({ ...prev,
      users:prev.users.map(u=>u.id===req.userId?{...u,credits:u.credits+req.amount}:u),
      creditRequests:prev.creditRequests.map(r=>r.id===id?{...r,status:"approved"}:r),
    }));
    toast(`Solicitud de ${req.userName} aprobada: +${req.amount} cr.`,"success");
  };
  const rejectCredit = (id) => {
    setDb(prev=>({...prev,creditRequests:prev.creditRequests.map(r=>r.id===id?{...r,status:"rejected"}:r)}));
    toast("Solicitud rechazada","warn");
  };
 
  // ── Ruleta ─────────────────────────────────────────────────────────────────
  const startDraw = (rifa) => {
    const sold = Object.entries(rifa.numbers).filter(([_,n])=>n.status==="reservado").map(([num])=>num);
    if (!sold.length){ toast("No hay números vendidos","warn"); return; }
    setRifaToDraw(rifa); setRouletteNumbers(sold); setShowRoulette(true);
  };
  const handleWinnerSelected = (winnerNumber) => {
    setDb(prev=>({...prev,rifas:prev.rifas.map(r=>r.id===rifaToDraw.id?{...r,status:"finished",winnerNumber,winner:{number:winnerNumber,name:"Ganador"}}:r)}));
    toast(`¡Ganador: Número ${winnerNumber}!`,"success");
    setShowRoulette(false);
  };
 
  // ── Datos derivados ────────────────────────────────────────────────────────
  const pendingRequests   = creditRequests.filter(r=>r.status==="pending");
  const totalCredits      = users.reduce((s,u)=>s+u.credits,0);
 
  const planillaStats = (p) => {
    const total    = p.totalNumbers * 4;
    const used     = Object.values(p.numbers||{}).flat().filter(Boolean).length;
    return { total, used, pct: Math.round((used/total)*100) };
  };
 
  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'Barlow Condensed',sans-serif" }}>
 
      {/* Header admin */}
      <header style={{
        background:"#0d0d14", borderBottom:"1px solid rgba(78,205,196,.18)",
        padding:"0 24px", height:60, display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span>⚙️</span>
          <span style={{ fontFamily:"'Cinzel',serif", fontSize:15, fontWeight:700, color:"#4ECDC4", letterSpacing:3 }}>
            PANEL ADMIN
          </span>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onLobby} style={{ ...btnStyle, background:"rgba(255,215,0,.07)", border:"1px solid rgba(255,215,0,.22)", color:YELLOW }}>← Volver</button>
          <button onClick={onLogout} style={{ ...btnStyle, background:"transparent", border:"1px solid rgba(255,100,100,.28)", color:"#FF6464" }}>Salir</button>
        </div>
      </header>
 
      <main style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px" }}>
 
        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:12, marginBottom:22 }}>
          {[
            { label:"Jugadores",      val:users.filter(u=>!u.isAdmin).length,      icon:"👥", c:"#4ECDC4" },
            { label:"Rifas activas",  val:rifas.filter(r=>r.status==="active").length, icon:"🎫", c:YELLOW },
            { label:"Cortitos activos",val:cortitos.filter(c=>c.status==="open").length,icon:"⚡",c:"#FF8C00"},
            { label:"Sorteos abiertos",val:(planillas||[]).filter(p=>p.status==="open").length,icon:"⭐",c:PURPLE_L},
            { label:"Créditos emitidos",val:totalCredits.toLocaleString(),          icon:"💰", c:"#00C853" },
          ].map(s=>(
            <div key={s.label} style={{ background:"#0d0d14", border:`1px solid ${s.c}22`, borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>{s.icon}</span>
              <div>
                <p style={{ color:"rgba(255,255,255,.32)", fontSize:10, letterSpacing:1.5, textTransform:"uppercase", marginBottom:1 }}>{s.label}</p>
                <p style={{ color:s.c, fontSize:21, fontWeight:700 }}>{s.val}</p>
              </div>
            </div>
          ))}
        </div>
 
        {/* Tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
          {[
            ["dashboard","Dashboard"],
            ["users","👥 Usuarios"],
            ["rifas","🎫 Rifas"],
            ["cortitos","⚡ Cortitos"],
            ["planillas","⭐ Sorteos"],
          ].map(([val,label])=>(
            <button key={val} onClick={()=>setTab(val)} style={{
              padding:"7px 18px", borderRadius:7, fontSize:12, cursor:"pointer",
              textTransform:"uppercase", letterSpacing:0.5,
              fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600,
              background: tab===val ? "rgba(78,205,196,.09)" : "transparent",
              border:`1px solid ${tab===val?"#4ECDC4":"rgba(255,255,255,.09)"}`,
              color: tab===val ? "#4ECDC4" : "rgba(255,255,255,.38)",
            }}>
              {label}{val==="dashboard"&&pendingRequests.length>0?` (${pendingRequests.length})`:""}
            </button>
          ))}
        </div>
 
        {/* ── TAB: Dashboard ── */}
        {tab==="dashboard"&&(
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {/* Solicitudes */}
            <div style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <h3 style={{ color:"#fff", fontSize:14, fontFamily:"'Cinzel',serif" }}>Solicitudes de crédito</h3>
                {pendingRequests.length>0&&<span style={{ background:"rgba(255,140,0,.12)", border:"1px solid rgba(255,140,0,.28)", borderRadius:10, padding:"2px 8px", color:"#FF8C00", fontSize:11 }}>{pendingRequests.length} pendientes</span>}
              </div>
              {creditRequests.length===0
                ?<p style={{ color:"rgba(255,255,255,.18)", fontSize:13, textAlign:"center", padding:"20px 0" }}>Sin solicitudes</p>
                :<div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {creditRequests.map(req=>(
                    <div key={req.id} style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:8, padding:"9px 12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ flex:1 }}>
                          <p style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{req.userName}</p>
                          <p style={{ color:"rgba(255,255,255,.35)", fontSize:11 }}>{req.date}</p>
                        </div>
                        <span style={{ color:YELLOW, fontWeight:700, fontSize:14 }}>{req.amount} cr.</span>
                        {req.status==="pending"
                          ?<div style={{ display:"flex", gap:5 }}>
                            <button onClick={()=>approveCredit(req.id)} style={{ background:"rgba(0,200,83,.1)", border:"1px solid rgba(0,200,83,.28)", color:"#00C853", padding:"4px 9px", borderRadius:5, cursor:"pointer", fontSize:12 }}>✓</button>
                            <button onClick={()=>rejectCredit(req.id)} style={{ background:"rgba(255,50,50,.08)", border:"1px solid rgba(255,50,50,.22)", color:"#FF6464", padding:"4px 9px", borderRadius:5, cursor:"pointer", fontSize:12 }}>✗</button>
                          </div>
                          :<span style={{ fontSize:12, color:req.status==="approved"?"#00C853":"#FF6464", fontWeight:600 }}>{req.status==="approved"?"Aprobada":"Rechazada"}</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
 
            {/* Crear rifa + cortito en dashboard */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"18px" }}>
                <h3 style={{ color:"#fff", fontSize:14, fontFamily:"'Cinzel',serif", marginBottom:14 }}>Crear rifa rápida</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <input value={newRifa.name} onChange={e=>setNewRifa(p=>({...p,name:e.target.value}))} placeholder="Nombre" style={inputStyle}/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <input value={newRifa.prize} onChange={e=>setNewRifa(p=>({...p,prize:e.target.value}))} placeholder="Premio" style={inputStyle}/>
                    <input type="number" value={newRifa.pricePerNumber} onChange={e=>setNewRifa(p=>({...p,pricePerNumber:+e.target.value}))} placeholder="Precio/número" style={inputStyle}/>
                  </div>
                  <button onClick={createRifa} disabled={!newRifa.name||!newRifa.prize} style={primaryBtn(newRifa.name&&newRifa.prize)}>Crear rifa</button>
                </div>
              </div>
              <div style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"18px" }}>
                <h3 style={{ color:"#fff", fontSize:14, fontFamily:"'Cinzel',serif", marginBottom:14 }}>Crear sorteo rápido</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <input value={newPlanilla.name} onChange={e=>setNewPlanilla(p=>({...p,name:e.target.value}))} placeholder="Nombre del sorteo" style={inputStyle}/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <input type="number" value={newPlanilla.prize} onChange={e=>setNewPlanilla(p=>({...p,prize:+e.target.value}))} placeholder="Premio (cr.)" style={inputStyle}/>
                    <input type="number" value={newPlanilla.timesOut} onChange={e=>setNewPlanilla(p=>({...p,timesOut:+e.target.value}))} placeholder="Sale N veces" style={inputStyle}/>
                  </div>
                  <button onClick={createPlanilla} disabled={!newPlanilla.name||!newPlanilla.prize} style={primaryBtn(newPlanilla.name&&newPlanilla.prize)}>Crear sorteo</button>
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* ── TAB: Usuarios ── */}
        {tab==="users"&&(
          <div style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, overflow:"hidden" }}>
            <div style={{ padding:"18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ color:"#fff", fontSize:14, fontFamily:"'Cinzel',serif" }}>Usuarios</h3>
              <button onClick={createUser} disabled={!newUser.username||!newUser.password||!newUser.name} style={primaryBtn(newUser.username&&newUser.password&&newUser.name)}>+ Crear usuario</button>
            </div>
            <div style={{ padding:"0 18px 18px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
                <input value={newUser.name}     onChange={e=>setNewUser(p=>({...p,name:e.target.value}))}     placeholder="Nombre"      style={inputStyle}/>
                <input value={newUser.username} onChange={e=>setNewUser(p=>({...p,username:e.target.value}))} placeholder="Usuario"     style={inputStyle}/>
                <input type="password" value={newUser.password} onChange={e=>setNewUser(p=>({...p,password:e.target.value}))} placeholder="Contraseña" style={inputStyle}/>
              </div>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                  {["","Nombre","Usuario","Rol","Créditos","Acciones"].map(h=>(
                    <th key={h} style={{ padding:"11px 16px", textAlign:"left", color:"rgba(255,255,255,.3)", fontSize:10, letterSpacing:2, textTransform:"uppercase", fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user,i)=>(
                  <tr key={user.id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)", background:i%2?"rgba(255,255,255,.01)":"transparent" }}>
                    <td style={{ padding:"10px 16px", fontSize:18 }}>{user.avatar}</td>
                    <td style={{ padding:"10px 16px", color:"#fff", fontSize:13, fontWeight:600 }}>{user.name}</td>
                    <td style={{ padding:"10px 16px", color:"rgba(255,255,255,.45)", fontSize:12 }}>{user.username}</td>
                    <td style={{ padding:"10px 16px" }}>
                      <span style={{ padding:"2px 8px", borderRadius:10, fontSize:10, background:user.isAdmin?"rgba(78,205,196,.1)":"rgba(255,255,255,.04)", border:`1px solid ${user.isAdmin?"rgba(78,205,196,.28)":"rgba(255,255,255,.09)"}`, color:user.isAdmin?"#4ECDC4":"rgba(255,255,255,.38)" }}>
                        {user.isAdmin?"Admin":"Jugador"}
                      </span>
                    </td>
                    <td style={{ padding:"10px 16px" }}>
                      {editCredits.id===user.id
                        ?<div style={{ display:"flex", gap:5, alignItems:"center" }}>
                          <input type="number" value={editCredits.val} onChange={e=>setEditCredits(p=>({...p,val:e.target.value}))}
                            onKeyDown={e=>{if(e.key==="Enter"){const v=parseInt(editCredits.val);if(!isNaN(v)&&v>=0){setDb(prev=>({...prev,users:prev.users.map(u=>u.id===user.id?{...u,credits:v}:u)}));toast("Créditos actualizados","success");}setEditCredits({id:null,val:""});}}}
                            style={{...inputStyle,width:80,padding:"3px 8px",fontSize:12}} autoFocus/>
                          <button onClick={()=>{const v=parseInt(editCredits.val);if(!isNaN(v)&&v>=0){setDb(prev=>({...prev,users:prev.users.map(u=>u.id===user.id?{...u,credits:v}:u)}));toast("Créditos actualizados","success");}setEditCredits({id:null,val:""});}} style={{ background:"rgba(0,200,83,.1)",border:"1px solid rgba(0,200,83,.28)",color:"#00C853",padding:"3px 7px",borderRadius:4,cursor:"pointer",fontSize:12 }}>✓</button>
                          <button onClick={()=>setEditCredits({id:null,val:""})} style={{ background:"rgba(255,50,50,.08)",border:"1px solid rgba(255,50,50,.22)",color:"#FF6464",padding:"3px 7px",borderRadius:4,cursor:"pointer",fontSize:12 }}>✗</button>
                        </div>
                        :<span style={{ color:YELLOW, fontWeight:700, fontSize:14 }}>{user.credits.toLocaleString()}</span>
                      }
                    </td>
                    <td style={{ padding:"10px 16px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={()=>setEditCredits({id:user.id,val:String(user.credits)})} style={{ background:"rgba(255,215,0,.07)",border:"1px solid rgba(255,215,0,.2)",color:YELLOW,padding:"5px 10px",borderRadius:5,cursor:"pointer",fontSize:13 }}>💰</button>
                        <button onClick={()=>setEditUser({...user})} style={{ background:"rgba(78,205,196,.07)",border:"1px solid rgba(78,205,196,.2)",color:"#4ECDC4",padding:"5px 10px",borderRadius:5,cursor:"pointer",fontSize:13 }}>✏</button>
                        {!user.isAdmin&&<button onClick={()=>setDeleteConfirm({type:"user",id:user.id})} style={{ background:"rgba(255,50,50,.07)",border:"1px solid rgba(255,50,50,.2)",color:"#FF6464",padding:"5px 10px",borderRadius:5,cursor:"pointer",fontSize:13 }}>🗑</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
 
        {/* ── TAB: Rifas ── */}
        {tab==="rifas"&&(
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {/* Formulario de creación */}
            <div style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"18px", marginBottom:8 }}>
              <h3 style={{ color:"#fff", fontSize:14, fontFamily:"'Cinzel',serif", marginBottom:12 }}>Crear rifa</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:8 }}>
                <input value={newRifa.name}     onChange={e=>setNewRifa(p=>({...p,name:e.target.value}))}     placeholder="Nombre" style={inputStyle}/>
                <input value={newRifa.subtitle} onChange={e=>setNewRifa(p=>({...p,subtitle:e.target.value}))} placeholder="Descripción" style={inputStyle}/>
                <input value={newRifa.icon}     onChange={e=>setNewRifa(p=>({...p,icon:e.target.value}))}     placeholder="Ícono" style={inputStyle}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                <input value={newRifa.prize}           onChange={e=>setNewRifa(p=>({...p,prize:e.target.value}))}            placeholder="Premio" style={inputStyle}/>
                <input type="number" value={newRifa.pricePerNumber} onChange={e=>setNewRifa(p=>({...p,pricePerNumber:+e.target.value}))} placeholder="Precio/número" style={inputStyle}/>
                <input type="number" value={newRifa.totalNumbers}   onChange={e=>setNewRifa(p=>({...p,totalNumbers:+e.target.value}))}   placeholder="Total números" style={inputStyle}/>
              </div>
              <button onClick={createRifa} disabled={!newRifa.name||!newRifa.prize} style={{...primaryBtn(newRifa.name&&newRifa.prize),marginTop:10,width:"100%"}}>Crear rifa</button>
            </div>
            {rifas.map(rifa=>{
              const sold = Object.values(rifa.numbers).filter(n=>n.status==="reservado").length;
              const total = rifa.totalNumbers||100;
              const soldNums = Object.entries(rifa.numbers).filter(([_,n])=>n.status==="reservado").map(([num])=>num);
              return (
                <div key={rifa.id} style={{ background:"#0d0d14", border:`1px solid ${rifa.status==="finished"?"rgba(255,215,0,.2)":"rgba(255,255,255,.07)"}`, borderRadius:10, padding:"13px 18px", display:"flex", alignItems:"center", gap:14 }}>
                  <span style={{ fontSize:24 }}>{rifa.icon}</span>
                  <div style={{ flex:1 }}>
                    <h4 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:13, marginBottom:2 }}>{rifa.name}</h4>
                    <p style={{ color:"rgba(255,255,255,.38)", fontSize:12 }}>{rifa.pricePerNumber} cr./número · {rifa.prize} · {total} números</p>
                  </div>
                  {[{label:"Vendidos",val:sold,c:"#00C853"},{label:"Libres",val:total-sold,c:"rgba(255,255,255,.5)"},{label:"Estado",val:rifa.status==="active"?"Activa":"🏆 Sorteada",c:rifa.status==="active"?"#4ECDC4":YELLOW}].map(s=>(
                    <div key={s.label} style={{ textAlign:"center", minWidth:70 }}>
                      <p style={{ color:s.c, fontWeight:700, fontSize:15 }}>{s.val}</p>
                      <p style={{ color:"rgba(255,255,255,.28)", fontSize:10 }}>{s.label}</p>
                    </div>
                  ))}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {rifa.status==="active"&&<button onClick={()=>setEditRifa({...rifa})} style={{ ...btnStyle, background:"rgba(78,205,196,.07)", border:"1px solid rgba(78,205,196,.2)", color:"#4ECDC4" }}>✏ Editar</button>}
                    {rifa.status==="active"&&soldNums.length>0&&<button onClick={()=>startDraw(rifa)} style={{ ...btnStyle, background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`, border:"none", color:"#000", fontWeight:700 }}>🎡 Sortear</button>}
                    <button onClick={()=>setResetConfirm({type:"rifa",id:rifa.id})} style={{ ...btnStyle, background:"rgba(0,200,83,.07)", border:"1px solid rgba(0,200,83,.2)", color:"#00C853" }}>🔄 Reiniciar</button>
                    <button onClick={()=>setDeleteConfirm({type:"rifa",id:rifa.id})} style={{ ...btnStyle, background:"rgba(255,50,50,.07)", border:"1px solid rgba(255,50,50,.2)", color:"#FF6464" }}>🗑 Eliminar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
 
        {/* ── TAB: Cortitos ── */}
        {tab==="cortitos"&&(
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            <div style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"18px", marginBottom:8 }}>
              <h3 style={{ color:"#fff", fontSize:14, fontFamily:"'Cinzel',serif", marginBottom:12 }}>Crear cortito</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                <input value={newCortito.name}        onChange={e=>setNewCortito(p=>({...p,name:e.target.value}))}        placeholder="Nombre" style={inputStyle}/>
                <input value={newCortito.description} onChange={e=>setNewCortito(p=>({...p,description:e.target.value}))} placeholder="Descripción" style={inputStyle}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
                <input type="number" value={newCortito.costPerSlot}    onChange={e=>setNewCortito(p=>({...p,costPerSlot:+e.target.value}))}    placeholder="Costo/slot" style={inputStyle}/>
                <input type="number" value={newCortito.totalSlots}     onChange={e=>setNewCortito(p=>({...p,totalSlots:+e.target.value}))}     placeholder="Slots" style={inputStyle}/>
                <input type="number" value={newCortito.casillerosToWin}onChange={e=>setNewCortito(p=>({...p,casillerosToWin:+e.target.value}))}placeholder="Casilleros" style={inputStyle}/>
                <input type="number" value={newCortito.bolMin}         onChange={e=>setNewCortito(p=>({...p,bolMin:+e.target.value}))}         placeholder="Bola mín" style={inputStyle}/>
                <input type="number" value={newCortito.bolMax}         onChange={e=>setNewCortito(p=>({...p,bolMax:+e.target.value}))}         placeholder="Bola máx" style={inputStyle}/>
              </div>
              <button onClick={createCortito} disabled={!newCortito.name} style={{...primaryBtn(newCortito.name),marginTop:10,width:"100%"}}>Crear cortito</button>
            </div>
            {cortitos.map(cortito=>(
              <div key={cortito.id} style={{ background:"#0d0d14", border:`1px solid ${cortito.status==="finished"?"rgba(255,215,0,.2)":"rgba(255,255,255,.07)"}`, borderRadius:10, padding:"13px 18px", display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontSize:24 }}>📋</span>
                <div style={{ flex:1 }}>
                  <h4 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:13, marginBottom:2 }}>{cortito.name}</h4>
                  <p style={{ color:"rgba(255,255,255,.38)", fontSize:12 }}>{cortito.description} · {cortito.costPerSlot} cr./slot · {cortito.totalSlots} slots</p>
                </div>
                {[{label:"Ocupados",val:cortito.players.length,c:"#00C853"},{label:"Libres",val:cortito.totalSlots-cortito.players.length,c:"rgba(255,255,255,.5)"},{label:"Estado",val:cortito.status==="open"?"Abierto":"🏆 Finalizado",c:cortito.status==="open"?"#4ECDC4":YELLOW}].map(s=>(
                  <div key={s.label} style={{ textAlign:"center", minWidth:70 }}>
                    <p style={{ color:s.c, fontWeight:700, fontSize:15 }}>{s.val}</p>
                    <p style={{ color:"rgba(255,255,255,.28)", fontSize:10 }}>{s.label}</p>
                  </div>
                ))}
                <div style={{ display:"flex", gap:6 }}>
                  {cortito.status==="open"&&<button onClick={()=>setEditCortito({...cortito})} style={{ ...btnStyle, background:"rgba(78,205,196,.07)", border:"1px solid rgba(78,205,196,.2)", color:"#4ECDC4" }}>✏ Editar</button>}
                  <button onClick={()=>setResetConfirm({type:"cortito",id:cortito.id})} style={{ ...btnStyle, background:"rgba(0,200,83,.07)", border:"1px solid rgba(0,200,83,.2)", color:"#00C853" }}>🔄 Reiniciar</button>
                  <button onClick={()=>setDeleteConfirm({type:"cortito",id:cortito.id})} style={{ ...btnStyle, background:"rgba(255,50,50,.07)", border:"1px solid rgba(255,50,50,.2)", color:"#FF6464" }}>🗑 Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
 
        {/* ── TAB: Planillas / Sorteos ── */}
        {tab==="planillas"&&(
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {/* Formulario crear */}
            <div style={{ background:"#0d0d14", border:`1px solid ${PURPLE}33`, borderRadius:12, padding:"18px", marginBottom:8 }}>
              <h3 style={{ color:PURPLE_L, fontSize:14, fontFamily:"'Cinzel',serif", marginBottom:12 }}>⭐ Crear sorteo</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
                <input value={newPlanilla.name}     onChange={e=>setNewPlanilla(p=>({...p,name:e.target.value}))}     placeholder="Nombre del sorteo" style={inputStyle}/>
                <input value={newPlanilla.subtitle} onChange={e=>setNewPlanilla(p=>({...p,subtitle:e.target.value}))} placeholder="Subtítulo (ej: Sale 7 veces)" style={inputStyle}/>
                <input type="number" value={newPlanilla.prize} onChange={e=>setNewPlanilla(p=>({...p,prize:+e.target.value}))} placeholder="Premio total (cr.)" style={inputStyle}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:8 }}>
                <input type="number" value={newPlanilla.timesOut}      onChange={e=>setNewPlanilla(p=>({...p,timesOut:+e.target.value}))}              placeholder="Sale N veces"    style={inputStyle}/>
                <input type="number" value={newPlanilla.totalNumbers}  onChange={e=>setNewPlanilla(p=>({...p,totalNumbers:+e.target.value}))}           placeholder="Total números"   style={inputStyle}/>
                <input type="number" value={newPlanilla.prices.cuarto} onChange={e=>setNewPlanilla(p=>({...p,prices:{...p.prices,cuarto:+e.target.value}}))} placeholder="Precio cuarto"   style={{...inputStyle,borderColor:`${FRAC_COLORS.cuarto}44`}}/>
                <input type="number" value={newPlanilla.prices.medio}  onChange={e=>setNewPlanilla(p=>({...p,prices:{...p.prices,medio:+e.target.value}}))}  placeholder="Precio medio"    style={{...inputStyle,borderColor:`${FRAC_COLORS.medio}44`}}/>
                <input type="number" value={newPlanilla.prices.entero} onChange={e=>setNewPlanilla(p=>({...p,prices:{...p.prices,entero:+e.target.value}}))} placeholder="Precio entero"   style={{...inputStyle,borderColor:`${FRAC_COLORS.entero}44`}}/>
              </div>
              <button onClick={createPlanilla} disabled={!newPlanilla.name||!newPlanilla.prize} style={{...primaryBtn(newPlanilla.name&&newPlanilla.prize),marginTop:10,width:"100%"}}>
                Crear sorteo
              </button>
            </div>
 
            {/* Lista de planillas */}
            {(planillas||[]).map(p=>{
              const { total, used, pct } = planillaStats(p);
              const statusColor = p.status==="finished"?"#00C853":p.status==="running"?YELLOW:PURPLE_L;
              const statusLabel = p.status==="finished"?"Sorteado":p.status==="running"?"Sorteando…":"Abierto";
              return (
                <div key={p.id} style={{ background:"#0d0d14", border:`2px solid ${p.status==="finished"?"rgba(0,200,83,.25)":p.status==="running"?`${YELLOW}55`:`${PURPLE}33`}`, borderRadius:12, padding:"16px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                    <span style={{ fontSize:24 }}>⭐</span>
                    <div style={{ flex:1, minWidth:200 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:3 }}>
                        <h4 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:13 }}>{p.name}</h4>
                        <span style={{ padding:"2px 8px", borderRadius:8, fontSize:10, fontWeight:700, background:`${statusColor}18`, border:`1px solid ${statusColor}44`, color:statusColor }}>{statusLabel}</span>
                      </div>
                      <p style={{ color:"rgba(255,255,255,.38)", fontSize:12 }}>
                        ⭐ {p.subtitle} · Premio: <strong style={{ color:YELLOW }}>{p.prize?.toLocaleString()} cr.</strong> · {p.totalNumbers} números · Sale {p.timesOut}x
                      </p>
                      {/* Precios fracción */}
                      <div style={{ display:"flex", gap:8, marginTop:6 }}>
                        {["cuarto","medio","entero"].map(k=>(
                          <span key={k} style={{ padding:"2px 8px", borderRadius:6, fontSize:10, fontWeight:700, background:`${FRAC_COLORS[k]}18`, border:`1px solid ${FRAC_COLORS[k]}44`, color:FRAC_COLORS[k] }}>
                            {k.charAt(0).toUpperCase()+k.slice(1)}: {p.prices?.[k]} cr.
                          </span>
                        ))}
                      </div>
                    </div>
 
                    {/* Stats */}
                    {[{label:"Vendidos",val:used,c:"#00C853"},{label:"Total",val:total,c:"rgba(255,255,255,.5)"},{label:"Avance",val:`${pct}%`,c:PURPLE_L}].map(s=>(
                      <div key={s.label} style={{ textAlign:"center", minWidth:60 }}>
                        <p style={{ color:s.c, fontWeight:700, fontSize:15 }}>{s.val}</p>
                        <p style={{ color:"rgba(255,255,255,.28)", fontSize:10 }}>{s.label}</p>
                      </div>
                    ))}
 
                    {/* Barra de progreso */}
                    <div style={{ width:"100%", marginTop:8 }}>
                      <div style={{ height:4, background:"rgba(255,255,255,.06)", borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${PURPLE},${PURPLE_L})`, borderRadius:2, transition:"width .4s" }}/>
                      </div>
                    </div>
 
                    {/* Ganador si hay */}
                    {p.winner&&(
                      <div style={{ width:"100%", padding:"8px 12px", borderRadius:8, background:`${YELLOW}11`, border:`1px solid ${YELLOW}33`, color:YELLOW, fontSize:12, fontWeight:700 }}>
                        🏆 Ganador: Número {p.winner.number} · {p.winner.slots?.filter(Boolean).map(s=>`${s.userName} (${s.fraccion})`).join(", ")}
                      </div>
                    )}
 
                    {/* Acciones */}
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {p.status==="open"&&<button onClick={()=>setEditPlanilla({...p,prices:{...p.prices}})} style={{ ...btnStyle, background:"rgba(124,77,255,.07)", border:`1px solid ${PURPLE}44`, color:PURPLE_L }}>✏ Editar</button>}
                      <button onClick={()=>setResetConfirm({type:"planilla",id:p.id})} style={{ ...btnStyle, background:"rgba(0,200,83,.07)", border:"1px solid rgba(0,200,83,.2)", color:"#00C853" }}>🔄 Reiniciar</button>
                      <button onClick={()=>setDeleteConfirm({type:"planilla",id:p.id})} style={{ ...btnStyle, background:"rgba(255,50,50,.07)", border:"1px solid rgba(255,50,50,.2)", color:"#FF6464" }}>🗑 Eliminar</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
 
        {/* ── MODALES ── */}
 
        {/* Editar Usuario */}
        {editUser&&(
          <div onClick={e=>e.target===e.currentTarget&&setEditUser(null)} style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
            <div style={{ width:"min(420px,100%)",background:"#0d0d14",border:"1px solid rgba(255,255,255,.12)",borderRadius:14,padding:"28px",boxShadow:"0 20px 60px rgba(0,0,0,.6)" }}>
              <h3 style={{ fontFamily:"'Cinzel',serif",color:"#fff",fontSize:16,marginBottom:18 }}>Editar Usuario</h3>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {[{label:"Nombre",key:"name"},{label:"Usuario",key:"username"},{label:"Contraseña",key:"password"}].map(f=>(
                  <div key={f.key}><label style={{ color:"rgba(255,255,255,.4)",fontSize:11,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5 }}>{f.label}</label>
                  <input value={editUser[f.key]} onChange={e=>setEditUser(p=>({...p,[f.key]:e.target.value}))} style={inputStyle}/></div>
                ))}
                <div><label style={{ color:"rgba(255,255,255,.4)",fontSize:11,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:5 }}>Créditos</label>
                <input type="number" value={editUser.credits} onChange={e=>setEditUser(p=>({...p,credits:parseInt(e.target.value)||0}))} style={inputStyle}/></div>
              </div>
              <div style={{ display:"flex",gap:10,marginTop:20 }}>
                <button onClick={()=>setEditUser(null)} style={{ flex:1,padding:"10px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:8,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13 }}>Cancelar</button>
                <button onClick={saveEditUser} style={{ flex:2,padding:"10px",background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,border:"none",borderRadius:8,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Cinzel',serif" }}>Guardar</button>
              </div>
            </div>
          </div>
        )}
 
        {/* Editar Rifa */}
        {editRifa&&(
          <div onClick={e=>e.target===e.currentTarget&&setEditRifa(null)} style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
            <div style={{ width:"min(420px,100%)",background:"#0d0d14",border:"1px solid rgba(255,255,255,.12)",borderRadius:14,padding:"28px" }}>
              <h3 style={{ fontFamily:"'Cinzel',serif",color:"#fff",fontSize:16,marginBottom:18 }}>Editar Rifa</h3>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                <input value={editRifa.name}     onChange={e=>setEditRifa(p=>({...p,name:e.target.value}))}     placeholder="Nombre" style={inputStyle}/>
                <input value={editRifa.subtitle} onChange={e=>setEditRifa(p=>({...p,subtitle:e.target.value}))} placeholder="Descripción" style={inputStyle}/>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <input value={editRifa.prize} onChange={e=>setEditRifa(p=>({...p,prize:e.target.value}))} placeholder="Premio" style={inputStyle}/>
                  <input type="number" value={editRifa.pricePerNumber} onChange={e=>setEditRifa(p=>({...p,pricePerNumber:+e.target.value}))} placeholder="Costo/número" style={inputStyle}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <input value={editRifa.icon} onChange={e=>setEditRifa(p=>({...p,icon:e.target.value}))} placeholder="Ícono" style={inputStyle}/>
                  <input type="number" value={editRifa.totalNumbers} onChange={e=>setEditRifa(p=>({...p,totalNumbers:+e.target.value}))} placeholder="Cant. números" style={inputStyle}/>
                </div>
              </div>
              <div style={{ display:"flex",gap:10,marginTop:20 }}>
                <button onClick={()=>setEditRifa(null)} style={{ flex:1,padding:"10px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:8,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13 }}>Cancelar</button>
                <button onClick={saveEditRifa} style={{ flex:2,padding:"10px",background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,border:"none",borderRadius:8,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Cinzel',serif" }}>Guardar</button>
              </div>
            </div>
          </div>
        )}
 
        {/* Editar Cortito */}
        {editCortito&&(
          <div onClick={e=>e.target===e.currentTarget&&setEditCortito(null)} style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
            <div style={{ width:"min(440px,100%)",background:"#0d0d14",border:"1px solid rgba(255,255,255,.12)",borderRadius:14,padding:"28px" }}>
              <h3 style={{ fontFamily:"'Cinzel',serif",color:"#fff",fontSize:16,marginBottom:18 }}>Editar Cortito</h3>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                <input value={editCortito.name} onChange={e=>setEditCortito(p=>({...p,name:e.target.value}))} placeholder="Nombre" style={inputStyle}/>
                <input value={editCortito.description} onChange={e=>setEditCortito(p=>({...p,description:e.target.value}))} placeholder="Descripción" style={inputStyle}/>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <input type="number" value={editCortito.costPerSlot} onChange={e=>setEditCortito(p=>({...p,costPerSlot:+e.target.value}))} placeholder="Costo/slot" style={inputStyle}/>
                  <input type="number" value={editCortito.totalSlots} onChange={e=>setEditCortito(p=>({...p,totalSlots:+e.target.value}))} placeholder="Total slots" style={inputStyle}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
                  <input type="number" value={editCortito.casillerosToWin} onChange={e=>setEditCortito(p=>({...p,casillerosToWin:+e.target.value}))} placeholder="Casilleros" style={inputStyle}/>
                  <input type="number" value={editCortito.bolMin} onChange={e=>setEditCortito(p=>({...p,bolMin:+e.target.value}))} placeholder="Bola mín" style={inputStyle}/>
                  <input type="number" value={editCortito.bolMax} onChange={e=>setEditCortito(p=>({...p,bolMax:+e.target.value}))} placeholder="Bola máx" style={inputStyle}/>
                </div>
              </div>
              <div style={{ display:"flex",gap:10,marginTop:20 }}>
                <button onClick={()=>setEditCortito(null)} style={{ flex:1,padding:"10px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:8,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13 }}>Cancelar</button>
                <button onClick={saveEditCortito} style={{ flex:2,padding:"10px",background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,border:"none",borderRadius:8,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Cinzel',serif" }}>Guardar</button>
              </div>
            </div>
          </div>
        )}
 
        {/* Editar Planilla */}
        {editPlanilla&&(
          <div onClick={e=>e.target===e.currentTarget&&setEditPlanilla(null)} style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
            <div style={{ width:"min(480px,100%)",background:"#0d0d14",border:`1px solid ${PURPLE}44`,borderRadius:14,padding:"28px" }}>
              <h3 style={{ fontFamily:"'Cinzel',serif",color:PURPLE_L,fontSize:16,marginBottom:18 }}>Editar Sorteo</h3>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                <input value={editPlanilla.name} onChange={e=>setEditPlanilla(p=>({...p,name:e.target.value}))} placeholder="Nombre" style={inputStyle}/>
                <input value={editPlanilla.subtitle} onChange={e=>setEditPlanilla(p=>({...p,subtitle:e.target.value}))} placeholder="Subtítulo" style={inputStyle}/>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
                  <input type="number" value={editPlanilla.prize} onChange={e=>setEditPlanilla(p=>({...p,prize:+e.target.value}))} placeholder="Premio (cr.)" style={inputStyle}/>
                  <input type="number" value={editPlanilla.timesOut} onChange={e=>setEditPlanilla(p=>({...p,timesOut:+e.target.value}))} placeholder="Sale N veces" style={inputStyle}/>
                  <input type="number" value={editPlanilla.totalNumbers} onChange={e=>setEditPlanilla(p=>({...p,totalNumbers:+e.target.value}))} placeholder="Total números" style={inputStyle}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
                  <div><label style={{ color:FRAC_COLORS.cuarto,fontSize:10,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:4 }}>Precio cuarto</label>
                    <input type="number" value={editPlanilla.prices?.cuarto||0} onChange={e=>setEditPlanilla(p=>({...p,prices:{...p.prices,cuarto:+e.target.value}}))} style={{...inputStyle,borderColor:`${FRAC_COLORS.cuarto}55`}}/></div>
                  <div><label style={{ color:FRAC_COLORS.medio,fontSize:10,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:4 }}>Precio medio</label>
                    <input type="number" value={editPlanilla.prices?.medio||0} onChange={e=>setEditPlanilla(p=>({...p,prices:{...p.prices,medio:+e.target.value}}))} style={{...inputStyle,borderColor:`${FRAC_COLORS.medio}55`}}/></div>
                  <div><label style={{ color:FRAC_COLORS.entero,fontSize:10,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:4 }}>Precio entero</label>
                    <input type="number" value={editPlanilla.prices?.entero||0} onChange={e=>setEditPlanilla(p=>({...p,prices:{...p.prices,entero:+e.target.value}}))} style={{...inputStyle,borderColor:`${FRAC_COLORS.entero}55`}}/></div>
                </div>
              </div>
              <div style={{ display:"flex",gap:10,marginTop:20 }}>
                <button onClick={()=>setEditPlanilla(null)} style={{ flex:1,padding:"10px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:8,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13 }}>Cancelar</button>
                <button onClick={saveEditPlanilla} style={{ flex:2,padding:"10px",background:`linear-gradient(135deg,${PURPLE},${PURPLE_L})`,border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Cinzel',serif" }}>Guardar</button>
              </div>
            </div>
          </div>
        )}
 
        {/* Confirmar eliminación */}
        {deleteConfirm&&(
          <div onClick={e=>e.target===e.currentTarget&&setDeleteConfirm(null)} style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
            <div style={{ width:"min(400px,100%)",background:"#0d0d14",border:"1px solid rgba(255,100,100,.28)",borderRadius:14,padding:"28px",textAlign:"center" }}>
              <h3 style={{ fontFamily:"'Cinzel',serif",color:"#FF6464",fontSize:16,marginBottom:10 }}>
                ¿Eliminar {deleteConfirm.type==="user"?"usuario":deleteConfirm.type==="rifa"?"rifa":deleteConfirm.type==="cortito"?"cortito":"sorteo"}?
              </h3>
              <p style={{ color:"rgba(255,255,255,.4)",fontSize:13,marginBottom:20 }}>Esta acción no se puede deshacer.</p>
              <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
                <button onClick={()=>setDeleteConfirm(null)} style={{ padding:"10px 20px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:8,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif" }}>Cancelar</button>
                <button onClick={()=>{
                  if(deleteConfirm.type==="user") deleteUser(deleteConfirm.id);
                  else if(deleteConfirm.type==="rifa") deleteRifa(deleteConfirm.id);
                  else if(deleteConfirm.type==="cortito") deleteCortito(deleteConfirm.id);
                  else if(deleteConfirm.type==="planilla") deletePlanilla(deleteConfirm.id);
                }} style={{ padding:"10px 20px",background:"rgba(255,50,50,.1)",border:"1px solid rgba(255,50,50,.28)",borderRadius:8,color:"#FF6464",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600 }}>Eliminar</button>
              </div>
            </div>
          </div>
        )}
 
        {/* Confirmar reinicio */}
        {resetConfirm&&(
          <div onClick={e=>e.target===e.currentTarget&&setResetConfirm(null)} style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
            <div style={{ width:"min(400px,100%)",background:"#0d0d14",border:"1px solid rgba(0,200,83,.28)",borderRadius:14,padding:"28px",textAlign:"center" }}>
              <h3 style={{ fontFamily:"'Cinzel',serif",color:"#00C853",fontSize:16,marginBottom:10 }}>
                ¿Reiniciar {resetConfirm.type==="rifa"?"rifa":resetConfirm.type==="cortito"?"cortito":"sorteo"}?
              </h3>
              <p style={{ color:"rgba(255,255,255,.4)",fontSize:13,marginBottom:20 }}>Se borrarán todos los participantes y el ganador actual.</p>
              <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
                <button onClick={()=>setResetConfirm(null)} style={{ padding:"10px 20px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:8,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif" }}>Cancelar</button>
                <button onClick={()=>{
                  if(resetConfirm.type==="rifa") resetRifa(resetConfirm.id);
                  else if(resetConfirm.type==="cortito") resetCortito(resetConfirm.id);
                  else if(resetConfirm.type==="planilla") resetPlanilla(resetConfirm.id);
                }} style={{ padding:"10px 20px",background:"rgba(0,200,83,.1)",border:"1px solid rgba(0,200,83,.28)",borderRadius:8,color:"#00C853",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600 }}>Reiniciar</button>
              </div>
            </div>
          </div>
        )}
 
        {/* Ruleta */}
        {showRoulette&&rifaToDraw&&(
          <div onClick={e=>e.target===e.currentTarget&&setShowRoulette(false)} style={{ position:"fixed",inset:0,zIndex:3000,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
            <div style={{ background:BG,border:`2px solid ${YELLOW}`,borderRadius:15,padding:20,maxWidth:800,width:"100%" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
                <h2 style={{ color:YELLOW,fontFamily:"'Cinzel',serif",fontSize:18 }}>Sorteo: {rifaToDraw.name}</h2>
                <button onClick={()=>setShowRoulette(false)} style={{ background:"transparent",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.5)",padding:"5px 10px",borderRadius:5,cursor:"pointer" }}>✕ Cerrar</button>
              </div>
              <Roulette numbers={rouletteNumbers} onClose={()=>setShowRoulette(false)} onWinnerSelected={handleWinnerSelected}/>
            </div>
          </div>
        )}
 
      </main>
    </div>
  );
}