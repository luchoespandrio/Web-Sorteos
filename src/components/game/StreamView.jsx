import React, { useState, useEffect, useRef } from "react";
import { COLORS, FRAC_COLORS, BALL_COLORS } from "../../utils/constants";
 
const { YELLOW, YELLOW2 } = COLORS;
 
// ─── Keyframes ───────────────────────────────────────────────────────────────
function InjectStyles() {
  useEffect(() => {
    if (document.getElementById("stream-css")) return;
    const s = document.createElement("style");
    s.id = "stream-css";
    s.textContent = `
      @keyframes streamGlow   { 0%,100%{text-shadow:0 0 20px rgba(255,215,0,.5),0 0 40px rgba(255,215,0,.2)} 50%{text-shadow:0 0 40px rgba(255,215,0,1),0 0 80px rgba(255,215,0,.6),0 0 120px rgba(255,215,0,.3)} }
      @keyframes streamBorder { 0%,100%{box-shadow:0 0 0 2px rgba(255,215,0,.3),0 0 30px rgba(255,215,0,.1)} 50%{box-shadow:0 0 0 2px rgba(255,215,0,.8),0 0 60px rgba(255,215,0,.25)} }
      @keyframes ballDrop     { 0%{transform:scale(0) rotate(-180deg);opacity:0} 60%{transform:scale(1.2) rotate(10deg)} 80%{transform:scale(.95)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
      @keyframes winnerReveal { 0%{transform:scale(.3) rotate(-10deg);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
      @keyframes confStream   { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
      @keyframes ringOut      { 0%{transform:scale(.5);opacity:1} 100%{transform:scale(3);opacity:0} }
      @keyframes livePulse    { 0%,100%{opacity:1} 50%{opacity:.3} }
      @keyframes tickerScroll { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
      @keyframes numberBig    { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
      @keyframes shimmerBar   { 0%{background-position:-200%} 100%{background-position:200%} }
    `;
    document.head.appendChild(s);
    return () => document.getElementById("stream-css")?.remove();
  }, []);
  return null;
}
 
// ─── Confetti para ganador ────────────────────────────────────────────────────
const CONF = Array.from({length:40},(_,i)=>({
  id:i, color:[YELLOW,"#FF6B6B","#4ECDC4","#A07BFF","#00C853","#FF8C00","#fff"][i%7],
  left:`${Math.random()*100}%`, delay:`${Math.random()*1.5}s`,
  dur:`${2+Math.random()*2}s`, size:`${6+Math.random()*10}px`,
}));
 
// ─── Componente: badge de estado ─────────────────────────────────────────────
function GameStatusBadge({ status }) {
  const cfg = {
    open:        { label:"EN CURSO",       color:"#00C853", bg:"rgba(0,200,83,.15)"  },
    readyManual: { label:"LISTO • MANUAL", color:YELLOW,    bg:"rgba(255,215,0,.15)" },
    running:     { label:"⚡ SORTEANDO",   color:"#FF8C00", bg:"rgba(255,140,0,.15)" },
    finished:    { label:"✓ FINALIZADO",   color:"#4ECDC4", bg:"rgba(78,205,196,.12)"},
  };
  const c = cfg[status] || cfg.open;
  return (
    <span style={{ padding:"4px 14px", borderRadius:20, fontSize:13, fontWeight:900,
      background:c.bg, border:`1px solid ${c.color}55`, color:c.color,
      letterSpacing:1, textTransform:"uppercase" }}>
      {c.label}
    </span>
  );
}
 
// ─── Panel de un juego activo ─────────────────────────────────────────────────
function ActiveGamePanel({ game, type }) {
  const isCortito  = type === "cortito";
  const isPlanilla = type === "planilla";
 
  const players = isCortito ? (game.players || []) : [];
  const prize   = isCortito ? game.costPerSlot * game.totalSlots : game.prize;
  const pct     = isCortito
    ? Math.round((players.length / game.totalSlots) * 100)
    : (() => {
        const total = game.totalNumbers * 4;
        const used  = Object.values(game.numbers||{}).flat().filter(Boolean).length;
        return Math.round((used/total)*100);
      })();
 
  const lastBalls = (game.seq || []).slice(-5).reverse();
 
  return (
    <div style={{
      background:"rgba(8,8,20,.95)",
      border:`2px solid ${game.status==="running" ? YELLOW : "rgba(255,255,255,.12)"}`,
      borderRadius:20, padding:"24px 28px",
      animation: game.status==="running" ? "streamBorder 1.5s ease-in-out infinite" : undefined,
    }}>
      {/* Cabecera */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ color:"rgba(255,255,255,.35)", fontSize:13, textTransform:"uppercase", letterSpacing:2, marginBottom:4 }}>
            {isCortito ? "⚡ Cortito" : "🎰 Planilla"}
          </div>
          <div style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:22, fontWeight:900 }}>
            {game.name}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"rgba(255,255,255,.3)", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>Premio</div>
          <div style={{ color:YELLOW, fontWeight:900, fontSize:28, fontFamily:"'Cinzel',serif",
            animation:"streamGlow 2s ease-in-out infinite", lineHeight:1 }}>
            {typeof prize === "number" ? `${prize.toLocaleString()} cr.` : prize}
          </div>
        </div>
      </div>
 
      {/* Progreso */}
      <div style={{ marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ color:"rgba(255,255,255,.4)", fontSize:13 }}>
            {isCortito ? `${players.length}/${game.totalSlots} slots` : `Cuartos vendidos`}
          </span>
          <span style={{ color:YELLOW, fontWeight:700, fontSize:14 }}>{pct}%</span>
        </div>
        <div style={{ height:8, background:"rgba(255,255,255,.07)", borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, borderRadius:4,
            background:`linear-gradient(90deg,${YELLOW2},${YELLOW})`,
            backgroundSize:"200% 100%",
            animation: pct>0&&pct<100 ? "shimmerBar 2s linear infinite" : undefined,
          }}/>
        </div>
      </div>
 
      {/* Bolas recientes */}
      {lastBalls.length > 0 && (
        <div>
          <div style={{ color:"rgba(255,255,255,.3)", fontSize:11, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 }}>
            Últimas extracciones
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {lastBalls.map((n, i) => (
              <div key={i} style={{
                width: i===0?56:40, height: i===0?56:40,
                borderRadius:"50%",
                background: i===0
                  ? `radial-gradient(circle at 35% 35%, ${BALL_COLORS[n%BALL_COLORS.length]}, ${BALL_COLORS[(n+3)%BALL_COLORS.length]})`
                  : "rgba(255,255,255,.08)",
                border: i===0 ? `2px solid ${BALL_COLORS[n%BALL_COLORS.length]}` : "1px solid rgba(255,255,255,.15)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Cinzel',serif", fontWeight:900,
                fontSize: i===0?22:16,
                color: i===0 ? "#000" : "rgba(255,255,255,.5)",
                animation: i===0 ? "ballDrop .4s ease-out" : undefined,
                boxShadow: i===0 ? `0 0 20px ${BALL_COLORS[n%BALL_COLORS.length]}88` : undefined,
                transition:"all .3s",
              }}>{n}</div>
            ))}
          </div>
        </div>
      )}
 
      {/* Ganador del panel */}
      {game.winner && (
        <div style={{ marginTop:16, padding:"16px 20px",
          background:"rgba(255,215,0,.08)", border:"2px solid rgba(255,215,0,.4)",
          borderRadius:14, textAlign:"center",
          animation:"winnerReveal .6s ease-out forwards" }}>
          <div style={{ color:"rgba(255,255,255,.5)", fontSize:11, textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>
            🏆 Número ganador
          </div>
          <div style={{ fontFamily:"'Cinzel',serif", color:YELLOW, fontSize:42, fontWeight:900,
            animation:"streamGlow 1.5s ease-in-out infinite" }}>
            {isCortito ? game.winner.slotNumber : game.winner.number}
          </div>
          {isCortito && game.winner.player && (
            <div style={{ color:"#fff", fontSize:20, fontWeight:700, marginTop:6 }}>
              {game.winner.player.avatar} {game.winner.player.userName}
            </div>
          )}
          {isPlanilla && game.winner.slots && (
            <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginTop:8 }}>
              {game.winner.slots.filter(Boolean).map((s,i) => (
                <div key={i} style={{ padding:"4px 12px", borderRadius:8,
                  background:`${FRAC_COLORS[s.fraccion]}22`, border:`1px solid ${FRAC_COLORS[s.fraccion]}55`,
                  color:FRAC_COLORS[s.fraccion], fontSize:13, fontWeight:700 }}>
                  {s.avatar} {s.userName}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
 
      <div style={{ marginTop:14, display:"flex", justifyContent:"flex-end" }}>
        <GameStatusBadge status={game.status} />
      </div>
    </div>
  );
}
 
// ─── Vista principal del Stream ───────────────────────────────────────────────
export function StreamView({ db, updateDB, triggerManualDraw, onExit, currentUser }) {
  const [showWinner, setShowWinner]         = useState(null);
  const [fullscreenBall, setFullscreenBall] = useState(null);
  const prevWinnersRef = useRef({});
 
  // Detectar nuevos ganadores y mostrar pantalla épica
  useEffect(() => {
    if (!db) return;
    [...(db.cortitos||[]), ...(db.planillas||[])].forEach(g => {
      const key = `${g.id}`;
      if (g.winner && !prevWinnersRef.current[key]) {
        prevWinnersRef.current[key] = true;
        setFullscreenBall(g.status === "running" ? (g.seq?.[g.seq.length-1] || null) : null);
        setTimeout(() => {
          setShowWinner(g);
          setFullscreenBall(null);
        }, 1500);
      }
      if (!g.winner) prevWinnersRef.current[key] = false;
    });
  }, [db]);
 
  if (!db) return null;
 
  const activeCortitos  = (db.cortitos||[]).filter(c => c.status !== "finished");
  const activePlanillas = (db.planillas||[]).filter(p => p.status !== "finished");
  const readyManual     = (db.planillas||[]).filter(p => p.status === "readyManual");
  const totalPlayers    = (db.users||[]).filter(u => !u.isAdmin).length;
 
  return (
    <div style={{ minHeight:"100vh", background:"#040408",
      fontFamily:"'Barlow Condensed',sans-serif", position:"relative", overflow:"hidden" }}>
 
      <InjectStyles />
 
      {/* Confetti cuando hay ganador */}
      {showWinner && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:50 }}>
          {CONF.map(p => (
            <div key={p.id} style={{ position:"absolute", top:"-10px", left:p.left,
              width:p.size, height:p.size, background:p.color, borderRadius:p.id%3===0?"50%":"2px",
              animation:`confStream ${p.dur} ${p.delay} ease-in forwards` }}/>
          ))}
        </div>
      )}
 
      {/* Pantalla fullscreen bola */}
      {fullscreenBall !== null && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,.95)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ color:"rgba(255,255,255,.4)", fontSize:16, letterSpacing:4,
            textTransform:"uppercase", marginBottom:24 }}>NÚMERO GANADOR</div>
          <div style={{
            width:200, height:200, borderRadius:"50%",
            background:`radial-gradient(circle at 35% 35%, ${BALL_COLORS[fullscreenBall%BALL_COLORS.length]}, #000)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:80, color:"#fff",
            animation:"numberBig .5s ease-out forwards",
            boxShadow:`0 0 80px ${BALL_COLORS[fullscreenBall%BALL_COLORS.length]}`,
          }}>{fullscreenBall}</div>
          {[1,2,3].map(i=>(
            <div key={i} style={{ position:"absolute", width:220+(i*80), height:220+(i*80),
              borderRadius:"50%", border:`2px solid ${BALL_COLORS[fullscreenBall%BALL_COLORS.length]}`,
              opacity:0, animation:`ringOut ${.8+i*.3}s ${i*.2}s ease-out infinite` }}/>
          ))}
        </div>
      )}
 
      {/* Overlay ganador épico */}
      {showWinner && (
        <div style={{ position:"fixed", inset:0, zIndex:100,
          background:"rgba(0,0,0,.88)", backdropFilter:"blur(8px)",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", animation:"winnerReveal .5s ease-out forwards",
            maxWidth:600, padding:20 }}>
            <div style={{ fontSize:80, marginBottom:8,
              filter:"drop-shadow(0 0 30px rgba(255,215,0,.7))" }}>🏆</div>
            <div style={{ fontFamily:"'Cinzel',serif", color:YELLOW, fontSize:42, fontWeight:900,
              animation:"streamGlow 1.5s ease-in-out infinite", marginBottom:8 }}>
              ¡TENEMOS GANADOR!
            </div>
            <div style={{ color:"rgba(255,255,255,.5)", fontSize:18, marginBottom:24 }}>
              {showWinner.name}
            </div>
            <div style={{ background:"rgba(255,215,0,.1)", border:"2px solid rgba(255,215,0,.4)",
              borderRadius:20, padding:"24px 32px", display:"inline-block" }}>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:12, textTransform:"uppercase",
                letterSpacing:2, marginBottom:6 }}>Número Ganador</div>
              <div style={{ fontFamily:"'Cinzel',serif", color:YELLOW, fontSize:72, fontWeight:900,
                lineHeight:1, animation:"streamGlow 1.5s ease-in-out infinite" }}>
                {showWinner.winner?.slotNumber || showWinner.winner?.number}
              </div>
              {showWinner.winner?.player && (
                <div style={{ color:"#fff", fontSize:24, fontWeight:700, marginTop:8 }}>
                  {showWinner.winner.player.avatar} {showWinner.winner.player.userName}
                </div>
              )}
              {showWinner.winner?.slots && (
                <div style={{ display:"flex", gap:10, justifyContent:"center",
                  flexWrap:"wrap", marginTop:12 }}>
                  {showWinner.winner.slots.filter(Boolean).map((s,i) => (
                    <div key={i} style={{ padding:"6px 16px", borderRadius:10,
                      background:`${FRAC_COLORS[s.fraccion]}22`,
                      border:`1px solid ${FRAC_COLORS[s.fraccion]}66`,
                      color:FRAC_COLORS[s.fraccion], fontSize:16, fontWeight:700 }}>
                      {s.avatar} {s.userName}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop:14, color:"#00C853", fontWeight:700, fontSize:22 }}>
                💰 Premio: {typeof showWinner.prize==="number"
                  ? `${showWinner.prize.toLocaleString()} cr.` : showWinner.prize}
              </div>
            </div>
            <button onClick={() => setShowWinner(null)} style={{
              marginTop:24, background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,
              border:"none", borderRadius:12, padding:"14px 40px",
              color:"#000", fontSize:16, fontWeight:700, cursor:"pointer",
              fontFamily:"'Cinzel',serif", letterSpacing:1,
            }}>CONTINUAR →</button>
          </div>
        </div>
      )}
 
      {/* Header stream */}
      <header style={{ background:"rgba(4,4,8,.98)", borderBottom:"1px solid rgba(255,215,0,.15)",
        padding:"0 24px", height:64, display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"sticky", top:0, zIndex:30 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,50,50,.15)",
            border:"1px solid rgba(255,50,50,.4)", borderRadius:20, padding:"5px 14px" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#FF5252",
              animation:"livePulse .8s ease-in-out infinite" }}/>
            <span style={{ color:"#FF5252", fontWeight:900, fontSize:13, letterSpacing:2 }}>EN VIVO</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20 }}>👑</span>
            <span style={{ fontFamily:"'Cinzel',serif", color:YELLOW, fontSize:18, fontWeight:900, letterSpacing:3 }}>RIFAS</span>
            <span style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:18, letterSpacing:3 }}>REAL</span>
          </div>
        </div>
 
        {/* Stats en vivo */}
        <div style={{ display:"flex", gap:24 }}>
          {[
            { label:"Jugadores",        val:totalPlayers,          icon:"👥" },
            { label:"Cortitos activos", val:activeCortitos.length, icon:"⚡" },
            { label:"Planillas activas",val:activePlanillas.length,icon:"🎰" },
          ].map(s => (
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ color:YELLOW, fontWeight:900, fontSize:20 }}>{s.icon} {s.val}</div>
              <div style={{ color:"rgba(255,255,255,.3)", fontSize:10, textTransform:"uppercase", letterSpacing:1 }}>{s.label}</div>
            </div>
          ))}
        </div>
 
        <button onClick={onExit} style={{ background:"rgba(255,50,50,.08)",
          border:"1px solid rgba(255,50,50,.3)", borderRadius:8, padding:"8px 16px",
          color:"#FF5252", cursor:"pointer", fontSize:13,
          fontFamily:"'Barlow Condensed',sans-serif" }}>
          ✕ Salir del modo stream
        </button>
      </header>
 
      {/* Ticker */}
      <div style={{ overflow:"hidden", background:"rgba(255,215,0,.06)",
        borderBottom:"1px solid rgba(255,215,0,.1)", padding:"7px 0" }}>
        <div style={{ display:"inline-flex", gap:60, whiteSpace:"nowrap",
          animation:"tickerScroll 30s linear infinite" }}>
          {[...Array(3)].flatMap(() => [
            ...(db.cortitos||[]).map(c => `⚡ ${c.name} — Pozo: ${c.costPerSlot*c.totalSlots} cr. — ${c.players.length}/${c.totalSlots} slots`),
            ...(db.planillas||[]).map(p => `🎰 ${p.name} — Premio: ${p.prize?.toLocaleString()} cr. — ${p.drawMode==="manual"?"Sorteo manual":"Sorteo automático"}`),
          ]).map((t,i) => (
            <span key={i} style={{ color:"rgba(255,215,0,.7)", fontSize:13 }}>✦ {t}</span>
          ))}
        </div>
      </div>
 
      <main style={{ maxWidth:1400, margin:"0 auto", padding:"24px 20px" }}>
 
        {/* Botones disparo manual */}
        {readyManual.length > 0 && (currentUser?.isAdmin || currentUser?.role==="supervisor") && (
          <div style={{ background:"rgba(255,215,0,.06)", border:"1px solid rgba(255,215,0,.3)",
            borderRadius:14, padding:"16px 20px", marginBottom:20,
            display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <span style={{ color:YELLOW, fontSize:14, fontWeight:700 }}>
              🎰 {readyManual.length} planilla{readyManual.length>1?"s":""}
              {readyManual.length>1?" listas":" lista"} para sortear manualmente:
            </span>
            {readyManual.map(p => (
              <button key={p.id} onClick={() => triggerManualDraw?.(p.id)} style={{
                background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,
                border:"none", borderRadius:10, padding:"10px 22px",
                color:"#000", fontWeight:900, fontSize:14, cursor:"pointer",
                fontFamily:"'Cinzel',serif", letterSpacing:.5,
              }}>▶ Iniciar {p.name}</button>
            ))}
          </div>
        )}
 
        {/* Grid de juegos activos */}
        <div style={{ display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(420px,1fr))", gap:20 }}>
 
          {activeCortitos.map(c => (
            <ActiveGamePanel key={`c-${c.id}`} game={c} type="cortito" />
          ))}
 
          {activePlanillas.map(p => (
            <ActiveGamePanel key={`p-${p.id}`} game={p} type="planilla" />
          ))}
 
          {activeCortitos.length === 0 && activePlanillas.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"80px 20px",
              color:"rgba(255,255,255,.2)", fontSize:18 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🎰</div>
              No hay juegos activos en este momento
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
 