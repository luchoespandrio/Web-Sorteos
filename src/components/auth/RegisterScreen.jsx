import React, { useState } from "react";
import { CasinoBackground } from "./AgeVerificationScreen";
 
const YELLOW="#fbbf24"; const YELLOW2="#f59e0b";
const V="#7c3aed"; const VL="#a855f7"; const OR="#f97316"; const GR="#22c55e";
 
const AVATARS = ["🎯","🌟","💎","🔥","⚡","🎭","🃏","🎲","🎪","🏆","🎠","🌈"];
 
export function RegisterScreen({ onBack, onSubmit }) {
  const [form, setForm]   = useState({ name:"", username:"", password:"", confirm:"", avatar:"🎯" });
  const [error, setError] = useState("");
  const [sent, setSent]   = useState(false);
 
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
 
  const handleSubmit = () => {
    if (!form.name.trim()||!form.username.trim()||!form.password.trim()) {
      setError("Completá todos los campos obligatorios"); return;
    }
    if (form.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres"); return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden"); return;
    }
    setError("");
    onSubmit({ name:form.name.trim(), username:form.username.trim().toLowerCase(),
      password:form.password, avatar:form.avatar });
    setSent(true);
  };
 
  if (sent) return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Barlow Condensed',sans-serif",position:"relative",overflow:"hidden" }}>
      <CasinoBackground/>
      <div style={{ position:"relative",zIndex:1,width:"min(420px,92vw)",
        background:"rgba(8,8,18,.95)",border:`1px solid ${GR}55`,borderRadius:20,
        padding:"44px 32px",textAlign:"center",backdropFilter:"blur(12px)" }}>
        <div style={{ fontSize:64,marginBottom:16 }}>🎉</div>
        <h2 style={{ fontFamily:"'Cinzel',serif",color:GR,fontSize:24,fontWeight:900,marginBottom:10 }}>
          ¡Solicitud enviada!
        </h2>
        <p style={{ color:"rgba(255,255,255,.55)",fontSize:15,lineHeight:1.7,marginBottom:24 }}>
          Tu solicitud de registro fue enviada al equipo.<br/>
          Una vez aprobada, podrás ingresar con tu usuario y contraseña.
        </p>
        <div style={{ background:"rgba(34,197,94,.06)",border:"1px solid rgba(34,197,94,.2)",
          borderRadius:12,padding:"14px 18px",marginBottom:24 }}>
          <div style={{ color:"rgba(255,255,255,.4)",fontSize:12,marginBottom:4 }}>Tu usuario</div>
          <div style={{ color:GR,fontWeight:700,fontSize:18 }}>@{form.username}</div>
        </div>
        <button onClick={onBack} style={{ width:"100%",padding:"14px",
          background:`linear-gradient(135deg,${V},${VL})`,border:"none",borderRadius:10,
          color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",
          fontFamily:"'Cinzel',serif",letterSpacing:.5 }}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
 
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Barlow Condensed',sans-serif",position:"relative",overflow:"hidden" }}>
      <CasinoBackground/>
      <div style={{ position:"relative",zIndex:1,width:"min(460px,92vw)",
        background:"rgba(8,8,18,.95)",border:"1px solid rgba(124,58,237,.35)",
        borderRadius:20,padding:"40px 32px",backdropFilter:"blur(12px)",
        animation:"cardBorderPulse 3s ease-in-out infinite" }}>
 
        {/* Logo */}
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ fontSize:44,marginBottom:8,filter:"drop-shadow(0 0 16px rgba(124,58,237,.5))" }}>👑</div>
          <div>
            <span style={{ fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:900,color:YELLOW,letterSpacing:5 }}>RIFAS</span>
            <span style={{ fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:400,color:"#fff",letterSpacing:5 }}> REAL</span>
          </div>
          <p style={{ color:VL,fontSize:12,letterSpacing:3,marginTop:6,textTransform:"uppercase" }}>Crear cuenta</p>
        </div>
 
        <div style={{ height:1,background:"linear-gradient(90deg,transparent,rgba(124,58,237,.5),transparent)",marginBottom:24 }}/>
 
        {/* Avatar picker */}
        <div style={{ marginBottom:18 }}>
          <label style={{ color:"rgba(255,255,255,.4)",fontSize:10,letterSpacing:1.5,
            textTransform:"uppercase",display:"block",marginBottom:10 }}>Elegí tu avatar</label>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
            {AVATARS.map(a=>(
              <button key={a} onClick={()=>set("avatar",a)} style={{
                width:42,height:42,borderRadius:10,fontSize:20,cursor:"pointer",
                background:form.avatar===a?`${V}30`:"rgba(255,255,255,.04)",
                border:`2px solid ${form.avatar===a?VL:"rgba(255,255,255,.1)"}`,
                transition:"all .15s",
              }}>{a}</button>
            ))}
          </div>
          <div style={{ marginTop:10,display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:40,height:40,borderRadius:"50%",background:`${V}25`,
              border:`2px solid ${VL}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>
              {form.avatar}
            </div>
            <span style={{ color:"rgba(255,255,255,.4)",fontSize:13 }}>Así te verán los demás jugadores</span>
          </div>
        </div>
 
        {/* Campos */}
        {[
          { k:"name",     label:"NOMBRE COMPLETO",  type:"text",     ph:"Tu nombre", icon:"👤" },
          { k:"username", label:"USUARIO",           type:"text",     ph:"Sin espacios, ej: juanperez", icon:"@" },
          { k:"password", label:"CONTRASEÑA",        type:"password", ph:"Mínimo 4 caracteres", icon:"🔒" },
          { k:"confirm",  label:"CONFIRMAR CONTRASEÑA", type:"password", ph:"Repetí tu contraseña", icon:"🔒" },
        ].map(f=>(
          <div key={f.k} style={{ marginBottom:14 }}>
            <label style={{ color:"rgba(255,255,255,.4)",fontSize:10,letterSpacing:1.5,
              textTransform:"uppercase",display:"block",marginBottom:6 }}>{f.label}</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",
                color:"rgba(255,255,255,.3)",fontSize:f.icon==="@"?15:14 }}>{f.icon}</span>
              <input type={f.type} value={form[f.k]}
                onChange={e=>set(f.k, f.k==="username"?e.target.value.replace(/\s/g,""):e.target.value)}
                placeholder={f.ph} style={{
                  width:"100%",background:"rgba(124,58,237,.08)",
                  border:"1px solid rgba(124,58,237,.2)",borderRadius:9,
                  padding:"13px 13px 13px 40px",color:"#fff",fontSize:15,outline:"none",
                  fontFamily:"'Barlow Condensed',sans-serif",boxSizing:"border-box",transition:"border-color .2s",
                }}
                onFocus={e=>e.target.style.borderColor=VL}
                onBlur={e=>e.target.style.borderColor="rgba(124,58,237,.2)"}
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
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
 
        <button onClick={handleSubmit} style={{
          width:"100%",padding:"15px",
          background:`linear-gradient(135deg,${OR},#ea580c)`,
          border:"none",borderRadius:10,color:"#fff",fontSize:16,fontWeight:700,
          cursor:"pointer",fontFamily:"'Cinzel',serif",textTransform:"uppercase",letterSpacing:.5,
          boxShadow:"0 4px 24px rgba(249,115,22,.35)",marginBottom:14,
        }}>
          Enviar solicitud de registro
        </button>
 
        <button onClick={onBack} style={{ width:"100%",padding:"11px",
          background:"transparent",border:"1px solid rgba(255,255,255,.1)",
          borderRadius:9,color:"rgba(255,255,255,.4)",fontSize:14,cursor:"pointer",
          fontFamily:"'Barlow Condensed',sans-serif" }}>
          ← Ya tengo cuenta, ingresar
        </button>
 
        <p style={{ color:"rgba(255,255,255,.15)",fontSize:11,marginTop:16,textAlign:"center",lineHeight:1.6 }}>
          Tu cuenta será revisada y aprobada por el equipo antes de poder ingresar.
        </p>
      </div>
    </div>
  );
}
 