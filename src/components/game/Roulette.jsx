import React, { useState, useEffect, useRef } from "react";
import { COLORS } from "../../utils/constants";

const { YELLOW, BG } = COLORS;

export function Roulette({ numbers, onWinnerSelected, onClose }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const rouletteRef = useRef(null);

  // Iniciar el giro de la ruleta
  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    // Número de vueltas antes de detenerse
    const spins = 5;
    const fullRotation = 360 * spins;
    const extraRotation = Math.random() * 360;
    const totalRotation = fullRotation + extraRotation;

    // Duración del giro (en ms)
    const duration = 5000; // 5 segundos

    // Animación suave
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // Easing para que frene al final

      setRotation(fullRotation * easeOut + extraRotation * progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Seleccionar un ganador aleatorio
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const selectedWinner = numbers[randomIndex];
        setWinner(selectedWinner);
        setIsSpinning(false);
        setTimeout(() => {
          onWinnerSelected(selectedWinner);
        }, 1000); // Esperar 1 segundo antes de confirmar
      }
    };

    requestAnimationFrame(animate);
  };

  // Calcular la posición de cada número en la ruleta
  const getNumberStyle = (index) => {
    const angle = (index / numbers.length) * 360;
    const radius = 150;
    const transform = `rotate(${angle + rotation}deg) translate(${radius}px) rotate(${-angle - rotation}deg)`;

    return {
      position: "absolute",
      width: 60,
      height: 60,
      transform,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: 14,
      color: "#fff",
      background: `rgba(255, 215, 0, ${0.7 + Math.random() * 0.3})`,
      border: "1px solid rgba(255, 215, 0, 0.5)",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
      transition: "all 0.1s",
    };
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && !isSpinning && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Barlow Condensed', sans-serif",
      }}
    >
      <div
        style={{
          background: "#0d0d14",
          border: `2px solid ${YELLOW}`,
          borderRadius: 20,
          padding: "30px",
          boxShadow: `0 0 50px ${YELLOW}`,
          textAlign: "center",
          maxWidth: 500,
        }}
      >
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            color: YELLOW,
            fontSize: 24,
            fontWeight: 900,
            marginBottom: 10,
          }}
        >
          🎡 SORTEO EN VIVO
        </h2>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {numbers.length} números participantes
        </p>

        {/* Ruleta */}
        <div
          ref={rouletteRef}
          style={{
            position: "relative",
            width: 320,
            height: 320,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: `radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, ${BG} 70%)`,
            border: `3px solid ${YELLOW}`,
            overflow: "hidden",
          }}
        >
          {/* Centro de la ruleta */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${YELLOW} 0%, #F0B90B 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 900,
              color: "#000",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.7)",
              zIndex: 10,
            }}
          >
            {winner ? "🏆" : "🎰"}
          </div>

          {/* Números en la ruleta */}
          {numbers.map((num, index) => (
            <div key={num} style={getNumberStyle(index)}>
              {num}
            </div>
          ))}

          {/* Flecha indicadora */}
          <div
            style={{
              position: "absolute",
              top: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: `20px solid ${YELLOW}`,
              zIndex: 10,
            }}
          />
        </div>

        {/* Botón para girar */}
        {!isSpinning && !winner && (
          <button
            onClick={startSpin}
            style={{
              background: `linear-gradient(135deg, ${YELLOW}, #F0B90B)`,
              border: "none",
              borderRadius: 10,
              padding: "12px 30px",
              color: "#000",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Cinzel', serif",
              letterSpacing: 2,
              textTransform: "uppercase",
              boxShadow: `0 0 15px ${YELLOW}`,
            }}
          >
            ¡GIRAR RULETA!
          </button>
        )}

        {/* Ganador */}
        {winner && (
          <div
            style={{
              marginTop: 20,
              padding: "15px",
              background: "rgba(255, 215, 0, 0.1)",
              border: `1px solid ${YELLOW}`,
              borderRadius: 10,
            }}
          >
            <p
              style={{
                color: YELLOW,
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 5,
              }}
            >
              ¡GANADOR!
            </p>
            <p
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: 900,
                fontFamily: "'Cinzel', serif",
              }}
            >
              Número: <span style={{ color: YELLOW }}>{winner}</span>
            </p>
            <button
              onClick={() => {
                onWinnerSelected(winner);
                onClose();
              }}
              style={{
                marginTop: 10,
                background: `linear-gradient(135deg, ${YELLOW}, #F0B90B)`,
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                color: "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Cinzel', serif",
              }}
            >
              Confirmar
            </button>
          </div>
        )}

        {/* Botón para cerrar */}
        {!isSpinning && !winner && (
          <button
            onClick={onClose}
            style={{
              marginTop: 15,
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.6)",
              padding: "8px 20px",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}