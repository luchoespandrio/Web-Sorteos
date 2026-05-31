import React, { useState, useEffect } from "react";
import { Header } from "../common/Header";
import { RifaCard } from "./RifaCard";
import { COLORS } from "../../utils/constants";
const { BG, YELLOW } = COLORS;
 
export function GameLobby({ currentUser, rifas, onSelectRifa, onLogout, onProfile, onAdmin, onHowItWorks, onCortitos, onPlanillas, onSupervisor, onLobby }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
 
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h); return () => window.removeEventListener("resize", h);
  }, []);
 
  const filtered = rifas.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==="todas" || (filter==="active"&&r.status==="active") || (filter==="finished"&&r.status==="finished");
    return matchSearch && matchFilter;
  });
 
  const role = currentUser?.role;
 
  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'Barlow Condensed',sans-serif" }}>
      <Header currentUser={currentUser} onLogout={onLogout} onProfile={onProfile} onLobby={onLobby||(() => {})} onHowItWorks={onHowItWorks} onCortitos={onCortitos} onPlanillas={onPlanillas} onSupervisor={onSupervisor} />
 
      <main style={{ maxWidth:1100, margin:"0 auto", padding: isMobile?"16px 12px":"32px 24px" }}>
        {/* Título */}
        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:isMobile?20:26, fontWeight:900, color:"#fff", marginBottom:4 }}>Rifas Disponibles</h1>
          <p style={{ color:"rgba(255,255,255,.35)", fontSize:14 }}>Elegí tu favorita y participá con increíbles premios</p>
        </div>
 
        {/* Filtros */}
        <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
          {/* Buscador */}
          <div style={{ flex:1, minWidth:160, position:"relative" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.3)", fontSize:14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar rifa..." style={{ width:"100%", background:"#0d0d14", border:"1px solid rgba(255,255,255,.09)", borderRadius:8, padding:"10px 12px 10px 36px", color:"#fff", fontSize:14, outline:"none", fontFamily:"'Barlow Condensed',sans-serif", boxSizing:"border-box" }} />
          </div>
 
          {/* Filtro estado */}
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,.09)", borderRadius:8, padding:"10px 14px", color:"rgba(255,255,255,.5)", fontSize:13, outline:"none", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif" }}>
            <option value="todas">Todas</option>
            <option value="active">Activas</option>
            <option value="finished">Sorteadas</option>
          </select>
 
          {/* Botones de sección */}
          {[
            { label:"⚡ Cortitos",  fn:onCortitos,  color:"rgba(255,215,0,.08)",    border:"rgba(255,215,0,.25)",    text:YELLOW           },
            { label:"🎰 Planillas", fn:onPlanillas, color:"rgba(124,77,255,.08)",   border:"rgba(124,77,255,.3)",    text:"#A07BFF"        },
          ].map(b => (
            <button key={b.label} onClick={b.fn} style={{ background:b.color, border:`1px solid ${b.border}`, color:b.text, borderRadius:8, padding:"10px 16px", cursor:"pointer", fontSize:13, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:.5, whiteSpace:"nowrap" }}>{b.label}</button>
          ))}
 
          {/* Botón Admin (solo admin) */}
          {(role==="admin"||currentUser?.isAdmin) && (
            <button onClick={onAdmin} style={{ background:"rgba(78,205,196,.08)", border:"1px solid rgba(78,205,196,.25)", color:"#4ECDC4", borderRadius:8, padding:"10px 16px", cursor:"pointer", fontSize:13, fontFamily:"'Barlow Condensed',sans-serif" }}>⚙ Admin</button>
          )}
 
          {/* Botón Panel Supervisor */}
          {role==="supervisor" && (
            <button onClick={onSupervisor} style={{ background:"rgba(124,77,255,.08)", border:"1px solid rgba(124,77,255,.3)", color:"#A07BFF", borderRadius:8, padding:"10px 16px", cursor:"pointer", fontSize:13, fontFamily:"'Barlow Condensed',sans-serif" }}>🎪 Mi Panel</button>
          )}
        </div>
 
        {/* Grid de rifas */}
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(250px,1fr))", gap:isMobile?12:18 }}>
          {filtered.map(rifa => (
            <RifaCard key={rifa.id} rifa={rifa} currentUser={currentUser} onSelect={onSelectRifa} />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 20px", color:"rgba(255,255,255,.2)", fontSize:15 }}>
              No hay rifas que coincidan con tu búsqueda
            </div>
          )}
        </div>
      </main>
    </div>
  );
}