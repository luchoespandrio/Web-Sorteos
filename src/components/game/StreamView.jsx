import React, { useState, useEffect, useRef } from "react";
import { COLORS, BALL_COLORS, FRAC_COLORS } from "../../utils/constants";
 
const { YELLOW, YELLOW2 } = COLORS;
const OR="#f97316"; const V="#7c3aed"; const VL="#a855f7"; const GR="#22c55e";
 
const CONF=Array.from({length:40},(_,i)=>({
  id:i,color:[YELLOW,"#f97316","#a855f7","#22c55e","#ef4444","#06b6d4","#fff"][i%7],
  left:`${Math.random()*100}%`,delay:`${Math.random()*1.5}s`,dur:`${2+Math.random()*2}s`,size:`${6+Math.random()*10}px`,
}));
 
export function StreamView({ db, updateDB, currentUser, onExit }) {
  const [showWinner, setShowWinner] = useState(null);
  const [fullBall, setFullBall]     = useState(null);
  const prevWin = useRef({});
 
  useEffect(() => {
    if (!document.getElementById("sv-css")) {
      const s=document.createElement("style"); s.id="sv-css";
      s.textContent=`
        @keyframes sv-glow{0%,100%{text-shadow:0 0 20px rgba(251,191,36,.5)}50%{text-shadow:0 0 40px rgba(251,191,36,1),0 0 80px rgba(249,115,22,.4)}}
        @keyframes sv-border{0%,100%{box-shadow:0 0 0 2px rgba(249,115,22,.3)}50%{box-shadow:0 0 0 2px rgba(249,115,22,.8),0 0 60px rgba(249,115,22,.2)}}
        @keyframes sv-ball{0%{transform:scale(0) rotate(-180deg);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
        @keyframes sv-reveal{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        @keyframes sv-conf{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @keyframes sv-ring{0%{transform:scale(.5);opacity:1}100%{transform:scale(3);opacity:0}}
        @keyframes sv-live{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes sv-ticker{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
        @keyframes sv-shimmer{0%{background-position:-200%}100%{background-position:200%}}
        @keyframes sv-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes sv-pulse{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes sv-spin{to{transform:rotate(360deg)}}
      `;
      document.head.appendChild(s);
    }
  }, []);
 
  // Detectar nuevos ganadores
  useEffect(() => {
    if (!db) return;
    const all=[...(db.cortitos||[]),...(db.planillas||[]),...(db.rifas||[])];
    all.forEach(g => {
      const key=`${g.id}`;
      const hasWinner = g.winner && (g.winner.player||g.winner.number||g.winner.slots);
      if (hasWinner && !prevWin.current[key]) {
        prevWin.current[key]=true;
        const ball = g.seq?.[g.seq.length-1]||null;
        if (ball) { setFullBall(ball); setTimeout(()=>{ setFullBall(null); setShowWinner(g); },2000); }
        else setShowWinner(g);
      }
      if (!hasWinner) prevWin.current[key]=false;
    });
  },[db]);
 
  if (!db) return null;
 
  const allRifas     = (db.rifas||[]).filter(r=>r.status!=="finished");
  const allCortitos  = (db.cortitos||[]).filter(c=>c.status!=="finished");
  const allPlanillas = (db.planillas||[]).filter(p=>p.status!=="finished");
  const readyManual  = (db.planillas||[]).filter(p=>p.status==="readyManual");
  const totalPlayers = (db.users||[]).filter(u=>u.role==="player").length;
  const activeGames  = allRifas.length+allCortitos.length+allPlanillas.length;
 
  const triggerManualDraw = (planillaId) => {
    updateDB(prev=>({...prev,planillas:prev.planillas.map(p=>p.id===planillaId?{...p,status:"running"}:p)}));
  };
 
  return (
    <div style={{ minHeight:"100vh",background:"#080614",fontFamily:"'Barlow Condensed',sans-serif",position:"relative",overflow:"hidden" }}>
 
      {/* Fondo animado */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0 }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 50% at 50% 0%,rgba(124,58,237,.08),transparent)" }}/>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 40% at 0% 100%,rgba(249,115,22,.05),transparent)" }}/>
        <div style={{ position:"absolute",inset:0,opacity:.015,
          backgroundImage:"linear-gradient(rgba(168,85,247,1) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,1) 1px,transparent 1px)",
          backgroundSize:"60px 60px" }}/>
      </div>
 
      {/* Confetti ganador */}
      {showWinner&&(
        <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:50 }}>
          {CONF.map(p=><div key={p.id} style={{ position:"absolute",top:"-10px",left:p.left,
            width:p.size,height:p.size,background:p.color,
            borderRadius:p.id%3===0?"50%":"2px",
            animation:`sv-conf ${p.dur} ${p.delay} ease-in forwards` }}/>)}
        </div>
      )}
 
      {/* Bola fullscreen */}
      {fullBall!==null&&(
        <div style={{ position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.96)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
          <div style={{ color:"rgba(255,255,255,.4)",fontSize:18,letterSpacing:4,
            textTransform:"uppercase",marginBottom:30 }}>NÚMERO GANADOR</div>
          <div style={{
            width:220,height:220,borderRadius:"50%",
            background:`radial-gradient(circle at 35% 35%, ${BALL_COLORS[fullBall%BALL_COLORS.length]}, #111)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:90,color:"#fff",
            animation:"sv-ball .5s ease-out forwards",
            boxShadow:`0 0 100px ${BALL_COLORS[fullBall%BALL_COLORS.length]}88,0 0 200px ${BALL_COLORS[fullBall%BALL_COLORS.length]}44`,
          }}>{fullBall}</div>
          {[1,2,3].map(i=><div key={i} style={{ position:"absolute",
            width:240+(i*90),height:240+(i*90),borderRadius:"50%",
            border:`2px solid ${BALL_COLORS[fullBall%BALL_COLORS.length]}`,
            opacity:0,animation:`sv-ring ${.8+i*.3}s ${i*.2}s ease-out infinite` }}/>)}
        </div>
      )}
 
      {/* Modal ganador épico */}
      {showWinner&&(
        <div style={{ position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.9)",
          backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
          <div style={{ textAlign:"center",animation:"sv-reveal .5s ease-out forwards",maxWidth:640,width:"100%",padding:"0 16px" }}>
            <div style={{ fontSize:90,marginBottom:8,animation:"sv-float 2s ease-in-out infinite",
              filter:"drop-shadow(0 0 30px rgba(251,191,36,.7))" }}>🏆</div>
            <div style={{ fontFamily:"'Cinzel',serif",color:YELLOW,fontSize:window.innerWidth<600?32:48,
              fontWeight:900,letterSpacing:2,animation:"sv-glow 1.5s ease-in-out infinite",marginBottom:6 }}>
              ¡TENEMOS GANADOR!
            </div>
            <div style={{ color:"rgba(255,255,255,.5)",fontSize:18,marginBottom:24 }}>{showWinner.name}</div>
            <div style={{ background:"rgba(251,191,36,.08)",border:"2px solid rgba(251,191,36,.4)",
              borderRadius:24,padding:"28px 32px",display:"inline-block",minWidth:280 }}>
              <div style={{ color:"rgba(255,255,255,.4)",fontSize:12,textTransform:"uppercase",letterSpacing:2,marginBottom:8 }}>Número Ganador</div>
              <div style={{ fontFamily:"'Cinzel',serif",color:YELLOW,
                fontSize:window.innerWidth<600?64:90,fontWeight:900,lineHeight:1,
                animation:"sv-glow 1.5s ease-in-out infinite" }}>
                {showWinner.winner?.slotNumber||showWinner.winner?.number||showWinner.winnerNumber}
              </div>
              {showWinner.winner?.player&&(
                <div style={{ color:"#fff",fontSize:24,fontWeight:700,marginTop:10 }}>
                  {showWinner.winner.player.avatar} {showWinner.winner.player.userName}
                </div>
              )}
              {showWinner.winner?.slots&&(
                <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:12 }}>
                  {showWinner.winner.slots.filter(Boolean).map((s,i)=>(
                    <div key={i} style={{ padding:"6px 16px",borderRadius:10,
                      background:`${FRAC_COLORS[s.fraccion]}22`,border:`1px solid ${FRAC_COLORS[s.fraccion]}66`,
                      color:FRAC_COLORS[s.fraccion],fontSize:16,fontWeight:700 }}>
                      {s.avatar} {s.userName}
                    </div>
                  ))}
                </div>
              )}
              {showWinner.winner?.name&&(
                <div style={{ color:"#fff",fontSize:22,fontWeight:700,marginTop:10 }}>🎉 {showWinner.winner.name}</div>
              )}
              <div style={{ marginTop:14,color:GR,fontWeight:700,fontSize:22 }}>
                💰 {typeof showWinner.prize==="number"
                  ?`${showWinner.prize.toLocaleString()} cr.`
                  :showWinner.prize||`${(showWinner.costPerSlot||0)*(showWinner.totalSlots||0)} cr.`}
              </div>
            </div>
            <br/>
            <button onClick={()=>setShowWinner(null)} style={{ marginTop:24,
              background:`linear-gradient(135deg,${OR},${OR}cc)`,border:"none",borderRadius:14,
              padding:"16px 48px",color:"#fff",fontSize:18,fontWeight:700,cursor:"pointer",
              fontFamily:"'Cinzel',serif",letterSpacing:1,
              boxShadow:"0 4px 24px rgba(249,115,22,.5)" }}>
              CONTINUAR →
            </button>
          </div>
        </div>
      )}
 
      {/* HEADER STREAM */}
      <header style={{ background:"rgba(8,6,20,.98)",borderBottom:"1px solid rgba(124,58,237,.2)",
        padding:"0 20px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",
        position:"sticky",top:0,zIndex:30 }}>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,background:"rgba(239,68,68,.15)",
            border:"1px solid rgba(239,68,68,.4)",borderRadius:20,padding:"5px 14px" }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:"#ef4444",
              animation:"sv-live .8s ease-in-out infinite" }}/>
            <span style={{ color:"#ef4444",fontWeight:900,fontSize:13,letterSpacing:2 }}>EN VIVO</span>
          </div>
          <span style={{ fontSize:18 }}>👑</span>
          <span style={{ fontFamily:"'Cinzel',serif",color:YELLOW,fontSize:16,fontWeight:900,letterSpacing:3 }}>RIFAS REAL</span>
        </div>
 
        <div style={{ display:"flex",gap:20,alignItems:"center" }}>
          {[
            { icon:"👥", val:totalPlayers, label:"Jugadores" },
            { icon:"🎮", val:activeGames,  label:"Juegos activos" },
          ].map(s=>(
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ color:YELLOW,fontWeight:900,fontSize:18 }}>{s.icon} {s.val}</div>
              <div style={{ color:"rgba(255,255,255,.3)",fontSize:9,textTransform:"uppercase",letterSpacing:1 }}>{s.label}</div>
            </div>
          ))}
        </div>
 
        <button onClick={onExit} style={{ background:"rgba(239,68,68,.08)",
          border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"8px 16px",
          color:"#ef4444",cursor:"pointer",fontSize:13,fontFamily:"'Barlow Condensed',sans-serif" }}>
          ✕ Salir del stream
        </button>
      </header>
 
      {/* TICKER */}
      <div style={{ overflow:"hidden",background:"rgba(124,58,237,.08)",
        borderBottom:"1px solid rgba(124,58,237,.15)",padding:"6px 0" }}>
        <div style={{ display:"inline-flex",gap:60,whiteSpace:"nowrap",
          animation:"sv-ticker 35s linear infinite" }}>
          {[...Array(3)].flatMap((_,ri)=>[
            ...(db.rifas||[]).map(r=>`🎫 ${r.name} · ${Object.values(r.numbers||{}).filter(n=>n.status==="reservado").length}/${r.totalNumbers} números · Premio: ${r.prize}`),
            ...(db.cortitos||[]).map(c=>`⚡ ${c.name} · ${c.players.length}/${c.totalSlots} slots · Pozo: ${(c.costPerSlot*c.totalSlots).toLocaleString()} cr.`),
            ...(db.planillas||[]).map(p=>`🎰 ${p.name} · Premio: ${(p.prize||0).toLocaleString()} cr. · ${p.drawMode==="manual"?"Sorteo manual":"Sorteo automático"}`),
          ].map((t,i)=>(
            <span key={`${ri}-${i}`} style={{ color:"rgba(168,85,247,.8)",fontSize:13 }}>✦ {t}</span>
          )))}
        </div>
      </div>
 
      {/* BOTONES MANUALES */}
      {readyManual.length>0&&(currentUser?.role==="admin"||currentUser?.role==="supervisor")&&(
        <div style={{ background:"rgba(249,115,22,.06)",borderBottom:"1px solid rgba(249,115,22,.2)",
          padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap" }}>
          <span style={{ color:OR,fontSize:14,fontWeight:700 }}>🎰 Listas para sortear manualmente:</span>
          {readyManual.map(p=>(
            <button key={p.id} onClick={()=>triggerManualDraw(p.id)} style={{
              background:`linear-gradient(135deg,${OR},${OR}cc)`,border:"none",borderRadius:10,
              padding:"10px 22px",color:"#fff",fontWeight:900,fontSize:14,cursor:"pointer",
              fontFamily:"'Cinzel',serif",letterSpacing:.5,boxShadow:"0 4px 16px rgba(249,115,22,.4)" }}>
              ▶ Iniciar {p.name}
            </button>
          ))}
        </div>
      )}
 
      {/* CONTENIDO PRINCIPAL */}
      <main style={{ maxWidth:1400,margin:"0 auto",padding:"20px 16px",position:"relative",zIndex:1 }}>
 
        {/* ── RIFAS ── */}
        {allRifas.length>0&&(
          <Section title="🎫 Rifas" color={YELLOW}>
            {allRifas.map(r=>{
              const sold=Object.values(r.numbers||{}).filter(n=>n.status==="reservado"||n.status==="vendido").length;
              const pct=Math.round((sold/(r.totalNumbers||100))*100);
              return (
                <GameCard key={r.id} color={YELLOW} status={r.status} label={r.status==="readyToDraw"?"Lista para sortear":r.status==="active"?"Activa":"Sorteada"}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                    <div>
                      <div style={{ fontSize:32,marginBottom:4 }}>{r.icon}</div>
                      <div style={{ fontFamily:"'Cinzel',serif",color:"#fff",fontSize:16,fontWeight:700 }}>{r.name}</div>
                      <div style={{ color:"rgba(255,255,255,.4)",fontSize:12 }}>{r.subtitle}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:"rgba(255,255,255,.3)",fontSize:10,textTransform:"uppercase",letterSpacing:1 }}>Premio</div>
                      <div style={{ color:YELLOW,fontWeight:900,fontSize:22,fontFamily:"'Cinzel',serif",animation:"sv-glow 2s ease-in-out infinite" }}>{r.prize}</div>
                    </div>
                  </div>
                  <ProgressBar pct={pct} color={YELLOW} label={`${sold}/${r.totalNumbers} números`}/>
                  {r.winner&&<WinnerTag name={r.winner.name} num={r.winner.number} color={YELLOW}/>}
                </GameCard>
              );
            })}
          </Section>
        )}
 
        {/* ── CORTITOS ── */}
        {allCortitos.length>0&&(
          <Section title="⚡ Cortitos" color={OR}>
            {allCortitos.map(c=>{
              const pct=Math.round((c.players.length/c.totalSlots)*100);
              const lastBalls=(c.seq||[]).slice(-6).reverse();
              return (
                <GameCard key={c.id} color={OR} status={c.status} label={c.status==="open"?"Abierto":c.status==="running"?"Sorteando":"Finalizado"}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                    <div>
                      <div style={{ fontFamily:"'Cinzel',serif",color:"#fff",fontSize:16,fontWeight:700 }}>{c.name}</div>
                      <div style={{ color:"rgba(255,255,255,.4)",fontSize:12 }}>{c.description}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:"rgba(255,255,255,.3)",fontSize:10,textTransform:"uppercase",letterSpacing:1 }}>Pozo</div>
                      <div style={{ color:OR,fontWeight:900,fontSize:22,fontFamily:"'Cinzel',serif" }}>{(c.costPerSlot*c.totalSlots).toLocaleString()} cr.</div>
                    </div>
                  </div>
                  <ProgressBar pct={pct} color={OR} label={`${c.players.length}/${c.totalSlots} slots`}/>
                  {lastBalls.length>0&&(
                    <div style={{ display:"flex",gap:8,marginTop:10,flexWrap:"wrap" }}>
                      {lastBalls.map((n,i)=>(
                        <div key={i} style={{
                          width:i===0?48:34,height:i===0?48:34,borderRadius:"50%",
                          background:i===0?`radial-gradient(circle at 35% 35%,${BALL_COLORS[n%BALL_COLORS.length]},#111)`:"rgba(255,255,255,.06)",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontFamily:"'Cinzel',serif",fontWeight:900,
                          fontSize:i===0?18:13,color:i===0?"#000":"rgba(255,255,255,.4)",
                          animation:i===0?"sv-ball .3s ease-out":undefined,
                          boxShadow:i===0?`0 0 16px ${BALL_COLORS[n%BALL_COLORS.length]}88`:undefined,
                          transition:"all .3s",flexShrink:0,
                        }}>{n}</div>
                      ))}
                    </div>
                  )}
                  {c.winner&&<WinnerTag name={c.winner.player?.userName} num={c.winner.slotNumber} color={OR}/>}
                </GameCard>
              );
            })}
          </Section>
        )}
 
        {/* ── PLANILLAS ── */}
        {allPlanillas.length>0&&(
          <Section title="🎰 Planillas" color={VL}>
            {allPlanillas.map(p=>{
              const total=p.totalNumbers*4;
              const used=Object.values(p.numbers||{}).flat().filter(Boolean).length;
              const pct=Math.round((used/total)*100);
              const lastBalls=(p.seq||[]).slice(-6).reverse();
              return (
                <GameCard key={p.id} color={VL} status={p.status} label={
                  p.status==="open"?"Abierta":p.status==="readyManual"?"Lista · Manual":
                  p.status==="running"?"Sorteando":"Finalizada"}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                    <div>
                      <div style={{ fontFamily:"'Cinzel',serif",color:"#fff",fontSize:16,fontWeight:700 }}>{p.name}</div>
                      <div style={{ color:"rgba(255,255,255,.4)",fontSize:12 }}>{p.subtitle}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:"rgba(255,255,255,.3)",fontSize:10,textTransform:"uppercase",letterSpacing:1 }}>Premio</div>
                      <div style={{ color:VL,fontWeight:900,fontSize:22,fontFamily:"'Cinzel',serif",animation:"sv-glow 2s ease-in-out infinite" }}>{(p.prize||0).toLocaleString()} cr.</div>
                    </div>
                  </div>
                  <ProgressBar pct={pct} color={VL} label={`${used}/${total} cuartos`}/>
                  {lastBalls.length>0&&(
                    <div style={{ display:"flex",gap:8,marginTop:10,flexWrap:"wrap" }}>
                      {lastBalls.map((n,i)=>(
                        <div key={i} style={{
                          width:i===0?48:34,height:i===0?48:34,borderRadius:"50%",
                          background:i===0?`radial-gradient(circle at 35% 35%,${BALL_COLORS[n%BALL_COLORS.length]},#111)`:"rgba(255,255,255,.06)",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontFamily:"'Cinzel',serif",fontWeight:900,
                          fontSize:i===0?18:13,color:i===0?"#000":"rgba(255,255,255,.4)",
                          animation:i===0?"sv-ball .3s ease-out":undefined,
                          boxShadow:i===0?`0 0 16px ${BALL_COLORS[n%BALL_COLORS.length]}88`:undefined,
                          transition:"all .3s",flexShrink:0,
                        }}>{n}</div>
                      ))}
                    </div>
                  )}
                  {p.winner&&(
                    <div style={{ marginTop:12,padding:"10px 14px",background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.3)",borderRadius:10 }}>
                      <div style={{ color:YELLOW,fontWeight:700,fontSize:15 }}>🏆 Número {p.winner.number} ganó</div>
                      {(p.winner.slots||[]).filter(Boolean).map((s,i)=>(
                        <div key={i} style={{ color:"rgba(255,255,255,.7)",fontSize:13,marginTop:2 }}>{s.avatar} {s.userName} · {s.fraccion}</div>
                      ))}
                    </div>
                  )}
                </GameCard>
              );
            })}
          </Section>
        )}
 
        {activeGames===0&&(
          <div style={{ textAlign:"center",padding:"100px 20px",color:"rgba(255,255,255,.2)",fontSize:18 }}>
            <div style={{ fontSize:56,marginBottom:16,animation:"sv-float 3s ease-in-out infinite" }}>🎰</div>
            No hay juegos activos en este momento
          </div>
        )}
      </main>
    </div>
  );
}
 
function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom:32 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
        <div style={{ width:4,height:24,borderRadius:2,background:color }}/>
        <h2 style={{ fontFamily:"'Cinzel',serif",color:color,fontSize:20,fontWeight:900,letterSpacing:1 }}>{title}</h2>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16 }}>
        {children}
      </div>
    </div>
  );
}
 
function GameCard({ color, status, label, children }) {
  const isRunning = status==="running";
  return (
    <div style={{
      background:"rgba(13,11,30,.95)",
      border:`2px solid ${isRunning?color:"rgba(255,255,255,.1)"}`,
      borderRadius:18,padding:"20px",
      animation:isRunning?"sv-border 1.5s ease-in-out infinite":undefined,
      position:"relative",overflow:"hidden",
    }}>
      <div style={{ position:"absolute",top:12,right:12 }}>
        <span style={{ padding:"3px 12px",borderRadius:20,fontSize:10,fontWeight:900,letterSpacing:1,
          background:`${color}18`,border:`1px solid ${color}44`,color,textTransform:"uppercase" }}>
          {isRunning&&<span style={{ display:"inline-block",width:6,height:6,borderRadius:"50%",background:color,marginRight:5,animation:"sv-live .8s ease-in-out infinite",verticalAlign:"middle" }}/>}
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
 
function ProgressBar({ pct, color, label }) {
  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
        <span style={{ color:"rgba(255,255,255,.4)",fontSize:12 }}>{label}</span>
        <span style={{ color,fontWeight:700,fontSize:13 }}>{pct}%</span>
      </div>
      <div style={{ height:6,background:"rgba(255,255,255,.07)",borderRadius:3,overflow:"hidden" }}>
        <div style={{ height:"100%",width:`${pct}%`,borderRadius:3,
          background:`linear-gradient(90deg,${color}99,${color})`,
          backgroundSize:"200% 100%",
          animation:pct>0&&pct<100?"sv-shimmer 2s linear infinite":undefined }}/>
      </div>
    </div>
  );
}
 
function WinnerTag({ name, num, color }) {
  return (
    <div style={{ marginTop:12,padding:"10px 14px",background:`${color}10`,border:`1px solid ${color}33`,borderRadius:10,display:"flex",alignItems:"center",gap:10 }}>
      <span style={{ fontSize:20 }}>🏆</span>
      <div>
        <span style={{ color,fontWeight:700,fontSize:15 }}>Número {num} </span>
        {name&&<span style={{ color:"rgba(255,255,255,.7)",fontSize:14 }}>· {name}</span>}
      </div>
    </div>
  );
}