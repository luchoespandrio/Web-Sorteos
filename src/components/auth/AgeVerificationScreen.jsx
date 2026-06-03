import React, { useState, useEffect } from "react";
import { COLORS } from "../../utils/constants";
 
const { YELLOW, YELLOW2 } = COLORS;
 
// ─── Elementos flotantes ──────────────────────────────────────────────────────
const FLOATERS = [
  { emoji:"🎰", left:"4%",  top:"8%",   size:44, dur:14, delay:0   },
  { emoji:"🃏", left:"87%", top:"5%",   size:32, dur:10, delay:2   },
  { emoji:"🎲", left:"16%", top:"74%",  size:38, dur:16, delay:4   },
  { emoji:"💎", left:"76%", top:"66%",  size:28, dur:12, delay:1   },
  { emoji:"💰", left:"50%", top:"90%",  size:34, dur:11, delay:3   },
  { emoji:"⭐", left:"65%", top:"11%",  size:26, dur:13, delay:5   },
  { emoji:"🏆", left:"30%", top:"20%",  size:50, dur:18, delay:0.5 },
  { emoji:"🎯", left:"91%", top:"40%",  size:30, dur:12, delay:7   },
  { emoji:"🃏", left:"6%",  top:"50%",  size:28, dur:15, delay:2.5 },
  { emoji:"🎲", left:"58%", top:"3%",   size:30, dur:10, delay:6   },
  { emoji:"💫", left:"80%", top:"82%",  size:24, dur:17, delay:3.5 },
  { emoji:"🎴", left:"40%", top:"95%",  size:30, dur:13, delay:8   },
  { emoji:"🔥", left:"22%", top:"40%",  size:26, dur:11, delay:9   },
  { emoji:"⚡", left:"70%", top:"28%",  size:22, dur:14, delay:1.5 },
  { emoji:"🎪", left:"12%", top:"92%",  size:20, dur:16, delay:4.5 },
  { emoji:"💎", left:"94%", top:"72%",  size:20, dur:12, delay:6.5 },
];
 
// ─── Fondo animado (reutilizable) ─────────────────────────────────────────────
export function CasinoBackground() {
  useEffect(() => {
    if (document.getElementById("casino-keyframes")) return;
    const s = document.createElement("style");
    s.id = "casino-keyframes";
    s.textContent = `
      @keyframes casinoDrift {
        0%   { transform: translate(0,0) rotate(0deg); }
        20%  { transform: translate(14px,-22px) rotate(72deg); }
        40%  { transform: translate(-10px,-36px) rotate(144deg); }
        60%  { transform: translate(-20px,-14px) rotate(216deg); }
        80%  { transform: translate(9px,-6px) rotate(288deg); }
        100% { transform: translate(0,0) rotate(360deg); }
      }
      @keyframes casinoGlow {
        0%,100% { text-shadow: 0 0 12px rgba(255,215,0,.4), 0 0 24px rgba(255,215,0,.15); }
        50%      { text-shadow: 0 0 24px rgba(255,215,0,1), 0 0 48px rgba(255,215,0,.6), 0 0 96px rgba(255,215,0,.25); }
      }
      @keyframes cardBorderPulse {
        0%,100% { border-color: rgba(255,215,0,.25); box-shadow: 0 24px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(255,215,0,.04); }
        50%      { border-color: rgba(255,215,0,.55); box-shadow: 0 24px 80px rgba(0,0,0,.8), 0 0 50px rgba(255,215,0,.1); }
      }
      @keyframes spotPulse {
        0%,100% { opacity:.55; }
        50%      { opacity:1; }
      }
      @keyframes scanline {
        0%   { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
    `;
    document.head.appendChild(s);
  }, []);
 
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {/* Base oscura */}
      <div style={{ position:"absolute", inset:0, background:"#040408" }}/>
 
      {/* Grid dorado */}
      <div style={{ position:"absolute", inset:0, opacity:.022,
        backgroundImage:"linear-gradient(rgba(255,215,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,1) 1px,transparent 1px)",
        backgroundSize:"65px 65px" }}/>
 
      {/* Spotlight desde abajo */}
      <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"70%", height:"55%",
        background:"radial-gradient(ellipse at bottom, rgba(255,215,0,.07) 0%, transparent 70%)",
        animation:"spotPulse 5s ease-in-out infinite" }}/>
 
      {/* Glow esquinas */}
      <div style={{ position:"absolute", bottom:0, left:0, width:"35%", height:"40%", background:"radial-gradient(ellipse at bottom left, rgba(124,77,255,.06) 0%, transparent 60%)" }}/>
      <div style={{ position:"absolute", top:0, right:0, width:"35%", height:"40%", background:"radial-gradient(ellipse at top right, rgba(255,140,0,.04) 0%, transparent 60%)" }}/>
 
      {/* Línea de escaneo sutil */}
      <div style={{ position:"absolute", left:0, right:0, height:2,
        background:"linear-gradient(90deg,transparent,rgba(255,215,0,.06),transparent)",
        animation:"scanline 8s linear infinite" }}/>
 
      {/* Elementos flotantes */}
      {FLOATERS.map((f, i) => (
        <div key={i} style={{
          position:"absolute", left:f.left, top:f.top, fontSize:f.size,
          opacity:.09, userSelect:"none",
          animation:`casinoDrift ${f.dur}s ease-in-out ${f.delay}s infinite`,
          filter:"blur(.4px)",
        }}>{f.emoji}</div>
      ))}
    </div>
  );
}
 
// ─── Pantalla verificación de edad ────────────────────────────────────────────
export function AgeVerificationScreen({ onVerified, onRejected }) {
  const [checked, setChecked] = useState(false);
 
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif",
      position:"relative", overflow:"hidden" }}>
 
      <CasinoBackground />
 
      {/* Card central */}
      <div style={{
        position:"relative", zIndex:1,
        width:"min(440px,92vw)",
        background:"rgba(8,8,18,.92)",
        border:"1px solid rgba(255,215,0,.25)",
        borderRadius:20, padding:"44px 36px",
        textAlign:"center", backdropFilter:"blur(12px)",
        animation:"cardBorderPulse 3s ease-in-out infinite",
      }}>
        {/* Corona + Logo */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:52, marginBottom:10, filter:"drop-shadow(0 0 16px rgba(255,215,0,.4))" }}>👑</div>
          <div>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:30, fontWeight:900,
              color:YELLOW, letterSpacing:5, animation:"casinoGlow 3s ease-in-out infinite" }}>
              RIFAS
            </span>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:30, fontWeight:400,
              color:"#fff", letterSpacing:5 }}> REAL</span>
          </div>
          <p style={{ color:"rgba(255,255,255,.3)", fontSize:11, letterSpacing:4, marginTop:6, textTransform:"uppercase" }}>
            Verificación de edad
          </p>
        </div>
 
        {/* Separador */}
        <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(255,215,0,.3),transparent)", marginBottom:24 }}/>
 
        {/* Aviso */}
        <div style={{ background:"rgba(255,215,0,.05)", border:"1px solid rgba(255,215,0,.15)",
          borderRadius:12, padding:"16px 18px", marginBottom:22 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>🔞</div>
          <p style={{ color:"rgba(255,255,255,.8)", fontSize:14, lineHeight:1.7 }}>
            Este sitio contiene <strong style={{ color:YELLOW }}>juegos de azar</strong> y está
            destinado exclusivamente a <strong style={{ color:YELLOW }}>mayores de 18 años</strong>.
          </p>
          <p style={{ color:"rgba(255,255,255,.3)", fontSize:12, marginTop:8, lineHeight:1.5 }}>
            Al ingresar declarás bajo tu responsabilidad que sos mayor de edad según la legislación vigente en tu país.
          </p>
        </div>
 
        {/* Checkbox */}
        <div onClick={() => setChecked(p => !p)} style={{
          display:"flex", alignItems:"center", gap:14, cursor:"pointer",
          background: checked ? "rgba(255,215,0,.05)" : "rgba(255,255,255,.02)",
          border:`1px solid ${checked ? "rgba(255,215,0,.3)" : "rgba(255,255,255,.07)"}`,
          borderRadius:10, padding:"13px 16px", marginBottom:22, textAlign:"left",
          transition:"all .2s", userSelect:"none",
        }}>
          <div style={{ width:22, height:22, borderRadius:5, flexShrink:0,
            border:`2px solid ${checked ? YELLOW : "rgba(255,255,255,.2)"}`,
            background: checked ? "rgba(255,215,0,.18)" : "transparent",
            display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}>
            {checked && <span style={{ color:YELLOW, fontSize:14, fontWeight:900 }}>✓</span>}
          </div>
          <p style={{ color: checked ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.55)", fontSize:13, lineHeight:1.5 }}>
            Confirmo que tengo <strong style={{ color:"#fff" }}>18 años o más</strong> y acepto los términos del sitio.
          </p>
        </div>
 
        {/* Botón ingresar */}
        <button onClick={() => checked && onVerified()} style={{
          width:"100%", padding:"15px",
          background: checked ? `linear-gradient(135deg,${YELLOW2},${YELLOW})` : "rgba(255,255,255,.05)",
          border: checked ? "none" : "1px solid rgba(255,255,255,.07)",
          borderRadius:10, color: checked ? "#000" : "rgba(255,255,255,.2)",
          fontSize:15, fontWeight:700, letterSpacing:2, cursor: checked ? "pointer" : "not-allowed",
          fontFamily:"'Cinzel',serif", textTransform:"uppercase", marginBottom:12,
          transition:"all .25s",
          boxShadow: checked ? `0 4px 24px rgba(255,215,0,.3)` : "none",
        }}>
          {checked ? "✦  Ingresar al sitio  ✦" : "Confirmá tu edad para continuar"}
        </button>
 
        {/* Botón salir */}
        <button onClick={onRejected} style={{
          width:"100%", padding:"10px", background:"transparent",
          border:"1px solid rgba(255,100,100,.2)", borderRadius:8,
          color:"rgba(255,100,100,.45)", fontSize:12, cursor:"pointer",
          fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1,
        }}>No soy mayor de edad — Salir</button>
 
        <p style={{ color:"rgba(255,255,255,.12)", fontSize:10, marginTop:16, lineHeight:1.7 }}>
          El juego puede crear dependencia. Jugá responsablemente. Prohibido para menores de 18 años.
        </p>
      </div>
    </div>
  );
}