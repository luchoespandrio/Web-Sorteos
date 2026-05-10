import React, { useState } from "react";
import { COLORS } from "../../utils/constants";

const { YELLOW, YELLOW2, BG } = COLORS;

export function AgeVerificationScreen({ onVerified, onRejected }) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Barlow Condensed', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo decorativo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(rgba(255,215,0,1) 1px,transparent 1px), linear-gradient(90deg,rgba(255,215,0,1) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(255,215,0,.04) 0%, transparent 65%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Contenido principal */}
      <div
        style={{
          width: "min(420px, 90vw)",
          background: "#0d0d14",
          border: "1px solid rgba(255,215,0,.22)",
          borderRadius: 16,
          padding: "44px 36px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔞</div>
          <div>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 26,
                fontWeight: 900,
                color: YELLOW,
                letterSpacing: 4,
              }}
            >
              RIFAS
            </span>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 26,
                fontWeight: 400,
                color: "#fff",
                letterSpacing: 4,
              }}
            >
              {" "}
              REAL
            </span>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,.3)",
              fontSize: 11,
              letterSpacing: 3,
              marginTop: 4,
              textTransform: "uppercase",
            }}
          >
            Verificación de edad
          </p>
        </div>

        {/* Aviso */}
        <div
          style={{
            background: "rgba(255,215,0,.06)",
            border: "1px solid rgba(255,215,0,.18)",
            borderRadius: 10,
            padding: "16px 18px",
            marginBottom: 24,
          }}
        >
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: 14, lineHeight: 1.7 }}>
            Este sitio contiene juegos de azar y está destinado exclusivamente a{" "}
            <strong style={{ color: YELLOW }}>mayores de 18 años</strong>.
          </p>
          <p style={{ color: "rgba(255,255,255,.35)", fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>
            Al ingresar declarás bajo tu responsabilidad que sos mayor de edad según la legislación vigente en tu país.
          </p>
        </div>

        {/* Checkbox */}
        <div
          onClick={() => setChecked((p) => !p)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 20,
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              flexShrink: 0,
              border: `2px solid ${checked ? YELLOW : "rgba(255,255,255,.2)"}`,
              background: checked ? "rgba(255,215,0,.15)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .2s",
            }}
          >
            {checked && <span style={{ color: YELLOW, fontSize: 13, fontWeight: 700 }}>✓</span>}
          </div>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 13, lineHeight: 1.5 }}>
            Confirmo que tengo <strong style={{ color: "#fff" }}>18 años o más</strong> y acepto los términos del sitio.
          </p>
        </div>

        {/* Botón entrar */}
        <button
          onClick={() => checked && onVerified()}
          style={{
            width: "100%",
            padding: "13px",
            background: checked ? `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})` : "rgba(255,255,255,.05)",
            border: checked ? "none" : "1px solid rgba(255,255,255,.08)",
            borderRadius: 8,
            color: checked ? "#000" : "rgba(255,255,255,.2)",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 2,
            cursor: checked ? "pointer" : "not-allowed",
            fontFamily: "'Cinzel', serif",
            textTransform: "uppercase",
            marginBottom: 12,
            transition: "all .25s",
          }}
        >
          {checked ? "Ingresar al sitio →" : "Confirmá tu edad para continuar"}
        </button>

        {/* Botón salir */}
        <button
          onClick={onRejected}
          style={{
            width: "100%",
            padding: "10px",
            background: "transparent",
            border: "1px solid rgba(255,100,100,.2)",
            borderRadius: 8,
            color: "rgba(255,100,100,.5)",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: 1,
          }}
        >
          No soy mayor de edad — Salir
        </button>

        <p
          style={{
            color: "rgba(255,255,255,.15)",
            fontSize: 10,
            marginTop: 16,
            lineHeight: 1.6,
          }}
        >
          El juego puede crear dependencia. Jugá responsablemente. Prohibido para menores de 18 años.
        </p>
      </div>
    </div>
  );
}