import React from "react";
import { CasinoBackground } from "./AgeVerificationScreen";
 
const YELLOW="#fbbf24"; const YELLOW2="#f59e0b";
const V="#7c3aed"; const VL="#a855f7"; const OR="#f97316";
 
export function LoginScreen({ form, setForm, onLogin, error, onRegister }) {
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Barlow Condensed',sans-serif",position:"relative",overflow:"hidden" }}>
      <CasinoBackground/>
      <div style={{ position:"relative",zIndex:1,width:"min(400px,92vw)",
        background:"rgba(8,8,18,.95)",border:"1px solid rgba(124,58,237,.3)",
        borderRadius:20,padding:"44px 32px",textAlign:"center",
        backdropFilter:"blur(12px)",animation:"cardBorderPulse 3s ease-in-out infinite" }}>
 
        {/* Logo */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:48,marginBottom:8,filter:"drop-shadow(0 0 16px rgba(251,191,36,.4))" }}>👑</div>
          <div>
            <span style={{ fontFamily:"'Cinzel',serif",fontSize:28,fontWeight:900,color:YELLOW,letterSpacing:5,animation:"goldGlow 3s ease-in-out infinite" }}>RIFAS</span>
            <span style={{ fontFamily:"'Cinzel',serif",fontSize:28,fontWeight:400,color:"#fff",letterSpacing:5 }}> REAL</span>
          </div>
          <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,letterSpacing:4,marginTop:6,textTransform:"uppercase" }}>Sistema de Rifas</p>
        </div>
 
        <div style={{ height:1,background:"linear-gradient(90deg,transparent,rgba(124,58,237,.4),transparent)",marginBottom:24 }}/>
 
        {/* Campos */}
        {[
          { key:"username", label:"USUARIO",    type:"text",     ph:"Ingresá tu usuario",    icon:"👤" },
          { key:"password", label:"CONTRASEÑA", type:"password", ph:"Ingresá tu contraseña", icon:"🔒" },
        ].map(f=>(
          <div key={f.key} style={{ marginBottom:14,textAlign:"left" }}>
            <label style={{ color:"rgba(255,255,255,.4)",fontSize:10,letterSpacing:1.5,
              textTransform:"uppercase",display:"block",marginBottom:6 }}>{f.label}</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",
                color:"rgba(255,255,255,.3)",fontSize:15 }}>{f.icon}</span>
              <input type={f.type} value={form[f.key]}
                onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&onLogin()}
                placeholder={f.ph} style={{
                  width:"100%",background:"rgba(124,58,237,.08)",
                  border:"1px solid rgba(124,58,237,.2)",borderRadius:9,
                  padding:"13px 13px 13px 40px",color:"#fff",fontSize:15,outline:"none",
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5,boxSizing:"border-box",transition:"border-color .2s",
                }}
                onFocus={e=>e.target.style.borderColor=VL}
                onBlur={e=>e.target.style.borderColor="rgba(124,58,237,.2)"}
              />
            </div>
          </div>
        ))}
 
        {error&&(
          <div style={{ background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",
            borderRadius:8,padding:"10px 14px",marginBottom:14,
            color:"#f87171",fontSize:13,display:"flex",alignItems:"center",gap:8 }}>
            ⚠ {error}
          </div>
        )}
 
        <button onClick={onLogin} style={{
          width:"100%",padding:"15px",
          background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,
          border:"none",borderRadius:10,color:"#000",fontSize:16,fontWeight:700,
          letterSpacing:2,cursor:"pointer",fontFamily:"'Cinzel',serif",textTransform:"uppercase",
          boxShadow:"0 4px 24px rgba(251,191,36,.3)",marginBottom:14,transition:"all .2s",
        }}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 6px 32px rgba(251,191,36,.5)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="0 4px 24px rgba(251,191,36,.3)"}
        >INGRESAR →</button>
 
        {/* Divider */}
        <div style={{ display:"flex",alignItems:"center",gap:10,margin:"4px 0 14px" }}>
          <div style={{ flex:1,height:1,background:"rgba(255,255,255,.08)" }}/>
          <span style={{ color:"rgba(255,255,255,.2)",fontSize:12 }}>¿No tenés cuenta?</span>
          <div style={{ flex:1,height:1,background:"rgba(255,255,255,.08)" }}/>
        </div>
 
        <button onClick={onRegister} style={{
          width:"100%",padding:"13px",
          background:`linear-gradient(135deg,${V},${VL})`,
          border:"none",borderRadius:10,color:"#fff",fontSize:15,fontWeight:700,
          cursor:"pointer",fontFamily:"'Cinzel',serif",letterSpacing:.5,
          boxShadow:`0 4px 20px rgba(124,58,237,.3)`,transition:"all .2s",
        }}
          onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 6px 28px rgba(124,58,237,.5)`}
          onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 4px 20px rgba(124,58,237,.3)`}
        >🎮 Registrarme</button>
 
        <p style={{ color:"rgba(255,255,255,.15)",fontSize:10,marginTop:16,lineHeight:1.8 }}>
          Admin: admin / admin &nbsp;·&nbsp; Supervisor: supervisor / super123
        </p>
      </div>
    </div>
  );
}
 