import React, { useState } from "react";
import { Header } from "../common/Header";
import { COLORS } from "../../utils/constants";

const { YELLOW, BG } = COLORS;

export function ProfileView({
  currentUser,
  rifas,
  creditRequests,
  onBack,
  onLogout,
  onHowItWorks,
  onRequestCredit,
}) {
  const [tab, setTab] = useState("todas");

  // Obtener las jugadas del usuario
  const jugadas = rifas.flatMap((rifa) => {
    const myNums = Object.entries(rifa.numbers)
      .filter(([, v]) => v.userId === currentUser.id)
      .map(([n]) => n);
    if (!myNums.length) return [];
    return [
      {
        rifaId: rifa.id,
        rifaName: rifa.name,
        rifaIcon: rifa.icon,
        numbers: myNums,
        amount: myNums.length * rifa.pricePerNumber,
        status: rifa.status,
        winner: rifa.winner,
      },
    ];
  });

  // Filtrar jugadas según el tab
  const filtered = tab === "todas" ? jugadas : jugadas.filter((j) => j.status === tab);

  // Mis solicitudes de crédito
  const myRequests = creditRequests.filter((r) => r.userId === currentUser.id);

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
        onProfile={() => {}}
        onLobby={onBack}
        onHowItWorks={onHowItWorks}
      />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
        {/* Tarjeta de perfil */}
        <div
          style={{
            background: "#0d0d14",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 12,
            padding: "18px 22px",
            marginBottom: 22,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(255,215,0,.08)",
              border: "2px solid rgba(255,215,0,.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            {currentUser.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#fff",
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              {currentUser.name}
            </h2>
            <p style={{ color: "rgba(255,255,255,.38)", fontSize: 13 }}>
              jugador#{currentUser.id}
            </p>
          </div>
          <div style={{ textAlign: "right", marginRight: 16 }}>
            <p
              style={{
                color: "rgba(255,255,255,.38)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Créditos
            </p>
            <p style={{ color: YELLOW, fontWeight: 700, fontSize: 20 }}>
              {currentUser.credits.toLocaleString()} cr.
            </p>
          </div>
          <button
            onClick={onRequestCredit}
            style={{
              background: "rgba(78,205,196,.08)",
              border: "1px solid rgba(78,205,196,.25)",
              color: "#4ECDC4",
              borderRadius: 8,
              padding: "9px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            + Pedir créditos
          </button>
        </div>

        {/* Mis solicitudes de crédito */}
        {myRequests.length > 0 && (
          <div
            style={{
              background: "#0d0d14",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 18,
            }}
          >
            <h3
              style={{
                color: "rgba(255,255,255,.45)",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Mis solicitudes de crédito
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,.02)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,.05)",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,.55)", fontSize: 13 }}>{req.date}</span>
                  <span style={{ color: YELLOW, fontWeight: 700, fontSize: 14 }}>
                    {req.amount} cr.
                  </span>
                  <span
                    style={{
                      padding: "2px 10px",
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                        req.status === "pending"
                          ? "rgba(255,140,0,.1)"
                          : req.status === "approved"
                          ? "rgba(0,200,83,.1)"
                          : "rgba(255,50,50,.08)",
                      border: `1px solid ${
                        req.status === "pending"
                          ? "rgba(255,140,0,.3)"
                          : req.status === "approved"
                          ? "rgba(0,200,83,.28)"
                          : "rgba(255,50,50,.22)"
                      }`,
                      color:
                        req.status === "pending"
                          ? "#FF8C00"
                          : req.status === "approved"
                          ? "#00C853"
                          : "#FF6464",
                    }}
                  >
                    {req.status === "pending"
                      ? "⏳ Pendiente"
                      : req.status === "approved"
                      ? "✓ Aprobada"
                      : "✗ Rechazada"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Título de Mis Jugadas */}
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            color: "#fff",
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Mis Jugadas
        </h2>
        <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginBottom: 18 }}>
          Acá podés ver todas las rifas en las que estás participando.
        </p>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {[
            ["todas", "Todas"],
            ["active", "Activas"],
            ["finished", "Finalizadas"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              style={{
                padding: "6px 16px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                fontFamily: "'Barlow Condensed', sans-serif",
                background: tab === val ? "rgba(255,215,0,.1)" : "transparent",
                border: `1px solid ${tab === val ? YELLOW : "rgba(255,255,255,.1)"}`,
                color: tab === val ? YELLOW : "rgba(255,255,255,.38)",
                transition: "all .2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tabla de jugadas */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "rgba(255,255,255,.2)",
              fontSize: 14,
            }}
          >
            No tenés jugadas todavía.
          </div>
        ) : (
          <div
            style={{
              background: "#0d0d14",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                  {["Rifa", "Números", "Monto", "Estado", "Resultado"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 16px",
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
                {filtered.map((j, i) => (
                  <tr
                    key={j.rifaId}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,.04)",
                      background: i % 2 ? "rgba(255,255,255,.01)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{j.rifaIcon}</span>
                        <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                          {j.rifaName}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", maxWidth: 180 }}>
                        {[...j.numbers].sort().map((n) => (
                          <span
                            key={n}
                            style={{
                              background: "rgba(255,215,0,.08)",
                              border: "1px solid rgba(255,215,0,.2)",
                              borderRadius: 4,
                              padding: "1px 6px",
                              color: YELLOW,
                              fontSize: 11,
                            }}
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px", color: "#fff", fontWeight: 600, fontSize: 13 }}>
                      {j.amount} cr.
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <span
                        style={{
                          padding: "2px 9px",
                          borderRadius: 10,
                          fontSize: 11,
                          background: j.status === "active" ? "rgba(0,200,83,.1)" : "rgba(255,215,0,.08)",
                          border: `1px solid ${
                            j.status === "active" ? "rgba(0,200,83,.28)" : "rgba(255,215,0,.2)"
                          }`,
                          color: j.status === "active" ? "#00C853" : YELLOW,
                        }}
                      >
                        {j.status === "active" ? "Activa" : "🏆 Sorteada"}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      {j.winner ? (
                        j.winner.userId === currentUser.id ? (
                          <span style={{ color: YELLOW, fontWeight: 700, fontSize: 13 }}>
                            🎉 ¡Ganaste! Nro {j.winner.number}
                          </span>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,.35)", fontSize: 12 }}>
                            Ganó {j.winner.name}
                          </span>
                        )
                      ) : (
                        <span style={{ color: "rgba(255,255,255,.2)", fontSize: 12 }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}