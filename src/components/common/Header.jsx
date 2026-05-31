import React, { useState, useEffect } from "react";
import { COLORS } from "../../utils/constants";
const { YELLOW } = COLORS;
 
export function Header({ currentUser, onLogout, onProfile, onLobby, onHowItWorks, onCortitos, onPlanillas, onSupervisor }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
 
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
 
  const role = currentUser?.role;
  const navItems = [
    { label:"🏠 Inicio",     fn: onLobby      },
    { label:"⚡ Cortitos",   fn: onCortitos   },
    { label:"🎰 Planillas",  fn: onPlanillas  },
    { label:"🃏 Mis jugadas",fn: onProfile    },
    { label:"❓ Ayuda",      fn: onHowItWorks },
    ...(role === "supervisor" ? [{ label:"🎪 Mi Panel", fn: onSupervisor }] : []),
  ];
 
  const navBtn = (label, fn, extra = {}) => (
    <button key={label} onClick={() => { fn?.(); setMenuOpen(false); }} style={{
      background:"transparent", border:"none",
      color:"rgba(255,255,255,.65)", cursor:"pointer",
      fontSize: isMobile ? 15 : 13, letterSpacing:.5,
      padding: isMobile ? "14px 20px" : "6px 12px",
      borderRadius:6, fontFamily:"'Barlow Condensed',sans-serif",
      width: isMobile ? "100%" : "auto", textAlign: isMobile ? "left" : "center",
      ...extra,
    }}
      onMouseEnter={e => e.currentTarget.style.color="#fff"}
      onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,.65)"}
    >{label}</button>
  );
 
  return (
    <header style={{
      background:"#0d0d14", borderBottom:"1px solid rgba(255,215,0,.15)",
      padding:"0 16px", height:60, display:"flex", alignItems:"center",
      justifyContent:"space-between", position:"sticky", top:0, zIndex:200,
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0 }} onClick={onLobby}>
        <span style={{ fontSize:20 }}>👑</span>
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:isMobile?14:18, fontWeight:900, color:YELLOW, letterSpacing:3 }}>RIFAS</span>
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:isMobile?14:18, fontWeight:400, color:"#fff",  letterSpacing:3 }}>REAL</span>
      </div>
 
      {/* Nav desktop */}
      {!isMobile && (
        <nav style={{ display:"flex", gap:2, alignItems:"center" }}>
          {navItems.map(({label,fn}) => navBtn(label, fn))}
        </nav>
      )}
 
      {/* Derecha: créditos + user + (hamburger en mobile) */}
      <div style={{ display:"flex", alignItems:"center", gap:isMobile?8:12, flexShrink:0 }}>
        {/* Créditos */}
        <div style={{ display:"flex", alignItems:"center", gap:4,
          background:"rgba(255,215,0,.1)", border:"1px solid rgba(255,215,0,.3)",
          borderRadius:20, padding:"4px 10px" }}>
          <span style={{ color:YELLOW, fontWeight:700, fontSize:14 }}>{currentUser.credits.toLocaleString()}</span>
          <span style={{ color:"rgba(255,255,255,.4)", fontSize:11 }}>cr.</span>
        </div>
 
        {/* Avatar (no en mobile muy pequeño) */}
        {!isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer" }} onClick={onProfile}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,215,0,.12)", border:"1px solid rgba(255,215,0,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
              {currentUser.avatar}
            </div>
            <div>
              <div style={{ color:"rgba(255,255,255,.75)", fontSize:13, lineHeight:1 }}>{currentUser.name}</div>
              <div style={{ color:"rgba(255,255,255,.3)", fontSize:10, textTransform:"capitalize" }}>{role}</div>
            </div>
          </div>
        )}
 
        {/* Salir desktop */}
        {!isMobile && (
          <button onClick={onLogout} style={{ background:"transparent", border:"1px solid rgba(255,100,100,.3)", color:"#FF6464", padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"'Barlow Condensed',sans-serif" }}>
            Salir
          </button>
        )}
 
        {/* Hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:8, padding:"7px 10px", cursor:"pointer", color:"#fff", fontSize:18, lineHeight:1 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>
 
      {/* Menú mobile desplegable */}
      {isMobile && menuOpen && (
        <div style={{ position:"fixed", top:60, left:0, right:0, bottom:0, zIndex:199,
          background:"rgba(0,0,0,.6)", backdropFilter:"blur(4px)" }}
          onClick={() => setMenuOpen(false)}
        >
          <div style={{ background:"#0d0d14", borderBottom:"1px solid rgba(255,215,0,.12)", padding:"8px 0" }}
            onClick={e => e.stopPropagation()}>
            {/* Info usuario */}
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px 14px", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,215,0,.12)", border:"1px solid rgba(255,215,0,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                {currentUser.avatar}
              </div>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{currentUser.name}</div>
                <div style={{ color:"rgba(255,255,255,.35)", fontSize:11, textTransform:"capitalize" }}>{role}</div>
              </div>
            </div>
            {/* Links */}
            {navItems.map(({label,fn}) => navBtn(label, fn))}
            {/* Salir */}
            <div style={{ padding:"8px 20px", borderTop:"1px solid rgba(255,255,255,.06)", marginTop:4 }}>
              <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{ width:"100%", padding:"12px", background:"rgba(255,50,50,.08)", border:"1px solid rgba(255,50,50,.25)", borderRadius:8, color:"#FF6464", cursor:"pointer", fontSize:14, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600 }}>
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}