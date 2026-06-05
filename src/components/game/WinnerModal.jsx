import React, { useEffect, useState } from "react";
import { COLORS } from "../../utils/constants";
const { YELLOW, YELLOW2 } = COLORS;
 
const CONFETTI_COLORS = ["#FFD700","#FF6B6B","#4ECDC4","#A07BFF","#00C853","#FF8C00","#fff"];
const PIECES = Array.from({length:30},(_,i)=>({
  id:i, color:CONFETTI_COLORS[i%CONFETTI_COLORS.length],
  left:`${Math.random()*100}%`, delay:`${Math.random()*2}s`,
  dur:`${2.5+Math.random()*2}s`, size:`${6+Math.random()*8}px`,
  rotate:`${Math.random()*360}deg`,
}));
 
export function WinnerModal({ winner, rifa, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    const s = document.createElement("style");
    s.id = "winner-anim";
    s.textContent = `
      @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
      @keyframes winnerPop    { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
      @keyframes trophyBounce { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.15) translateY(-12px)} }
      @keyframes ringPulse    { 0%{transform:scale(.8);opacity:.8} 100%{transform:scale(2);opacity:0} }
      @keyframes winnerGlow   { 0%,100%{text-shadow:0 0 10px rgba(255,215,0,.5)} 50%{text-shadow:0 0 30px rgba(255,215,0,1),0 0 60px rgba(255,215,0,.5)} }
      @keyframes slideUp      { 0%{transform:translateY(60px);opacity:0} 100%{transform:translateY(0);opacity:1} }
    `;
    if (!document.getElementById("winner-anim")) document.head.appendChild(s);
    return () => document.getElementById("winner-anim")?.remove();
  }, []);
 
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:5000,
      background:"rgba(0,0,0,.92)", backdropFilter:"blur(16px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Barlow Condensed',sans-serif", padding:16,
      opacity: visible?1:0, transition:"opacity .3s",
    }}>
      {/* Confetti */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        {PIECES.map(p => (
          <div key={p.id} style={{
            position:"absolute", top:"-10px", left:p.left,
            width:p.size, height:p.size, background:p.color,
            borderRadius:p.id%3===0?"50%":p.id%3===1?"0":undefined,
            animation:`confettiFall ${p.dur} ${p.delay} ease-in infinite`,
            transform:`rotate(${p.rotate})`,
          }}/>
        ))}
      </div>
 
      {/* Card */}
      <div style={{
        position:"relative", zIndex:1,
        width:"min(480px,96vw)",
        background:"rgba(8,8,18,.97)",
        border:`2px solid ${YELLOW}`,
        borderRadius:24, padding:"40px 28px",
        textAlign:"center",
        boxShadow:`0 0 80px rgba(255,215,0,.25), 0 0 160px rgba(255,215,0,.1)`,
        animation:"slideUp .4s ease-out forwards",
      }}>
        {/* Anillos pulsantes */}
        {[1,2,3].map(i=>(
          <div key={i} style={{
            position:"absolute", inset:0, borderRadius:24,
            border:`2px solid rgba(255,215,0,${.4/i})`,
            animation:`ringPulse ${1+i*.4}s ${i*.3}s ease-out infinite`,
            pointerEvents:"none",
          }}/>
        ))}
 
        {/* Trofeo */}
        <div style={{ fontSize:72, marginBottom:12, display:"inline-block",
          animation:"trophyBounce 1.5s ease-in-out infinite",
          filter:"drop-shadow(0 0 20px rgba(255,215,0,.6))" }}>🏆</div>
 
        <h2 style={{ fontFamily:"'Cinzel',serif", color:YELLOW, fontSize:26,
          fontWeight:900, marginBottom:4, letterSpacing:2,
          animation:"winnerGlow 2s ease-in-out infinite" }}>
          ¡TENEMOS GANADOR!
        </h2>
        <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:28 }}>
          El sorteo de <strong style={{ color:"#fff" }}>{rifa.name}</strong> finalizó
        </p>
 
        {/* Info ganador */}
        <div style={{ background:"rgba(255,215,0,.07)", border:"1px solid rgba(255,215,0,.3)",
          borderRadius:16, padding:"22px 20px", marginBottom:24,
          animation:"winnerPop .5s .2s ease-out both" }}>
          <div style={{ marginBottom:14 }}>
            <div style={{ color:"rgba(255,255,255,.35)", fontSize:10, textTransform:"uppercase",
              letterSpacing:2, marginBottom:4 }}>Número ganador</div>
            <div style={{ fontSize:56, fontWeight:900, color:YELLOW,
              fontFamily:"'Cinzel',serif", lineHeight:1,
              textShadow:`0 0 20px rgba(255,215,0,.6)` }}>{winner.number}</div>
          </div>
 
          <div style={{ height:1, background:"rgba(255,215,0,.15)", margin:"14px 0" }}/>
 
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
            {winner.avatar && <span style={{ fontSize:32 }}>{winner.avatar}</span>}
            <div>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:10, textTransform:"uppercase", letterSpacing:2 }}>Ganador</div>
              <div style={{ color:"#fff", fontSize:22, fontWeight:700 }}>{winner.name}</div>
            </div>
          </div>
 
          <div style={{ marginTop:14, display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(0,200,83,.1)", border:"1px solid rgba(0,200,83,.3)",
            borderRadius:20, padding:"6px 16px" }}>
            <span style={{ fontSize:16 }}>💰</span>
            <span style={{ color:"#00C853", fontWeight:900, fontSize:18, fontFamily:"'Cinzel',serif" }}>
              {typeof rifa.prize === "number" ? `${rifa.prize.toLocaleString()} cr.` : rifa.prize}
            </span>
          </div>
        </div>
 
        <button onClick={onClose} style={{
          background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,
          border:"none", borderRadius:12, padding:"15px 40px",
          color:"#000", fontSize:16, fontWeight:700, cursor:"pointer",
          fontFamily:"'Cinzel',serif", letterSpacing:1, textTransform:"uppercase",
          boxShadow:`0 4px 24px rgba(255,215,0,.4)`, width:"100%",
        }}>🎉 ¡Felicitaciones!</button>
      </div>
    </div>
  );
}