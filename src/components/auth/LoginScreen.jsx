import React from "react";
import { COLORS } from "../../utils/constants";
import { CasinoBackground } from "./AgeVerificationScreen";
 
const { YELLOW, YELLOW2 } = COLORS;
 
export function LoginScreen({ form, setForm, onLogin, error }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif",
      position:"relative", overflow:"hidden" }}>
 
      <CasinoBackground />
 
      <div style={{
        position:"relative", zIndex:1,
        width:"min(400px,92vw)",
        background:"rgba(8,8,18,.92)",
        border:"1px solid rgba(255,215,0,.25)",
        borderRadius:20, padding:"44px 32px",
        textAlign:"center", backdropFilter:"blur(12px)",
        animation:"cardBorderPulse 3s ease-in-out infinite",
      }}>
        {/* Logo */}
        <div style={{ marginBottom:30 }}>
          <div style={{ fontSize:48, marginBottom:8, filter:"drop-shadow(0 0 16px rgba(255,215,0,.4))" }}>👑</div>
          <div>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:30, fontWeight:900,
              color:YELLOW, letterSpacing:5, animation:"casinoGlow 3s ease-in-out infinite" }}>
              RIFAS
            </span>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:30, fontWeight:400, color:"#fff", letterSpacing:5 }}> REAL</span>
          </div>
          <p style={{ color:"rgba(255,255,255,.3)", fontSize:11, letterSpacing:4, marginTop:6, textTransform:"uppercase" }}>
            Sistema de Rifas
          </p>
        </div>
 
        <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(255,215,0,.3),transparent)", marginBottom:26 }}/>
 
        {/* Campos */}
        {[
          { key:"username", label:"USUARIO",     type:"text",     placeholder:"Ingresá tu usuario",     icon:"👤" },
          { key:"password", label:"CONTRASEÑA",  type:"password", placeholder:"Ingresá tu contraseña",  icon:"🔒" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom:16, textAlign:"left" }}>
            <label style={{ color:"rgba(255,255,255,.4)", fontSize:10, letterSpacing:1.5,
              textTransform:"uppercase", display:"block", marginBottom:6 }}>{f.label}</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
                color:"rgba(255,255,255,.3)", fontSize:15 }}>{f.icon}</span>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && onLogin()}
                placeholder={f.placeholder}
                style={{ width:"100%", background:"rgba(255,255,255,.05)",
                  border:"1px solid rgba(255,255,255,.1)", borderRadius:9,
                  padding:"13px 13px 13px 40px", color:"#fff", fontSize:15, outline:"none",
                  fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:.5, boxSizing:"border-box",
                  transition:"border-color .2s" }}
                onFocus={e => e.target.style.borderColor="rgba(255,215,0,.4)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,.1)"}
              />
            </div>
          </div>
        ))}
 
        {error && (
          <div style={{ background:"rgba(255,50,50,.08)", border:"1px solid rgba(255,50,50,.25)",
            borderRadius:8, padding:"10px 14px", marginBottom:14,
            color:"#FF6464", fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
            ⚠ {error}
          </div>
        )}
 
        <button onClick={onLogin} style={{
          width:"100%", padding:"15px",
          background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,
          border:"none", borderRadius:10, color:"#000",
          fontSize:15, fontWeight:700, letterSpacing:2, cursor:"pointer",
          fontFamily:"'Cinzel',serif", textTransform:"uppercase", marginBottom:18,
          boxShadow:"0 4px 24px rgba(255,215,0,.25)", transition:"all .2s",
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow="0 6px 32px rgba(255,215,0,.4)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow="0 4px 24px rgba(255,215,0,.25)"}
        >INGRESAR →</button>
 
        <div style={{ background:"rgba(255,255,255,.02)", borderRadius:9,
          padding:"11px 14px", border:"1px solid rgba(255,255,255,.06)" }}>
          <p style={{ color:"rgba(255,255,255,.22)", fontSize:11, lineHeight:2 }}>
            Admin: <span style={{ color:"rgba(255,215,0,.6)" }}>admin / admin</span>
            <br/>Supervisor: <span style={{ color:"rgba(255,215,0,.6)" }}>supervisor / super123</span>
            <br/>Jugador: <span style={{ color:"rgba(255,215,0,.6)" }}>juanperez / 1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}