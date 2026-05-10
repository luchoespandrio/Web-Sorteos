import React, { useState } from "react";
import { Header } from "../common/Header";
import { COLORS, BALL_COLORS, CORTITOS_INIT } from "../../utils/constants";

const { YELLOW, YELLOW2, BG } = COLORS;

// Función para obtener el color de una bola
const bColor = (n) => BALL_COLORS[(n - 1) % BALL_COLORS.length];

// Componente para el badge de estado de la planilla
function PlanillaStatusBadge({ cortito }) {
  const filled = cortito.players.length;
  const total = cortito.totalSlots;

  if (cortito.status === "finished") {
    return (
      <span
        style={{
          padding: "3px 12px",
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 600,
          background: "rgba(255,80,80,.1)",
          border: "1px solid rgba(255,80,80,.3)",
          color: "#FF6B6B",
          letterSpacing: 0.3,
          whiteSpace: "nowrap",
        }}
      >
        Finalizada · Ganador definido
      </span>
    );
  }
  if (cortito.status === "running") {
    return (
      <span
        style={{
          padding: "3px 12px",
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 600,
          background: "rgba(255,215,0,.1)",
          border: "1px solid rgba(255,215,0,.4)",
          color: YELLOW,
          letterSpacing: 0.3,
          whiteSpace: "nowrap",
        }}
      >
        🎰 Sorteando…
      </span>
    );
  }
  return (
    <span
      style={{
        padding: "3px 12px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 600,
        background: "rgba(78,205,196,.1)",
        border: "1px solid rgba(78,205,196,.35)",
        color: "#4ECDC4",
        letterSpacing: 0.3,
        whiteSpace: "nowrap",
      }}
    >
      {filled}/{total} completa
    </span>
  );
}

// Componente para un casillero
function Casillero({ filled }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        margin: "0 auto",
        background: filled ? "rgba(0,200,83,.18)" : "rgba(255,255,255,.04)",
        border: `1.5px solid ${filled ? "rgba(0,200,83,.55)" : "rgba(255,255,255,.1)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background .2s, border-color .2s",
      }}
    >
      {filled && <span style={{ color: "#00C853", fontSize: 11, fontWeight: 700 }}>✓</span>}
    </div>
  );
}

// Componente para la tarjeta de una planilla
function PlanillaCard({ cortito, currentUser, onJoinClick, isSelected, onSelect }) {
  const cas = {};
  (cortito.seq || []).forEach((n) => { cas[n] = (cas[n] || 0) + 1; });

  const mySlot = cortito.players.find((p) => p.userId === currentUser.id);
  const freeSlots = cortito.totalSlots - cortito.players.length;
  const prize = cortito.costPerSlot * cortito.totalSlots;
  const casCols = Array.from({ length: cortito.casillerosToWin }, (_, i) => i + 1);

  return (
    <div
      onClick={() => onSelect(cortito.id)}
      style={{
        background: isSelected ? "rgba(13,13,28,.98)" : "rgba(10,10,20,.85)",
        border: `1px solid ${
          isSelected
            ? "rgba(201,168,76,.42)"
            : cortito.status === "finished"
            ? "rgba(255,80,80,.2)"
            : "rgba(255,255,255,.07)"
        }`,
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: isSelected ? "0 0 28px rgba(201,168,76,.1)" : "none",
        transition: "border-color .22s, box-shadow .22s",
        marginBottom: 16,
      }}
    >
      {/* Cabecera */}
      <div
        style={{
          padding: "13px 18px",
          borderBottom: "1px solid rgba(255,255,255,.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 16 }}>📋</span>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {cortito.name}
          </span>
          {mySlot && (
            <span
              style={{
                padding: "1px 8px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 600,
                background: "rgba(78,205,196,.1)",
                border: "1px solid rgba(78,205,196,.3)",
                color: "#4ECDC4",
              }}
            >
              Mi slot #{mySlot.slotNumber}
            </span>
          )}
        </div>
        <PlanillaStatusBadge cortito={cortito} />
      </div>

      {/* Tabla */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "'Barlow Condensed', sans-serif",
          }}
        >
          <thead>
            <tr style={{ background: "rgba(255,255,255,.025)" }}>
              <th
                style={{
                  padding: "8px 10px 8px 18px",
                  textAlign: "center",
                  color: "rgba(255,255,255,.3)",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  width: 38,
                }}
              >
                N°
              </th>
              <th
                style={{
                  padding: "8px 10px",
                  textAlign: "left",
                  color: "rgba(255,255,255,.3)",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Nombre del jugador
              </th>
              {casCols.map((i) => (
                <th key={i} style={{ padding: "6px 4px", textAlign: "center", width: 34 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: bColor(i),
                      boxShadow: `0 2px 8px ${bColor(i)}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#fff",
                      margin: "0 auto",
                    }}
                  >
                    {i}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cortito.totalSlots }, (_, i) => {
              const sn = i + 1;
              const player = cortito.players.find((p) => p.slotNumber === sn);
              const filled = Math.min(cas[sn] || 0, cortito.casillerosToWin);
              const isWinner = cortito.winner?.slotNumber === sn;
              const isMe = player?.userId === currentUser.id;

              return (
                <tr
                  key={sn}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,.04)",
                    background: isWinner
                      ? "rgba(201,168,76,.08)"
                      : isMe
                      ? "rgba(78,205,196,.04)"
                      : i % 2
                      ? "rgba(255,255,255,.01)"
                      : "transparent",
                  }}
                >
                  <td style={{ padding: "9px 10px 9px 18px", textAlign: "center" }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        margin: "0 auto",
                        background: `${bColor(sn)}22`,
                        border: `1.5px solid ${bColor(sn)}66`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: bColor(sn),
                      }}
                    >
                      {sn}
                    </div>
                  </td>
                  <td style={{ padding: "9px 10px" }}>
                    {player ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {isWinner && <span style={{ fontSize: 13 }}>⭐</span>}
                        <span style={{ fontSize: 14 }}>{player.avatar}</span>
                        <span
                          style={{
                            color: isWinner ? YELLOW : isMe ? "#4ECDC4" : "rgba(255,255,255,.75)",
                            fontSize: 13,
                            fontWeight: isWinner || isMe ? 600 : 400,
                          }}
                        >
                          {player.userName}
                        </span>
                        {isMe && <span style={{ color: "rgba(78,205,196,.5)", fontSize: 10 }}>(vos)</span>}
                      </div>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,.2)", fontSize: 12, fontStyle: "italic" }}>
                        — Vacante —
                      </span>
                    )}
                  </td>
                  {casCols.map((ci) => (
                    <td key={ci} style={{ padding: "9px 4px", textAlign: "center" }}>
                      <Casillero filled={ci <= filled} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 18px",
          borderTop: "1px solid rgba(255,255,255,.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Entrada", value: `${cortito.costPerSlot} cr.`, color: YELLOW },
            { label: "Premio", value: `${prize.toLocaleString()} cr.`, color: "#00C853" },
            { label: "Disponibles", value: `${freeSlots} slots`, color: "rgba(255,255,255,.45)" },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{
                  color: "rgba(255,255,255,.28)",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 1,
                }}
              >
                {s.label}
              </div>
              <div style={{ color: s.color, fontWeight: 700, fontSize: 13 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Botón acción */}
        {cortito.status === "open" && !mySlot && freeSlots > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onJoinClick(cortito); }}
            style={{
              background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
              border: "none",
              borderRadius: 8,
              padding: "8px 20px",
              color: "#000",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Cinzel', serif",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Unirme
          </button>
        )}
        {cortito.status === "open" && !mySlot && freeSlots === 0 && (
          <span style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>Planilla completa</span>
        )}
        {mySlot && cortito.status === "open" && (
          <span
            style={{
              color: "#4ECDC4",
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 7,
              background: "rgba(78,205,196,.08)",
              border: "1px solid rgba(78,205,196,.25)",
            }}
          >
            ✓ Inscripto
          </span>
        )}
        {cortito.status === "finished" && cortito.winner && (
          <span style={{ color: YELLOW, fontSize: 12, fontWeight: 600 }}>
            🏆 Ganó: {cortito.winner.player?.userName || `Slot #${cortito.winner.slotNumber}`}
          </span>
        )}
      </div>
    </div>
  );
}

// Componente para el panel del bolillero
function BolilleroPanel({ cortito }) {
  const seq = cortito?.seq || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Bolillero automático */}
      <div
        style={{
          background: "rgba(10,10,22,.9)",
          border: "1px solid rgba(201,168,76,.2)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(201,168,76,.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 5,
            }}
          >
            <span style={{ color: YELLOW, fontSize: 13 }}>✦</span>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                color: YELLOW,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              Bolillero automático
            </span>
            <span style={{ color: YELLOW, fontSize: 13 }}>✦</span>
          </div>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12, lineHeight: 1.6 }}>
            El sistema se ejecuta de forma automática y transparente.<br />
            No necesitás estar conectado para que funcione.
          </p>
        </div>
        <div
          style={{
            padding: "20px 18px",
            textAlign: "center",
            background: "radial-gradient(ellipse at center, rgba(201,168,76,.04) 0%, transparent 70%)",
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "radial-gradient(circle at 38% 32%, #1c1c32, #05050f)",
                border: "2px solid rgba(201,168,76,.45)",
                boxShadow: "0 0 30px rgba(201,168,76,.18), inset 0 0 25px rgba(0,0,0,.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i / 8) * 360 - 90;
                const r = 36;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * r}px - 9px)`,
                      top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * r}px - 9px)`,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: `radial-gradient(circle at 33% 33%, rgba(255,255,255,.3), ${BALL_COLORS[i]})`,
                      boxShadow: `0 2px 6px rgba(0,0,0,.4)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 7,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {i + 1}
                  </div>
                );
              })}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "rgba(201,168,76,.08)",
                  border: "1px solid rgba(201,168,76,.15)",
                }}
              />
            </div>
            <div
              style={{
                width: 70,
                height: 7,
                background: "rgba(201,168,76,.2)",
                borderRadius: 4,
                margin: "5px auto 0",
                border: "1px solid rgba(201,168,76,.2)",
              }}
            />
            <p
              style={{
                color: "rgba(255,255,255,.18)",
                fontSize: 9,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginTop: 5,
              }}
            >
              Sistema automático
            </p>
          </div>
        </div>
      </div>

      {/* Secuencia hasta ganar */}
      <div
        style={{
          background: "rgba(10,10,22,.9)",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 14,
          padding: "16px 18px",
        }}
      >
        <h3
          style={{
            fontFamily: "'Cinzel', serif",
            color: "rgba(255,255,255,.7)",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 12,
            letterSpacing: 1,
          }}
        >
          Secuencia hasta ganar
        </h3>
        {seq.length === 0 ? (
          <p
            style={{
              color: "rgba(255,255,255,.2)",
              fontSize: 12,
              textAlign: "center",
              padding: "14px 0",
            }}
          >
            El sorteo arranca cuando la planilla se completa
          </p>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {seq.map((n, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `radial-gradient(circle at 33% 33%, rgba(255,255,255,.25), ${bColor(n)})`,
                      boxShadow: `0 2px 8px ${bColor(n)}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {n}
                  </div>
                  {i < seq.length - 1 && (
                    <span style={{ color: "rgba(255,255,255,.2)", fontSize: 10 }}>→</span>
                  )}
                </div>
              ))}
            </div>
            {cortito?.winner && (
              <p
                style={{
                  color: YELLOW,
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "rgba(255,215,0,.07)",
                  border: "1px solid rgba(255,215,0,.2)",
                }}
              >
                El jugador N°{cortito.winner.slotNumber} completó sus {cortito?.casillerosToWin} casilleros 🏆
              </p>
            )}
          </>
        )}
      </div>

      {/* Verificación del ganador */}
      {cortito?.winner && (
        <div
          style={{
            background: "rgba(10,10,22,.9)",
            border: "1px solid rgba(201,168,76,.25)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "11px 18px",
              borderBottom: "1px solid rgba(201,168,76,.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cinzel', serif",
                color: "rgba(255,255,255,.8)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              Verificación del ganador
            </h3>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 10,
                fontSize: 10,
                fontWeight: 700,
                background: "rgba(0,200,83,.12)",
                border: "1px solid rgba(0,200,83,.35)",
                color: "#00C853",
                letterSpacing: 1,
              }}
            >
              ✓ VERIFICADO
            </span>
          </div>
          <div
            style={{
              padding: "14px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 9,
            }}
          >
            {[
              { label: "Planilla", value: cortito.name },
              { label: "Ganador", value: cortito.winner.player?.userName || `Slot #${cortito.winner.slotNumber}`, gold: true },
              { label: "Número asignado", value: cortito.winner.slotNumber, isBall: true },
              { label: "Casilleros completados", value: `${cortito.casillerosToWin}/${cortito.casillerosToWin}` },
              { label: "Total extracciones", value: seq.length },
              { label: "Secuencia verificada", value: seq.join(" - "), small: true },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,.35)",
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  {r.label}
                </span>
                {r.isBall ? (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: bColor(r.value),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#fff",
                      boxShadow: `0 2px 8px ${bColor(r.value)}66`,
                    }}
                  >
                    {r.value}
                  </div>
                ) : (
                  <span
                    style={{
                      color: r.gold ? YELLOW : "rgba(255,255,255,.65)",
                      fontSize: r.small ? 10 : 12,
                      fontWeight: r.gold ? 700 : 400,
                      textAlign: "right",
                      wordBreak: "break-all",
                      maxWidth: "55%",
                    }}
                  >
                    {r.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leyenda de estados */}
      <div
        style={{
          background: "rgba(10,10,22,.7)",
          border: "1px solid rgba(255,255,255,.05)",
          borderRadius: 12,
          padding: "13px 16px",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,.28)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 10,
          }}
        >
          Estados de las planillas
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { color: "#4ECDC4", label: "Abierta", sub: "Podés completar" },
            { color: "#4D96FF", label: "Completándose", sub: "En progreso" },
            { color: YELLOW, label: "Sorteando", sub: "Bolillero en marcha" },
            { color: "#FF6B6B", label: "Finalizada", sub: "Ganador definido" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: s.color,
                  flexShrink: 0,
                  boxShadow: `0 0 5px ${s.color}88`,
                }}
              />
              <div>
                <div style={{ color: s.color, fontSize: 11, fontWeight: 600 }}>{s.label}</div>
                <div style={{ color: "rgba(255,255,255,.25)", fontSize: 10 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Modal para elegir slot
function SlotModal({ cortito, currentUser, onConfirm, onClose }) {
  const [hovered, setHovered] = useState(null);
  const prize = cortito.costPerSlot * cortito.totalSlots;
  const canAfford = currentUser.credits >= cortito.costPerSlot;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Barlow Condensed', sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "min(460px, 100%)",
          background: "#0a0a18",
          border: "1px solid rgba(201,168,76,.25)",
          borderRadius: 16,
          padding: "28px",
          boxShadow: "0 20px 60px rgba(0,0,0,.7)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            color: "#fff",
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 5,
          }}
        >
          Unirme a {cortito.name}
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,.35)",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          Elegí tu slot · Entrada:{" "}
          <strong style={{ color: YELLOW }}>{cortito.costPerSlot} cr.</strong>{" "}
          · Premio total:{" "}
          <strong style={{ color: "#00C853" }}>{prize.toLocaleString()} cr.</strong>
        </p>

        {/* Grilla de slots */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {Array.from({ length: cortito.totalSlots }, (_, i) => {
            const sn = i + 1;
            const player = cortito.players.find((p) => p.slotNumber === sn);
            const isFree = !player;

            return (
              <button
                key={sn}
                disabled={!isFree || !canAfford}
                onClick={() => isFree && canAfford && onConfirm(sn)}
                onMouseEnter={() => setHovered(sn)}
                onMouseLeave={() => setHovered(null)}
                title={!isFree ? `Ocupado por ${player.userName}` : `Slot ${sn} — libre`}
                style={{
                  aspectRatio: "1",
                  borderRadius: "50%",
                  background: !isFree
                    ? "rgba(255,255,255,.04)"
                    : hovered === sn
                    ? `${bColor(sn)}33`
                    : `${bColor(sn)}18`,
                  border: `2px solid ${!isFree
                    ? "rgba(255,255,255,.07)"
                    : hovered === sn
                    ? bColor(sn)
                    : `${bColor(sn)}55`}`,
                  color: !isFree ? "rgba(255,255,255,.2)" : bColor(sn),
                  cursor: isFree && canAfford ? "pointer" : "not-allowed",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  padding: "6px 4px",
                  transition: "all .15s",
                  transform: hovered === sn && isFree ? "scale(1.1)" : "scale(1)",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{sn}</span>
                {!isFree && <span style={{ fontSize: 11 }}>{player.avatar}</span>}
              </button>
            );
          })}
        </div>

        {!canAfford && (
          <p
            style={{
              color: "#FF6464",
              fontSize: 12,
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            ⚠ Necesitás al menos {cortito.costPerSlot} cr. Tu saldo: {currentUser.credits} cr.
          </p>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px",
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 8,
            color: "rgba(255,255,255,.45)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'Barlow Condensed', sans-serif",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Componente principal de CortitosView
export function CortitosView({
  currentUser,
  db,
  updateDB,
  onBack,
  onLogout,
  onProfile,
  onLobby,
  onHowItWorks,
}) {
  const cortitos = db.cortitos || CORTITOS_INIT;
  const [selectedId, setSelectedId] = useState(cortitos[0]?.id || null);
  const [joinTarget, setJoinTarget] = useState(null);

  const activeCortito = cortitos.find((c) => c.id === selectedId) || cortitos[0];

  const handleConfirmJoin = (slotNumber) => {
    if (!joinTarget) return;
    updateDB((prev) => {
      const cortito = prev.cortitos.find((c) => c.id === joinTarget.id);
      if (!cortito) return prev;

      // Verificar si el usuario ya tiene un slot en esta planilla
      const existingSlot = cortito.players.find((p) => p.userId === currentUser.id);
      if (existingSlot) return prev;

      // Verificar si el slot está disponible
      const slotTaken = cortito.players.some((p) => p.slotNumber === slotNumber);
      if (slotTaken) return prev;

      // Verificar si tiene créditos suficientes
      if (currentUser.credits < cortito.costPerSlot) return prev;

      // Crear el nuevo jugador en la planilla
      const newPlayer = {
        userId: currentUser.id,
        userName: currentUser.name,
        avatar: currentUser.avatar,
        slotNumber,
      };

      // Actualizar créditos del usuario
      const newUsers = prev.users.map((u) =>
        u.id === currentUser.id
          ? { ...u, credits: u.credits - cortito.costPerSlot }
          : u
      );

      // Actualizar la planilla
      const newCortitos = prev.cortitos.map((c) => {
        if (c.id !== cortito.id) return c;
        return {
          ...c,
          players: [...c.players, newPlayer],
        };
      });

      return { ...prev, users: newUsers, cortitos: newCortitos };
    });

    setJoinTarget(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        fontFamily: "'Barlow Condensed', sans-serif",
      }}
    >
      <Header
        currentUser={currentUser}
        onLogout={onLogout}
        onProfile={onProfile}
        onLobby={onLobby}
        onHowItWorks={onHowItWorks}
        onCortitos={() => {}}
      />

      {joinTarget && (
        <SlotModal
          cortito={joinTarget}
          currentUser={currentUser}
          onConfirm={handleConfirmJoin}
          onClose={() => setJoinTarget(null)}
        />
      )}

      <main
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "28px 22px",
        }}
      >
        {/* Título */}
        <div style={{ marginBottom: 20 }}>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 24 }}>⚡</span> Cortitos
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,.35)",
              fontSize: 13,
              maxWidth: 540,
              lineHeight: 1.65,
            }}
          >
            Completá una de las {cortitos.length} planillas. Cuando una planilla llega a{" "}
            {cortitos[0]?.totalSlots}/{cortitos[0]?.totalSlots}, el bolillero automático comienza
            a sacar números del {cortitos[0]?.bolMin} al {cortitos[0]?.bolMax}.
            Cada vez que sale tu número, se completa un casillero. Ganás el primero en completar los{" "}
            {cortitos[0]?.casillerosToWin}.
          </p>
        </div>

        {/* Layout 2 columnas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 22,
            alignItems: "start",
          }}
        >
          {/* Izquierda: Planillas */}
          <div>
            {cortitos.map((c) => (
              <PlanillaCard
                key={c.id}
                cortito={c}
                currentUser={currentUser}
                onJoinClick={() => setJoinTarget(c)}
                isSelected={selectedId === c.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>

          {/* Derecha: Panel bolillero (sticky) */}
          <div style={{ position: "sticky", top: 78 }}>
            <BolilleroPanel cortito={activeCortito} />
          </div>
        </div>

        {/* Pie */}
        <p
          style={{
            color: "rgba(255,255,255,.18)",
            fontSize: 12,
            textAlign: "center",
            marginTop: 24,
            lineHeight: 1.7,
            padding: "11px 16px",
            borderRadius: 8,
            background: "rgba(255,255,255,.02)",
            border: "1px solid rgba(255,255,255,.04)",
          }}
        >
          ℹ Cuando una planilla alcanza {cortitos[0]?.totalSlots}/{cortitos[0]?.totalSlots}, el
          bolillero se ejecuta automáticamente hasta que un jugador completa sus{" "}
          {cortitos[0]?.casillerosToWin} casilleros y se define al ganador.
        </p>
      </main>
    </div>
  );
}