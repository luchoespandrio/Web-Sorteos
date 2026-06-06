import React, { useState, useEffect } from "react";
import { Header } from "../common/Header";
import { RifaCard } from "./RifaCard";
 
const V="#7c3aed"; const VL="#a855f7"; const OR="#f97316"; const YELLOW="#fbbf24"; const GR="#22c55e";
 
function useIsMobile() {
  const [m,setM]=useState(()=>window.innerWidth<768);
  useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  return m;
}
 
export function GameLobby({ currentUser, rifas, onSelectRifa, onLogout, onProfile, onAdmin, onHowItWorks, onCortitos, onPlanillas, onSupervisor, onLobby }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");
  const isMobile = useIsMobile();
 
  const filtered = rifas.filter(r => {
    const ms = r.name.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="todas"||(filter==="active"&&r.status==="active")||(filter==="finished"&&r.status==="finished");
    return ms&&mf;
  });
 
  const role = currentUser?.role;
  const activeRifas   = rifas.filter(r=>r.status==="active").length;
  const activeSort    = (rifas.filter(r=>r.status==="readyToDraw"||r.status==="running")).length;
 
  return (
    <div style={{ minHeight:"100vh", background:"#0d0b1e", fontFamily:"'Barlow Condensed',sans-serif" }}>
      <style>{`
        .rifacard:hover{transform:translateY(-6px)!important;border-color:rgba(168,85,247,.5)!important}
        .navbtn:hover{background:rgba(124,58,237,.2)!important;color:#fff!important}
        .gamebtn:hover{opacity:.85!important;transform:translateY(-2px)!important}
        @keyframes hero-pulse{0%,100%{opacity:.7}50%{opacity:1}}
        @keyframes float-badge{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      `}</style>
 
      <Header currentUser={currentUser} onLogout={onLogout} onProfile={onProfile}
        onLobby={onLobby||(() => {})} onHowItWorks={onHowItWorks}
        onCortitos={onCortitos} onPlanillas={onPlanillas} onSupervisor={onSupervisor} />
 
      {/* HERO BANNER */}
      <div style={{ position:"relative",overflow:"hidden",
        background:"linear-gradient(135deg,#0d0b1e 0%,#1a0a3e 40%,#2d0e5e 70%,#1a0a3e 100%)",
        padding:isMobile?"28px 16px 32px":"40px 40px 44px",marginBottom:0 }}>
        {/* Fondo decorativo */}
        <div style={{ position:"absolute",inset:0,pointerEvents:"none" }}>
          <div style={{ position:"absolute",top:"-20%",right:"-10%",width:"50%",height:"160%",
            background:"radial-gradient(ellipse,rgba(124,58,237,.15),transparent 70%)" }}/>
          <div style={{ position:"absolute",bottom:"-30%",left:"-5%",width:"40%",height:"120%",
            background:"radial-gradient(ellipse,rgba(249,115,22,.08),transparent 70%)" }}/>
          <div style={{ position:"absolute",inset:0,opacity:.018,
            backgroundImage:"linear-gradient(rgba(168,85,247,1) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,1) 1px,transparent 1px)",
            backgroundSize:"50px 50px" }}/>
        </div>
 
        <div style={{ position:"relative",maxWidth:1100,margin:"0 auto" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:"#ef4444",animation:"hero-pulse 1s ease-in-out infinite" }}/>
            <span style={{ color:"#ef4444",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase" }}>Sistema en vivo</span>
          </div>
          <h1 style={{ fontFamily:"'Cinzel',serif",fontSize:isMobile?28:44,fontWeight:900,
            color:"#fff",marginBottom:8,lineHeight:1.1 }}>
            Jugá y{" "}
            <span style={{ background:"linear-gradient(135deg,#a855f7,#f97316)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
              Ganá Grande
            </span>
          </h1>
          <p style={{ color:"rgba(255,255,255,.45)",fontSize:isMobile?14:16,marginBottom:20 }}>
            Rifas, Cortitos y Planillas · Todo en tiempo real
          </p>
 
          {/* Stats */}
          <div style={{ display:"flex",gap:isMobile?12:24,flexWrap:"wrap" }}>
            {[
              { icon:"🎫", val:activeRifas,  label:"Rifas activas",  color:YELLOW },
              { icon:"⚡", val:(rifas.filter(r=>r.status==="active"||r.status==="finished")).length, label:"Total rifas", color:VL },
              { icon:"🏆", val:activeSort, label:"Listas para sortear", color:OR },
            ].map(s=>(
              <div key={s.label} style={{ display:"flex",alignItems:"center",gap:8,
                background:"rgba(255,255,255,.05)",border:`1px solid ${s.color}33`,
                borderRadius:12,padding:"8px 14px" }}>
                <span style={{ fontSize:20 }}>{s.icon}</span>
                <div>
                  <div style={{ color:s.color,fontWeight:900,fontSize:20,lineHeight:1 }}>{s.val}</div>
                  <div style={{ color:"rgba(255,255,255,.3)",fontSize:10,textTransform:"uppercase",letterSpacing:.5 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* NAV DE SECCIONES */}
      <div style={{ background:"rgba(13,11,30,.95)",borderBottom:"1px solid rgba(124,58,237,.15)",
        position:"sticky",top:60,zIndex:50,padding:isMobile?"0 12px":"0 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",gap:4,overflowX:"auto",paddingBottom:0 }}>
          {[
            { icon:"🎫",label:"Rifas",    active:true,  color:YELLOW, fn:null },
            { icon:"⚡",label:"Cortitos", active:false, color:OR,     fn:onCortitos },
            { icon:"🎰",label:"Planillas",active:false, color:VL,     fn:onPlanillas },
          ].map(s=>(
            <button key={s.label} onClick={s.fn||undefined} className="navbtn" style={{
              padding:"14px 20px",background:"transparent",border:"none",
              borderBottom:`2px solid ${s.active?"#fff":"transparent"}`,
              color:s.active?"#fff":"rgba(255,255,255,.45)",
              cursor:s.fn?"pointer":"default",fontSize:14,fontWeight:700,
              fontFamily:"'Barlow Condensed',sans-serif",whiteSpace:"nowrap",
              display:"flex",alignItems:"center",gap:6,transition:"all .2s",
            }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>
 
      <main style={{ maxWidth:1100,margin:"0 auto",padding:isMobile?"16px 12px 28px":"28px 24px" }}>
 
        {/* ACCESOS RÁPIDOS a los 3 juegos */}
        <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:12,marginBottom:28 }}>
          {[
            { icon:"⚡",title:"Cortitos",desc:"Completá casilleros y ganá el pozo",
              color:OR,grad:"linear-gradient(135deg,#7c2d12,#1e0a00)",fn:onCortitos },
            { icon:"🎰",title:"Planillas",desc:"Comprá cuartos, medios o enteros",
              color:VL,grad:"linear-gradient(135deg,#3b0764,#0d0b1e)",fn:onPlanillas },
            { icon:"❓",title:"¿Cómo funciona?",desc:"Aprendé las reglas de cada juego",
              color:"#06b6d4",grad:"linear-gradient(135deg,#0c4a6e,#0d0b1e)",fn:onHowItWorks },
          ].map(s=>(
            <button key={s.title} onClick={s.fn} className="gamebtn" style={{
              background:s.grad,border:`1px solid ${s.color}33`,borderRadius:16,
              padding:"18px 20px",cursor:"pointer",textAlign:"left",
              display:"flex",alignItems:"center",gap:14,transition:"all .2s",
              fontFamily:"'Barlow Condensed',sans-serif",
            }}>
              <div style={{ width:48,height:48,borderRadius:12,background:`${s.color}22`,
                border:`1px solid ${s.color}44`,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:24,flexShrink:0 }}>{s.icon}</div>
              <div>
                <div style={{ color:s.color,fontWeight:700,fontSize:16,marginBottom:2 }}>{s.title}</div>
                <div style={{ color:"rgba(255,255,255,.4)",fontSize:12 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
 
        {/* FILTROS RIFAS */}
        <div style={{ display:"flex",gap:10,marginBottom:20,alignItems:"center",flexWrap:"wrap" }}>
          <h2 style={{ fontFamily:"'Cinzel',serif",color:"#fff",fontSize:18,fontWeight:700,marginRight:8 }}>
            🎫 Rifas Disponibles
          </h2>
          <div style={{ flex:1,minWidth:140,position:"relative" }}>
            <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
              color:"rgba(255,255,255,.3)",fontSize:14 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..."
              style={{ width:"100%",background:"rgba(255,255,255,.05)",
                border:"1px solid rgba(124,58,237,.2)",borderRadius:9,
                padding:"9px 12px 9px 36px",color:"#fff",fontSize:13,outline:"none",
                fontFamily:"'Barlow Condensed',sans-serif",boxSizing:"border-box" }}/>
          </div>
          {["todas","active","finished"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",transition:"all .2s",
              background:filter===f?`${V}25`:"transparent",
              border:`1px solid ${filter===f?VL:"rgba(255,255,255,.1)"}`,
              color:filter===f?VL:"rgba(255,255,255,.38)",
            }}>
              {f==="todas"?"Todas":f==="active"?"Activas":"Sorteadas"}
            </button>
          ))}
          {(role==="admin"||currentUser?.isAdmin)&&(
            <button onClick={onAdmin} style={{ padding:"8px 16px",borderRadius:8,fontSize:12,
              fontWeight:700,cursor:"pointer",background:"rgba(124,58,237,.12)",
              border:"1px solid rgba(124,58,237,.3)",color:VL,
              fontFamily:"'Barlow Condensed',sans-serif" }}>⚙ Admin</button>
          )}
          {role==="supervisor"&&(
            <button onClick={onSupervisor} style={{ padding:"8px 16px",borderRadius:8,fontSize:12,
              fontWeight:700,cursor:"pointer",background:"rgba(249,115,22,.1)",
              border:"1px solid rgba(249,115,22,.3)",color:OR,
              fontFamily:"'Barlow Condensed',sans-serif" }}>🎪 Mi Panel</button>
          )}
        </div>
 
        {/* GRID DE RIFAS */}
        <div style={{ display:"grid",
          gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(270px,1fr))",gap:16 }}>
          {filtered.map(r=>(
            <div key={r.id} className="rifacard" style={{ transition:"all .2s" }}>
              <RifaCard rifa={r} currentUser={currentUser} onSelect={onSelectRifa}/>
            </div>
          ))}
          {filtered.length===0&&(
            <div style={{ gridColumn:"1/-1",textAlign:"center",padding:"60px 20px",
              color:"rgba(255,255,255,.2)",fontSize:15,background:"rgba(124,58,237,.04)",
              borderRadius:14,border:"1px solid rgba(124,58,237,.1)" }}>
              <div style={{ fontSize:40,marginBottom:12 }}>🎫</div>
              No hay rifas que coincidan
            </div>
          )}
        </div>
      </main>
    </div>
  );
}