import React, { useState, useEffect } from "react";
import { Header } from "../common/Header";
import { COLORS, FRAC_COLORS } from "../../utils/constants";
 
const { YELLOW, YELLOW2, BG } = COLORS;
 
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768);
  useEffect(() => { const h=()=>setM(window.innerWidth<768); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h); },[]);
  return m;
}
 
const GAMES = [
  {
    key: "rifas", icon:"🎫", color:YELLOW, title:"Rifas",
    tagline:"Comprá números y esperá el sorteo",
    steps:[
      { n:"1", icon:"💰", t:"Conseguí créditos", d:"Pedile créditos al supervisor o administrador desde tu perfil. Una vez aprobada la solicitud se acreditan automáticamente." },
      { n:"2", icon:"🎫", t:"Elegí una rifa",     d:"Explorá las rifas disponibles en el lobby. Cada una tiene precio por número, premio y cantidad limitada de boletos." },
      { n:"3", icon:"🔢", t:"Comprá números",     d:"Elegí uno o más números disponibles. Podés comprar varios al mismo tiempo. Los créditos se descuentan al confirmar." },
      { n:"4", icon:"🎰", t:"Sorteo automático",  d:"Cuando se venden todos los números, el bolillero se activa automáticamente. El ganador se elige al azar de inmediato." },
    ],
  },
  {
    key: "cortitos", icon:"⚡", color:"#FF8C00", title:"Cortitos",
    tagline:"Tomá slots y llenaste los casilleros primero",
    steps:[
      { n:"1", icon:"🎯", t:"Elegí tus slots",    d:"Cada planilla tiene slots numerados. Podés tomar varios slots en la misma planilla para tener más chances." },
      { n:"2", icon:"⚡", t:"Planilla llena",      d:"El sorteo arranca solo cuando todos los slots están ocupados. Cuantos más slots tenés, más chances de ganar." },
      { n:"3", icon:"🎲", t:"El bolillero sortea", d:"Se extraen números al azar. Cada vez que sale tu número de slot, ganás un casillero." },
      { n:"4", icon:"🏆", t:"Primero en llegar",  d:"El primer jugador que complete sus casilleros (ej: 5 veces) se lleva todo el pozo." },
    ],
  },
  {
    key: "planillas", icon:"🎰", color:"#A07BFF", title:"Planillas",
    tagline:"Comprá cuartos, medios o enteros de un número",
    steps:[
      { n:"1", icon:"🔢", t:"Elegí un número",    d:"La planilla tiene 12 números. Cada número tiene 4 cuartos disponibles para ser comprados." },
      { n:"2", icon:"🃏", t:"Elegí tu fracción",   d:"Cuarto (1/4): 25% del premio. Medio (2/4): 50%. Entero (4/4): 100% del premio. Un número puede tener hasta 4 dueños distintos." },
      { n:"3", icon:"🎰", t:"Sale N veces",        d:"El bolillero extrae números hasta que uno sale N veces (según la planilla). Ese número es el ganador." },
      { n:"4", icon:"💰", t:"Premio proporcional", d:"Cada dueño de un cuarto del número ganador cobra su parte: cuarto=25%, medio=50%, entero=100% del premio total." },
    ],
  },
];
 
function GameSection({ game, isMobile }) {
  return (
    <div style={{ marginBottom:32 }}>
      {/* Header del juego */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20,
        padding:"16px 20px", background:`${game.color}10`,
        border:`1px solid ${game.color}33`, borderRadius:16 }}>
        <div style={{ width:52, height:52, borderRadius:14, background:`${game.color}20`,
          border:`1px solid ${game.color}44`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:26, flexShrink:0 }}>{game.icon}</div>
        <div>
          <div style={{ fontFamily:"'Cinzel',serif", color:game.color, fontSize:20, fontWeight:900 }}>{game.title}</div>
          <div style={{ color:"rgba(255,255,255,.45)", fontSize:13 }}>{game.tagline}</div>
        </div>
      </div>
 
      {/* Pasos */}
      <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:10 }}>
        {game.steps.map(s => (
          <div key={s.n} style={{ background:"#0d0d1a", border:"1px solid rgba(255,255,255,.07)",
            borderRadius:12, padding:"16px", display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${game.color}15`,
              border:`1px solid ${game.color}33`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:20, flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ color:game.color, fontWeight:700, fontSize:14, marginBottom:4 }}>
                {s.n}. {s.t}
              </div>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:13, lineHeight:1.6 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
export function HowItWorksView({ currentUser, onBack, onLogout, onProfile, onLobby, ...headerProps }) {
  const isMobile = useIsMobile();
  const [activeGame, setActiveGame] = useState("rifas");
 
  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'Barlow Condensed',sans-serif" }}>
      <Header {...headerProps} currentUser={currentUser} onLogout={onLogout}
        onProfile={onProfile} onLobby={onLobby} onHowItWorks={() => {}} />
 
      <main style={{ maxWidth:860, margin:"0 auto", padding: isMobile?"16px 12px 28px":"36px 24px" }}>
 
        {/* Título */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:isMobile?22:30,
            fontWeight:900, color:"#fff", marginBottom:8 }}>¿Cómo funciona?</h1>
          <p style={{ color:"rgba(255,255,255,.35)", fontSize:14 }}>
            Tenemos 3 tipos de juegos. Aprendé cómo funciona cada uno.
          </p>
        </div>
 
        {/* Selector de juego */}
        <div style={{ display:"flex", gap:8, marginBottom:28, justifyContent:"center", flexWrap:"wrap" }}>
          {GAMES.map(g => (
            <button key={g.key} onClick={() => setActiveGame(g.key)} style={{
              padding:"10px 22px", borderRadius:10, fontSize:14, fontWeight:700,
              cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif",
              background: activeGame===g.key ? `${g.color}20` : "rgba(255,255,255,.03)",
              border:`2px solid ${activeGame===g.key ? g.color : "rgba(255,255,255,.1)"}`,
              color: activeGame===g.key ? g.color : "rgba(255,255,255,.4)",
              transition:"all .2s",
            }}>{g.icon} {g.title}</button>
          ))}
        </div>
 
        {/* Contenido del juego activo */}
        {GAMES.filter(g => g.key === activeGame).map(g => (
          <GameSection key={g.key} game={g} isMobile={isMobile} />
        ))}
 
        {/* Fracciones para planillas */}
        {activeGame === "planillas" && (
          <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.07)",
            borderRadius:14, padding:"20px", marginBottom:24 }}>
            <div style={{ color:"rgba(255,255,255,.5)", fontSize:12, textTransform:"uppercase",
              letterSpacing:1.5, marginBottom:14, fontWeight:700 }}>Tipos de fracción</div>
            <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"repeat(3,1fr)", gap:10 }}>
              {[
                { key:"cuarto", label:"Cuarto ▪", desc:"1/4 del número · Ganás el 25% del premio", extra:"El más accesible" },
                { key:"medio",  label:"Medio ◑",  desc:"2/4 del número · Ganás el 50% del premio", extra:"Equilibrio riesgo/ganancia" },
                { key:"entero", label:"Entero ⬛", desc:"4/4 del número · Ganás el 100% del premio",extra:"El que más paga" },
              ].map(f => (
                <div key={f.key} style={{ padding:"14px 16px", borderRadius:10,
                  background:`${FRAC_COLORS[f.key]}10`, border:`1px solid ${FRAC_COLORS[f.key]}33` }}>
                  <div style={{ color:FRAC_COLORS[f.key], fontWeight:700, fontSize:15, marginBottom:4 }}>{f.label}</div>
                  <div style={{ color:"rgba(255,255,255,.55)", fontSize:12, lineHeight:1.5, marginBottom:4 }}>{f.desc}</div>
                  <div style={{ color:`${FRAC_COLORS[f.key]}99`, fontSize:11 }}>{f.extra}</div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* Estados de números */}
        <div style={{ background:"rgba(255,215,0,.04)", border:"1px solid rgba(255,215,0,.15)",
          borderRadius:14, padding:"20px", marginBottom:24 }}>
          <div style={{ color:YELLOW, fontWeight:700, fontSize:15, marginBottom:14,
            display:"flex", alignItems:"center", gap:8 }}>💡 Créditos y solicitudes</div>
          <p style={{ color:"rgba(255,255,255,.55)", fontSize:14, lineHeight:1.7 }}>
            Los créditos son la moneda del sistema. Si no tenés suficientes para jugar,
            pedile a un <strong style={{ color:YELLOW }}>Supervisor</strong> o directamente al
            <strong style={{ color:YELLOW }}> Administrador</strong> que te acredite saldo.
            También podés enviar una solicitud formal desde tu perfil y el equipo la aprobará.
          </p>
        </div>
 
        {/* Botón */}
        <div style={{ textAlign:"center" }}>
          <button onClick={onBack} style={{
            background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,
            border:"none", borderRadius:10, padding:"14px 40px",
            color:"#000", fontSize:15, fontWeight:700, cursor:"pointer",
            fontFamily:"'Cinzel',serif", letterSpacing:1, textTransform:"uppercase",
            boxShadow:"0 4px 24px rgba(255,215,0,.3)",
          }}>✦ ¡Quiero jugar! ✦</button>
        </div>
      </main>
    </div>
  );
}