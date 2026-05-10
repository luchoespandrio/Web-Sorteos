import React from "react";
import { Header } from "../common/Header";
import { COLORS } from "../../utils/constants";

const { YELLOW, BG } = COLORS;

export function HowItWorksView({ currentUser, onBack, onLogout, onProfile, onLobby }) {
  const steps = [
    {
      icon: "💰",
      title: "1. Conseguí créditos",
      desc: "Los créditos son la moneda del sistema. Podés solicitarlos al administrador desde tu perfil. Una vez aprobada tu solicitud, se acreditarán automáticamente en tu cuenta y los verás reflejados en el balance superior.",
      color: "#4ECDC4",
    },
    {
      icon: "🎫",
      title: "2. Elegí una rifa",
      desc: "Explorá las rifas disponibles en el lobby. Cada rifa tiene un precio por número, un premio y una cantidad limitada de boletos. Hacé click en 'Elegir números' para ver el tablero de números disponibles.",
      color: YELLOW,
    },
    {
      icon: "🔢",
      title: "3. Seleccioná tus números",
      desc: "En el tablero de la rifa podés ver en tiempo real qué números están disponibles, reservados o vendidos. Elegí uno o más números disponibles y confirmá tu jugada. Los créditos se descuentan automáticamente.",
      color: "#00C853",
    },
    {
      icon: "🏆",
      title: "4. El sorteo es automático",
      desc: "¡No hay fecha de sorteo fija! El sorteo se realiza automáticamente en el momento en que se venden todos los números de una rifa. El ganador se elige al azar entre todos los participantes y se anuncia de inmediato.",
      color: "#FF8C00",
    },
    {
      icon: "📊",
      title: "5. Seguí tus jugadas",
      desc: "En la sección 'Mis Jugadas' podés ver todas las rifas en las que participás, cuántos números tenés en cada una, el monto invertido y el estado actual del sorteo.",
      color: "#FF6464",
    },
  ];

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
        onHowItWorks={() => {}}
      />

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        {/* Título */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 30,
              fontWeight: 900,
              color: "#fff",
              marginBottom: 8,
            }}
          >
            ¿Cómo funciona?
          </h1>
          <p style={{ color: "rgba(255,255,255,.38)", fontSize: 15 }}>
            Todo lo que necesitás saber para participar en RIFAS REAL
          </p>
        </div>

        {/* Pasos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {steps.map((step) => (
            <div
              key={step.title}
              style={{
                background: "#0d0d14",
                border: `1px solid ${step.color}22`,
                borderRadius: 12,
                padding: "20px 24px",
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: `${step.color}14`,
                  border: `1px solid ${step.color}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: step.color,
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Estados de los números */}
        <div
          style={{
            background: "rgba(255,215,0,.05)",
            border: "1px solid rgba(255,215,0,.18)",
            borderRadius: 12,
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Cinzel', serif",
              color: YELLOW,
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>💡</span> Estados de los números
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            {[
              {
                color: "rgba(255,255,255,.06)",
                border: "rgba(255,255,255,.1)",
                textColor: "rgba(255,255,255,.7)",
                label: "Disponible",
                desc: "Libre para comprar",
              },
              {
                color: "rgba(255,215,0,.18)",
                border: "rgba(255,215,0,.55)",
                textColor: YELLOW,
                label: "Seleccionado",
                desc: "Lo elegiste vos, pendiente de confirmar",
              },
              {
                color: "rgba(0,200,83,.14)",
                border: "rgba(0,200,83,.38)",
                textColor: "#00C853",
                label: "Tuyo",
                desc: "Ya lo compraste",
              },
              {
                color: "rgba(255,140,0,.13)",
                border: "rgba(255,140,0,.28)",
                textColor: "#FF8C00",
                label: "Reservado",
                desc: "Comprado por otro jugador",
              },
              {
                color: "rgba(255,50,50,.1)",
                border: "rgba(255,50,50,.18)",
                textColor: "rgba(255,100,100,.5)",
                label: "Vendido",
                desc: "Vendido y confirmado",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  background: "rgba(255,255,255,.02)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 5,
                    background: s.color,
                    border: `1px solid ${s.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: s.textColor,
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  00
                </div>
                <div>
                  <p style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{s.label}</p>
                  <p style={{ color: "rgba(255,255,255,.35)", fontSize: 11 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solicitar créditos */}
        <div
          style={{
            marginTop: 20,
            background: "rgba(78,205,196,.05)",
            border: "1px solid rgba(78,205,196,.18)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#4ECDC4",
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>🙋</span> Solicitar créditos
          </h3>
          <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14, lineHeight: 1.6 }}>
            Si no tenés créditos suficientes para participar, podés enviar una solicitud al administrador desde la sección{" "}
            <strong style={{ color: "#fff" }}>"Mis Jugadas"</strong>. El admin la verá en su panel y puede aprobarla o rechazarla. Si la aprueba, los créditos se suman automáticamente a tu cuenta.
          </p>
        </div>

        {/* Botón de volver */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button
            onClick={onBack}
            style={{
              background: `linear-gradient(135deg, ${COLORS.YELLOW2}, ${YELLOW})`,
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              color: "#000",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Cinzel', serif",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            ¡Quiero participar!
          </button>
        </div>
      </main>
    </div>
  );
}