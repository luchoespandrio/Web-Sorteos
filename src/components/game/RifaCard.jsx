import React from "react";
import { COLORS } from "../../utils/constants";
const { YELLOW, YELLOW2 } = COLORS;
 
export function RifaCard({ rifa, currentUser, onSelect }) {
  const total   = rifa.totalNumbers || 100;
  const sold    = Object.values(rifa.numbers).filter(n => n.status==="vendido"||n.status==="reservado").length;
  const pct     = Math.round((sold/total)*100);
  const myNums  = Object.entries(rifa.numbers).filter(([,v]) => v.userId===currentUser.id);
  const isFin   = rifa.status==="finished";
  const isRTD   = rifa.status==="readyToDraw";
  const isAct   = rifa.status==="active";
 
  return (
    <>
      <style>{`
        @keyframes readyPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,.3)}50%{box-shadow:0 0 18px 4px rgba(255,215,0,.2)}}
        @keyframes barShimmer{0%{background-position:-200%}100%{background-position:200%}}
        .rifacard:hover{transform:translateY(-5px)!important}
      `}</style>
      <div
        className="rifacard"
        onClick={() => !isFin && onSelect(rifa)}
        style={{
          background:"#0d0d1a",
          border:`1px solid ${isFin?"rgba(255,215,0,.2)":isRTD?"rgba(255,215,0,.5)":"rgba(255,255,255,.08)"}`,
          borderRadius:14, overflow:"hidden",
          cursor:!isFin?"pointer":"default",
          transition:"transform .2s, box-shadow .2s, border-color .2s",
          boxShadow: isRTD?"0 0 28px rgba(255,215,0,.12)":isFin?"none":"0 2px 16px rgba(0,0,0,.3)",
          animation: isRTD?"readyPulse 2.5s ease-in-out infinite":undefined,
          opacity: isFin?.8:1,
        }}
      >
        {/* Imagen/icono */}
        <div style={{
          height:140, position:"relative",
          background: isFin
            ? "linear-gradient(135deg,#141008,#0d0d14)"
            : isRTD ? "linear-gradient(135deg,#1a1500,#0d0d14)"
            : "linear-gradient(135deg,#0f0f1e,#0d0d14)",
          display:"flex", alignItems:"center", justifyContent:"center",
          borderBottom:"1px solid rgba(255,255,255,.05)",
        }}>
          <span style={{ fontSize:64, filter:"drop-shadow(0 4px 12px rgba(0,0,0,.5))" }}>{rifa.icon}</span>
 
          {/* Badge precio */}
          <div style={{ position:"absolute", top:10, right:10,
            background:"rgba(0,0,0,.6)", border:"1px solid rgba(255,215,0,.4)",
            backdropFilter:"blur(4px)", borderRadius:20, padding:"3px 11px",
            color:YELLOW, fontSize:12, fontWeight:700 }}>
            {rifa.pricePerNumber} cr.
          </div>
 
          {/* Badge mis números */}
          {myNums.length>0&&(
            <div style={{ position:"absolute", top:10, left:10,
              background:"rgba(0,200,83,.15)", border:"1px solid rgba(0,200,83,.4)",
              backdropFilter:"blur(4px)", borderRadius:20, padding:"3px 11px",
              color:"#00C853", fontSize:11, fontWeight:700 }}>
              ✓ {myNums.length} núm.
            </div>
          )}
 
          {/* Overlay sorteada */}
          {isFin&&(
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.55)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ background:"rgba(255,215,0,.9)", borderRadius:8,
                padding:"7px 18px", fontFamily:"'Cinzel',serif",
                fontWeight:900, fontSize:13, color:"#000", letterSpacing:1.5 }}>
                🏆 SORTEADA
              </div>
            </div>
          )}
 
          {/* Overlay lista para sortear */}
          {isRTD&&(
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.4)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ background:"rgba(255,215,0,.15)", border:"1px solid rgba(255,215,0,.7)",
                backdropFilter:"blur(4px)", borderRadius:8, padding:"7px 16px",
                fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:12,
                color:YELLOW, letterSpacing:1 }}>🎰 Lista para sortear</div>
            </div>
          )}
        </div>
 
        {/* Body */}
        <div style={{ padding:"14px 16px" }}>
          <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fff", fontSize:15, fontWeight:700, marginBottom:2 }}>{rifa.name}</h3>
          <p style={{ color:"rgba(255,255,255,.35)", fontSize:12, marginBottom:12 }}>{rifa.subtitle}</p>
 
          {/* Ganador */}
          {isFin&&rifa.winner&&(
            <div style={{ background:"rgba(255,215,0,.07)", border:"1px solid rgba(255,215,0,.2)",
              borderRadius:9, padding:"9px 12px", marginBottom:12, textAlign:"center" }}>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:10, textTransform:"uppercase", letterSpacing:1 }}>
                Ganador · Nro {rifa.winner.number}
              </div>
              <div style={{ color:YELLOW, fontWeight:700, fontSize:14 }}>{rifa.winner.name}</div>
            </div>
          )}
 
          {/* Badge todos vendidos */}
          {isRTD&&(
            <div style={{ background:"rgba(255,215,0,.06)", border:"1px solid rgba(255,215,0,.2)",
              borderRadius:9, padding:"8px 12px", marginBottom:12,
              display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:14 }}>✅</span>
              <div>
                <div style={{ color:YELLOW, fontSize:12, fontWeight:700 }}>¡Todos los números vendidos!</div>
                <div style={{ color:"rgba(255,255,255,.3)", fontSize:10 }}>El sorteo se realizará en breve</div>
              </div>
            </div>
          )}
 
          {/* Progreso */}
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ color:"rgba(255,255,255,.35)", fontSize:11 }}>{sold}/{total} números</span>
              <span style={{ color:pct===100?YELLOW:"rgba(255,255,255,.5)", fontSize:11, fontWeight:700 }}>{pct}%</span>
            </div>
            <div style={{ height:5, background:"rgba(255,255,255,.07)", borderRadius:3, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${pct}%`, borderRadius:3,
                background: pct===100
                  ? `linear-gradient(90deg,${YELLOW2},${YELLOW})`
                  : `linear-gradient(90deg,rgba(255,180,0,.6),${YELLOW2})`,
                transition:"width .5s ease",
                backgroundSize:"200% 100%",
                animation: pct>0&&pct<100?"barShimmer 2s linear infinite":undefined,
              }}/>
            </div>
          </div>
 
          {/* Premio + botón */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ color:"rgba(255,255,255,.25)", fontSize:9, letterSpacing:1.5, textTransform:"uppercase" }}>Premio</div>
              <div style={{ color:"#fff", fontSize:15, fontWeight:700 }}>{rifa.prize}</div>
            </div>
            {isAct&&(
              <div style={{ background:`linear-gradient(135deg,${YELLOW2},${YELLOW})`,
                borderRadius:8, padding:"8px 16px", color:"#000",
                fontSize:12, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif" }}>
                Elegir números
              </div>
            )}
            {isRTD&&(
              <div style={{ background:"rgba(255,215,0,.1)", border:"1px solid rgba(255,215,0,.4)",
                borderRadius:8, padding:"8px 14px", color:YELLOW,
                fontSize:12, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif" }}>
                🎰 Ver sorteo
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}