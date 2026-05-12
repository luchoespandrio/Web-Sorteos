import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

// --- Constantes de colores ---
const YELLOW = "#FFD700";
const YELLOW2 = "#F0B90B";
const BALL_COLORS = [
  "#FF6B6B", "#FF8C00", "#FFD700", "#A8E063", "#4ECDC4",
  "#4D96FF", "#C77DFF", "#FF6CAE", "#95E1D3", "#F38181",
  "#6BCB77", "#FF4D4D", "#00C9FF", "#F7971E", "#c471ed",
];
const bColor = (n) => BALL_COLORS[parseInt(n) % BALL_COLORS.length];

// --- Componente Confetti (animación de celebración) ---
function Confetti() {
  const items = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: BALL_COLORS[i % BALL_COLORS.length],
    delay: `${Math.random() * 0.8}s`,
    dur: `${Math.random() * 1.4 + 1}s`,
    size: Math.random() * 10 + 5,
    round: Math.random() > 0.5,
  }));

  return (
    <>
      {items.map((c) => (
        <div
          key={c.id}
          style={{
            position: "fixed",
            left: c.left,
            top: "-12px",
            width: c.size,
            height: c.size,
            background: c.color,
            borderRadius: c.round ? "50%" : 2,
            pointerEvents: "none",
            animation: `bConfettiFall ${c.dur} ${c.delay} ease-in both`,
          }}
        />
      ))}
    </>
  );
}

// --- Componente Drum (animación del bolillero) ---
function Drum({ spinning, numbers, winnerNum }) {
  const displayNums = numbers.slice(0, 18);
  const count = displayNums.length;

  return (
    <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto" }}>
      {/* Bowl exterior */}
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle at 38% 32%, #1e1e38, #06060f)",
          border: `3px solid ${
            winnerNum ? YELLOW : spinning ? "rgba(255,215,0,.7)" : "rgba(201,168,76,.4)"
          }`,
          boxShadow: spinning
            ? "0 0 60px rgba(255,215,0,.45), 0 0 120px rgba(255,215,0,.15), inset 0 0 40px rgba(0,0,0,.6)"
            : winnerNum
            ? "0 0 50px rgba(255,215,0,.35), inset 0 0 30px rgba(0,0,0,.5)"
            : "0 0 20px rgba(201,168,76,.15), inset 0 0 25px rgba(0,0,0,.5)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "box-shadow .4s, border-color .4s",
        }}
      >
        {/* Anillo giratorio */}
        <div
          style={{
            position: "absolute",
            inset: 12,
            borderRadius: "50%",
            border: "1px dashed rgba(201,168,76,.18)",
            animation: spinning ? "bDrumSpin 1.2s linear infinite" : "none",
          }}
        />

        {/* Bolas en órbita */}
        {displayNums.map((num, i) => {
          const angle = (i / count) * 360 - 90;
          const r = 76;
          const isWinner = num === winnerNum;
          return (
            <div
              key={num}
              style={{
                position: "absolute",
                left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * r}px - 12px)`,
                top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * r}px - 12px)`,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: isWinner
                  ? `radial-gradient(circle at 33% 33%, rgba(255,255,255,.4), ${bColor(num)})`
                  : `radial-gradient(circle at 33% 33%, rgba(255,255,255,.22), ${bColor(num)})`,
                boxShadow: isWinner
                  ? `0 0 16px ${bColor(num)}, 0 0 30px ${bColor(num)}88`
                  : `0 2px 8px rgba(0,0,0,.5)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                fontWeight: 700,
                color: "#fff",
                animation: spinning
                  ? `bBallFloat ${0.5 + i * 0.07}s ease-in-out ${i * 0.05}s infinite`
                  : "none",
                transform: isWinner ? "scale(1.35)" : "scale(1)",
                transition: "transform .3s, box-shadow .3s",
                zIndex: isWinner ? 3 : 1,
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Centro: número ganador o estado */}
        <div style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
          {winnerNum ? (
            <div
              key={winnerNum}
              style={{
                width: 62,
                height: 62,
                borderRadius: "50%",
                background: bColor(winnerNum),
                boxShadow: `0 0 25px ${bColor(winnerNum)}, 0 0 50px ${bColor(winnerNum)}66`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 900,
                color: "#fff",
                animation: "bNumReveal .45s cubic-bezier(.34,1.56,.64,1)",
              }}
            >
              {winnerNum}
            </div>
          ) : spinning ? (
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,215,0,.1)",
                border: "2px solid rgba(255,215,0,.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "bDrumSpin .4s linear infinite",
              }}
            >
              <span style={{ fontSize: 20 }}>🎰</span>
            </div>
          ) : (
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 22, opacity: 0.4 }}>🎰</span>
            </div>
          )}
        </div>
      </div>

      {/* Base del bolillero */}
      <div
        style={{
          width: 80,
          height: 9,
          background: "linear-gradient(90deg, rgba(201,168,76,.1), rgba(201,168,76,.3), rgba(201,168,76,.1))",
          borderRadius: 5,
          margin: "7px auto 0",
          border: "1px solid rgba(201,168,76,.2)",
        }}
      />
    </div>
  );
}

// --- Componente Principal: BolilleroRifas ---
function BolilleroRifas({ rifa, users, currentUser, isAdmin, onWinner, onClose }) {
  // Construir pool: todos los números participantes con su dueño
  const pool = Object.entries(rifa.numbers || {})
    .filter(([, v]) => v.status === "reservado" || v.status === "vendido")
    .map(([num, v]) => ({ num, userId: v.userId }));

  // Números únicos para las bolas visuales
  const uniqueNums = [...new Set(pool.map((p) => p.num))];

  // Estado del bolillero
  const [phase, setPhase] = useState("ready"); // ready | spinning | revealing | done
  const [winnerNum, setWinnerNum] = useState(null);
  const [winnerUser, setWinnerUser] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const spinTimerRef = useRef(null);

  const prize = Object.keys(rifa.numbers || {}).length * rifa.pricePerNumber;
  const isMe = winnerUser?.id === currentUser?.id;

  // Manejar el giro del bolillero
  const handleSpin = useCallback(() => {
    if (phase !== "ready" || pool.length === 0) return;
    setPhase("spinning");

    // Duración aleatoria de la animación (3-5 segundos)
    const spinDuration = 3000 + Math.random() * 2000;

    spinTimerRef.current = setTimeout(() => {
      // Elegir ganador aleatorio del pool
      const picked = pool[Math.floor(Math.random() * pool.length)];
      const winner = users?.find((u) => u.id === picked.userId);

      setPhase("revealing");
      setWinnerNum(picked.num);
      setWinnerUser(winner || null);

      setTimeout(() => {
        setPhase("done");
        setShowConfetti(true);
        // Notificar al padre con el ganador
        onWinner({
          number: picked.num,
          userId: picked.userId,
          name: winner?.name || "Desconocido",
          avatar: winner?.avatar || "🎯",
        });
      }, 800);
    }, spinDuration);
  }, [phase, pool, users, onWinner]);

  // Limpiar el timer al desmontar
  useEffect(() => {
    return () => clearTimeout(spinTimerRef.current);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: "rgba(4,4,12,.97)",
        backdropFilter: "blur(14px)",
        fontFamily: "'Barlow Condensed', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Keyframes para animaciones */}
      <style jsx>{`
        @keyframes bDrumSpin {
          from { transform: rotate(0); }
          to { transform: rotate(360deg); }
        }
        @keyframes bBallFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.06); }
        }
        @keyframes bNumReveal {
          0% { transform: scale(0) rotate(-25deg); opacity: 0; }
          65% { transform: scale(1.25) rotate(6deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes bConfettiFall {
          0% { opacity: 1; transform: translateY(0) rotate(0); }
          100% { opacity: 0; transform: translateY(320px) rotate(720deg) scale(.3); }
        }
        @keyframes bWinnerSlide {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes bGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,.3); }
          50% { box-shadow: 0 0 50px rgba(255,215,0,.7); }
        }
      `}</style>

      {showConfetti && <Confetti />}

      {/* Header */}
      <div
        style={{
          background: "rgba(8,8,20,.95)",
          borderBottom: "1px solid rgba(201,168,76,.18)",
          padding: "0 24px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🎰</span>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              color: YELLOW,
              fontSize: 17,
              fontWeight: 900,
              letterSpacing: 3,
            }}
          >
            BOLILLERO
          </span>
          <span style={{ color: "rgba(255,255,255,.35)", fontSize: 13 }}>·</span>
          <span style={{ color: "rgba(255,255,255,.65)", fontSize: 14 }}>{rifa.name}</span>
          {/* Estado del bolillero */}
          <span
            style={{
              padding: "3px 11px",
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 600,
              background:
                phase === "spinning"
                  ? "rgba(255,215,0,.1)"
                  : phase === "done"
                  ? "rgba(0,200,83,.1)"
                  : "rgba(255,255,255,.04)",
              border: `1px solid ${
                phase === "spinning"
                  ? "rgba(255,215,0,.4)"
                  : phase === "done"
                  ? "rgba(0,200,83,.35)"
                  : "rgba(255,255,255,.1)"
              }`,
              color:
                phase === "spinning"
                  ? YELLOW
                  : phase === "done"
                  ? "#00C853"
                  : "rgba(255,255,255,.4)",
            }}
          >
            {phase === "ready"
              ? "Listo para sortear"
              : phase === "spinning"
              ? "🌀 Girando…"
              : phase === "revealing"
              ? "✨ Revelando…"
              : "✓ Finalizado"}
          </span>
        </div>
        {phase !== "spinning" && phase !== "revealing" && (
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.1)",
              color: "rgba(255,255,255,.5)",
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Contenido principal (2 columnas) */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          overflow: "hidden",
        }}
      >
        {/* Columna izquierda: Tambor + controles */}
        <div
          style={{
            background: "rgba(6,6,16,.8)",
            borderRight: "1px solid rgba(201,168,76,.07)",
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            overflowY: "auto",
          }}
        >
          <div>
            <p
              style={{
                color: "rgba(255,255,255,.3)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 2,
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              {uniqueNums.length} números en el bombo
            </p>
            <p
              style={{
                color: "rgba(255,255,255,.18)",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              Rango: {Math.min(...uniqueNums.map(Number))} –{" "}
              {Math.max(...uniqueNums.map(Number))}
            </p>
          </div>

          <Drum spinning={phase === "spinning"} numbers={uniqueNums} winnerNum={winnerNum} />

          {/* Número ganador (grande) */}
          {winnerNum && (
            <div
              style={{
                textAlign: "center",
                animation: "bWinnerSlide .5s ease both",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,.3)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                Número ganador
              </p>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: bColor(winnerNum),
                  boxShadow: `0 0 30px ${bColor(winnerNum)}, 0 0 60px ${bColor(winnerNum)}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#fff",
                  margin: "0 auto",
                  animation: "bGlow 2s ease-in-out infinite",
                }}
              >
                {winnerNum}
              </div>
            </div>
          )}

          {/* Botón principal (solo para admin) */}
          {isAdmin && (
            <div style={{ width: "100%", maxWidth: 280 }}>
              {phase === "ready" && pool.length > 0 && (
                <button
                  onClick={handleSpin}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
                    border: "none",
                    borderRadius: 12,
                    color: "#000",
                    fontSize: 16,
                    fontWeight: 900,
                    cursor: "pointer",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    boxShadow: "0 6px 24px rgba(255,215,0,.35)",
                    transition: "transform .15s, box-shadow .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,215,0,.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,215,0,.35)";
                  }}
                >
                  🎰 Girar Bolillero
                </button>
              )}

              {phase === "spinning" && (
                <div
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "rgba(255,215,0,.07)",
                    border: "1px solid rgba(255,215,0,.25)",
                    borderRadius: 12,
                    textAlign: "center",
                    color: YELLOW,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  <span
                    style={{
                      animation: "bDrumSpin 1s linear infinite",
                      display: "inline-block",
                      marginRight: 8,
                    }}
                  >
                    ⚙
                  </span>
                  Sorteando…
                </div>
              )}

              {phase === "done" && (
                <button
                  onClick={onClose}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "rgba(0,200,83,.12)",
                    border: "1px solid rgba(0,200,83,.35)",
                    borderRadius: 12,
                    color: "#00C853",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: 1,
                  }}
                >
                  ✓ Cerrar bolillero
                </button>
              )}
            </div>
          )}

          {!isAdmin && phase === "ready" && (
            <p
              style={{
                color: "rgba(255,255,255,.28)",
                fontSize: 13,
                textAlign: "center",
                maxWidth: 240,
                lineHeight: 1.6,
              }}
            >
              El admin iniciará el sorteo manualmente.
            </p>
          )}
        </div>

        {/* Columna derecha: Participantes + ganador */}
        <div style={{ overflowY: "auto", padding: "24px 22px" }}>
          {/* Banner del ganador */}
          {phase === "done" && winnerUser && (
            <div
              style={{
                background: isMe ? "rgba(255,215,0,.08)" : "rgba(10,10,24,.9)",
                border: `2px solid ${isMe ? YELLOW : "rgba(201,168,76,.4)"}`,
                borderRadius: 16,
                padding: "22px",
                marginBottom: 20,
                textAlign: "center",
                boxShadow: isMe ? "0 0 50px rgba(255,215,0,.2)" : "none",
                animation: "bWinnerSlide .5s ease both",
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 10 }}>
                {isMe ? "🎉" : "🏆"}
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,.35)",
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                {isMe ? "¡Felicitaciones!" : "¡Tenemos un ganador!"}
              </p>
              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: isMe ? YELLOW : "#fff",
                  fontSize: 24,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                {winnerUser.avatar} {winnerUser.name}
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,.4)",
                  fontSize: 13,
                  marginBottom: 18,
                }}
              >
                con el número{" "}
                <span
                  style={{
                    display: "inline-flex",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: bColor(winnerNum),
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    boxShadow: `0 2px 8px ${bColor(winnerNum)}77`,
                    verticalAlign: "middle",
                    margin: "0 4px",
                  }}
                >
                  {winnerNum}
                </span>
                del sorteo de{" "}
                <strong style={{ color: "rgba(255,255,255,.7)" }}>{rifa.name}</strong>
              </p>
              <div
                style={{
                  background: "rgba(255,215,0,.07)",
                  border: "2px solid rgba(255,215,0,.28)",
                  borderRadius: 12,
                  padding: "14px",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,.3)",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  Premio
                </p>
                <p
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: YELLOW,
                    fontSize: 36,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {prize.toLocaleString()}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,.3)",
                    fontSize: 11,
                    letterSpacing: 2,
                    marginTop: 2,
                  }}
                >
                  CRÉDITOS
                </p>
              </div>
              {isMe && (
                <p
                  style={{
                    color: "#00C853",
                    fontSize: 13,
                    marginTop: 12,
                    fontWeight: 600,
                  }}
                >
                  ✓ Los créditos serán acreditados a tu cuenta
                </p>
              )}
            </div>
          )}

          {/* Lista de participantes */}
          <div>
            <h3
              style={{
                fontFamily: "'Cinzel', serif",
                color: "rgba(255,255,255,.7)",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 14,
                letterSpacing: 1,
              }}
            >
              Participantes · {pool.length} números en juego
            </h3>

            <div
              style={{
                background: "rgba(8,8,20,.8)",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                <thead>
                  <tr style={{ background: "rgba(255,255,255,.025)" }}>
                    {["Jugador", "Números comprados", "Estado"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 14px",
                          textAlign: "left",
                          color: "rgba(255,255,255,.3)",
                          fontSize: 10,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Agrupar por usuario
                    const map = {};
                    pool.forEach(({ num, userId }) => {
                      if (!map[userId]) map[userId] = { userId, nums: [] };
                      map[userId].nums.push(num);
                    });
                    return Object.values(map).map((p, i) => {
                      const u = users?.find((u) => u.id === p.userId);
                      const isWinU = winnerUser?.id === p.userId;
                      const isMyRow = p.userId === currentUser?.id;
                      return (
                        <tr
                          key={p.userId}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,.04)",
                            background: isWinU
                              ? "rgba(255,215,0,.08)"
                              : isMyRow
                              ? "rgba(78,205,196,.04)"
                              : i % 2
                              ? "rgba(255,255,255,.01)"
                              : "transparent",
                          }}
                        >
                          <td style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              {isWinU && <span style={{ fontSize: 14 }}>⭐</span>}
                              <span style={{ fontSize: 16 }}>{u?.avatar || "👤"}</span>
                              <span
                                style={{
                                  color: isWinU
                                    ? YELLOW
                                    : isMyRow
                                    ? "#4ECDC4"
                                    : "rgba(255,255,255,.75)",
                                  fontSize: 13,
                                  fontWeight: isWinU || isMyRow ? 600 : 400,
                                }}
                              >
                                {u?.name || `Usuario ${p.userId}`}
                              </span>
                              {isMyRow && (
                                <span style={{ color: "rgba(78,205,196,.5)", fontSize: 10 }}>
                                  (vos)
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <div
                              style={{
                                display: "flex",
                                gap: 4,
                                flexWrap: "wrap",
                                maxWidth: 220,
                              }}
                            >
                              {p.nums
                                .sort()
                                .map((n) => (
                                  <span
                                    key={n}
                                    style={{
                                      padding: "2px 7px",
                                      borderRadius: 5,
                                      fontSize: 11,
                                      fontWeight: 600,
                                      background: n === winnerNum ? bColor(n) : `${bColor(n)}22`,
                                      border: `1px solid ${
                                        n === winnerNum ? bColor(n) : `${bColor(n)}55`
                                      }`,
                                      color: n === winnerNum ? "#fff" : bColor(n),
                                      boxShadow: n === winnerNum ? `0 0 12px ${bColor(n)}99` : "none",
                                      transition: "all .3s",
                                      transform: n === winnerNum ? "scale(1.15)" : "scale(1)",
                                    }}
                                  >
                                    {n}
                                  </span>
                                ))}
                            </div>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            {isWinU ? (
                              <span
                                style={{
                                  color: YELLOW,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  padding: "2px 9px",
                                  borderRadius: 9,
                                  background: "rgba(255,215,0,.1)",
                                  border: "1px solid rgba(255,215,0,.3)",
                                }}
                              >
                                🏆 GANADOR
                              </span>
                            ) : (
                              <span style={{ color: "rgba(255,255,255,.25)", fontSize: 12 }}>
                                {p.nums.length} núm.
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Info del pozo */}
            <div
              style={{
                marginTop: 14,
                background: "rgba(255,255,255,.02)",
                border: "1px solid rgba(255,255,255,.05)",
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "Números jugados",
                  value: pool.length,
                  color: "rgba(255,255,255,.6)",
                },
                {
                  label: "Precio por número",
                  value: `${rifa.pricePerNumber} cr.`,
                  color: YELLOW,
                },
                {
                  label: "Pozo total",
                  value: `${prize.toLocaleString()} cr.`,
                  color: "#00C853",
                },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    style={{
                      color: "rgba(255,255,255,.28)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 2,
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      color: s.color,
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PropTypes para validación ---
BolilleroRifas.propTypes = {
  rifa: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    pricePerNumber: PropTypes.number.isRequired,
    numbers: PropTypes.object.isRequired,
  }).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    })
  ).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onWinner: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

// --- Exportación por defecto ---
export default BolilleroRifas;