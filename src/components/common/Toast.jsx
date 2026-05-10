import React from "react";
import { COLORS } from "../../utils/constants";

const { YELLOW } = COLORS;

export function Toast({ notif }) {
  if (!notif) return null;

  // Color según el tipo de notificación
  const colorMap = {
    success: "#00C853",
    error: "#FF3D00",
    warn: YELLOW,
    info: "#4ECDC4",
  };
  const color = colorMap[notif.type] || "#4ECDC4";

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        padding: "12px 20px",
        background: "#1a1a24",
        border: `1px solid ${color}`,
        borderRadius: 8,
        color: "#fff",
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,.5)",
      }}
    >
      <span style={{ color }}>{notif.type === "success" ? "✓" : notif.type === "error" ? "✗" : "!"}</span>
      {notif.msg}
    </div>
  );
}