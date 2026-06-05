import React, { useEffect, useState } from "react";
 
const CONFIG = {
  success: { color:"#00C853", bg:"rgba(0,200,83,.08)",  border:"rgba(0,200,83,.3)",  icon:"✓", label:"Éxito"    },
  error:   { color:"#FF5252", bg:"rgba(255,82,82,.08)", border:"rgba(255,82,82,.3)", icon:"✕", label:"Error"    },
  warn:    { color:"#FFD700", bg:"rgba(255,215,0,.07)", border:"rgba(255,215,0,.3)", icon:"⚠", label:"Atención" },
  info:    { color:"#4ECDC4", bg:"rgba(78,205,196,.07)",border:"rgba(78,205,196,.3)",icon:"ℹ", label:"Info"     },
};
 
export function Toast({ notif }) {
  const [show, setShow] = useState(false);
 
  useEffect(() => {
    if (!notif) { setShow(false); return; }
    setShow(false);
    const t = setTimeout(() => setShow(true), 20);
    return () => clearTimeout(t);
  }, [notif]);
 
  if (!notif) return null;
  const c = CONFIG[notif.type] || CONFIG.info;
 
  return (
    <>
      <style>{`
        @keyframes toastIn  { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes toastOut { from{transform:translateX(0);opacity:1}    to{transform:translateX(110%);opacity:0} }
        @keyframes iconPop  { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }
      `}</style>
      <div style={{
        position:"fixed", top:70, right:16, zIndex:9999,
        width:"min(340px,92vw)",
        background:"rgba(10,10,20,.96)", backdropFilter:"blur(10px)",
        border:`1px solid ${c.border}`,
        borderLeft:`3px solid ${c.color}`,
        borderRadius:12, padding:"13px 16px",
        display:"flex", alignItems:"center", gap:12,
        boxShadow:`0 8px 32px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04)`,
        fontFamily:"'Barlow Condensed',sans-serif",
        animation:`${show?"toastIn":"toastOut"} .3s ease forwards`,
      }}>
        <div style={{
          width:34, height:34, borderRadius:"50%", flexShrink:0,
          background:c.bg, border:`1px solid ${c.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:c.color, fontSize:16, fontWeight:900,
          animation:"iconPop .3s ease",
        }}>{c.icon}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:c.color, fontSize:10, textTransform:"uppercase",
            letterSpacing:1.5, fontWeight:700, marginBottom:1 }}>{c.label}</div>
          <div style={{ color:"rgba(255,255,255,.85)", fontSize:14, lineHeight:1.3 }}>{notif.msg}</div>
        </div>
      </div>
    </>
  );
}