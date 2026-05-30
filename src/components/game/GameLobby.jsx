import React, { useState } from "react";
import { Header } from "../common/Header";
import { RifaCard } from "./RifaCard";
import { COLORS } from "../../utils/constants";

const { BG } = COLORS;

export function GameLobby({
  currentUser,
  rifas,
  onSelectRifa,
  onLogout,
  onProfile,
  onAdmin,
  onHowItWorks,
  onCortitos,
  onPlanillas,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");

  // Filtrar rifas según búsqueda y estado
  const filtered = rifas.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "todas" ||
      (filter === "active" && r.status === "active") ||
      (filter === "finished" && r.status === "finished");
    return matchSearch && matchFilter;
  });

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
        onLobby={() => {}}
        onHowItWorks={onHowItWorks}
        onCortitos={onCortitos}
      />

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "32px 24px",
        }}
      >
        {/* Título y descripción */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 26,
              fontWeight: 900,
              color: "#fff",
              marginBottom: 4,
            }}
          >
            Rifas Disponibles
          </h1>
          <p style={{ color: "rgba(255,255,255,.35)", fontSize: 14 }}>
            Elegí tu favorita y participá con increíbles premios
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {/* Buscador */}
          <div style={{ flex: 1, position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,.3)",
                fontSize: 14,
              }}
            >
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar rifa..."
              style={{
                width: "100%",
                background: "#0d0d14",
                border: "1px solid rgba(255,255,255,.09)",
                borderRadius: 8,
                padding: "10px 12px 10px 36px",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                fontFamily: "'Barlow Condensed', sans-serif",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Filtro por estado */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: "#0d0d14",
              border: "1px solid rgba(255,255,255,.09)",
              borderRadius: 8,
              padding: "10px 16px",
              color: "rgba(255,255,255,.5)",
              fontSize: 13,
              outline: "none",
              cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            <option value="todas">Todas las rifas</option>
            <option value="active">Activas</option>
            <option value="finished">Sorteadas</option>
          </select>

          {/* Botón Cortitos */}
          <button
            onClick={onCortitos}
            style={{
              background: "rgba(255,215,0,.08)",
              border: "1px solid rgba(255,215,0,.25)",
              color: COLORS.YELLOW,
              borderRadius: 8,
              padding: "10px 18px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 0.5,
            }}
          >
            🎰 Cortitos
          </button>

          {/* Botón Sorteos / Planillas */}
          <button
            onClick={onPlanillas}
            style={{
              background: "rgba(124,77,255,.08)",
              border: "1px solid rgba(124,77,255,.3)",
              color: "#A07BFF",
              borderRadius: 8,
              padding: "10px 18px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 0.5,
            }}
          >
            ⭐ Sorteos
          </button>

          {/* Botón Admin (solo para administradores) */}
          {currentUser.isAdmin && (
            <button
              onClick={onAdmin}
              style={{
                background: "rgba(78,205,196,.08)",
                border: "1px solid rgba(78,205,196,.25)",
                color: "#4ECDC4",
                borderRadius: 8,
                padding: "10px 18px",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: 0.5,
              }}
            >
              ⚙ Admin
            </button>
          )}
        </div>

        {/* Lista de rifas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 18,
          }}
        >
          {filtered.map((rifa, i) => (
            <RifaCard
              key={rifa.id}
              rifa={rifa}
              currentUser={currentUser}
              onSelect={onSelectRifa}
            />
          ))}
        </div>
      </main>
    </div>
  );
}