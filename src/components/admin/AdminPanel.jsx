import React, { useState } from "react";
import { COLORS } from "../../utils/constants";
import { Roulette } from "../game/Roulette";

// Constantes de colores
const YELLOW = "#FFD700";
const YELLOW2 = "#F0B90B";
const BG = "#0a0a0f";

// Datos iniciales de cortitos
const CORTITOS_INIT = [
  {
    id: 1,
    name: "Planilla 1",
    description: "Completá 5 casilleros para ganar el pozo",
    costPerSlot: 100,
    totalSlots: 10,
    casillerosToWin: 5,
    bolMin: 1,
    bolMax: 10,
    players: [],
    status: "open",
    seq: [],
    winner: null,
  },
];

export function AdminPanel({ db, setDb, onLogout, onLobby, toast }) {
  // Estados globales
  const { users, rifas, creditRequests, cortitos = CORTITOS_INIT } = db;

  // Estados locales
  const [tab, setTab] = useState("rifas");

  // Rifas
  const [newRifa, setNewRifa] = useState({
    name: "", subtitle: "", icon: "🎁",
    pricePerNumber: 50, prize: "", totalNumbers: 100
  });
  const [editRifa, setEditRifa] = useState(null);

  // Usuarios
  const [newUser, setNewUser] = useState({
    username: "", password: "", name: "", avatar: "👤", credits: 0, isAdmin: false
  });
  const [editUser, setEditUser] = useState(null);
  const [editCredits, setEditCredits] = useState({ id: null, val: "" });

  // Cortitos
  const [newCortito, setNewCortito] = useState({
    name: "", description: "", costPerSlot: 100,
    totalSlots: 10, casillerosToWin: 5, bolMin: 1, bolMax: 10
  });
  const [editCortito, setEditCortito] = useState(null);

  // Ruleta
  const [showRoulette, setShowRoulette] = useState(false);
  const [rouletteNumbers, setRouletteNumbers] = useState([]);
  const [rifaToDraw, setRifaToDraw] = useState(null);

  // Confirmaciones
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(null);

  // Funciones de rifas
  const createRifa = () => {
    if (!newRifa.name || !newRifa.prize) {
      toast("Completá el nombre y el premio", "warn");
      return;
    }
    const id = rifas.length > 0 ? Math.max(...rifas.map(r => r.id)) + 1 : 1;
    setDb(prev => ({
      ...prev,
      rifas: [...prev.rifas, {
        id,
        ...newRifa,
        totalNumbers: parseInt(newRifa.totalNumbers) || 100,
        status: "active",
        numbers: {},
        winner: null
      }]
    }));
    setNewRifa({ name: "", subtitle: "", icon: "🎁", pricePerNumber: 50, prize: "", totalNumbers: 100 });
    toast("Rifa creada", "success");
  };

  const saveEditRifa = () => {
    if (!editRifa) return;
    setDb(prev => ({
      ...prev,
      rifas: prev.rifas.map(r =>
        r.id === editRifa.id ? { ...r, ...editRifa, totalNumbers: parseInt(editRifa.totalNumbers) || 100 } : r
      )
    }));
    setEditRifa(null);
    toast("Rifa actualizada", "success");
  };

  const deleteRifa = (id) => {
    setDb(prev => ({ ...prev, rifas: prev.rifas.filter(r => r.id !== id) }));
    setDeleteConfirm(null);
    toast("Rifa eliminada", "warn");
  };

  const resetRifa = (id) => {
    setDb(prev => ({
      ...prev,
      rifas: prev.rifas.map(r =>
        r.id === id ? {
          ...r,
          status: "active",
          numbers: {},
          winner: null,
          winnerId: null,
          winnerNumber: null
        } : r
      )
    }));
    setResetConfirm(null);
    toast("Rifa reiniciada", "success");
  };

  // Funciones de cortitos
  const createCortito = () => {
    if (!newCortito.name || !newCortito.costPerSlot || !newCortito.totalSlots) {
      toast("Completá los campos obligatorios", "warn");
      return;
    }
    const id = cortitos.length ? Math.max(...cortitos.map(c => c.id)) + 1 : 1;
    setDb(prev => ({
      ...prev,
      cortitos: [...prev.cortitos, {
        id,
        ...newCortito,
        totalSlots: parseInt(newCortito.totalSlots) || 10,
        costPerSlot: parseInt(newCortito.costPerSlot) || 100,
        status: "open",
        players: [],
        seq: [],
        winner: null
      }]
    }));
    setNewCortito({ name: "", description: "", costPerSlot: 100, totalSlots: 10, casillerosToWin: 5, bolMin: 1, bolMax: 10 });
    toast("Cortito creado", "success");
  };

  const saveEditCortito = () => {
    if (!editCortito) return;
    setDb(prev => ({
      ...prev,
      cortitos: prev.cortitos.map(c =>
        c.id === editCortito.id ? {
          ...c,
          ...editCortito,
          totalSlots: parseInt(editCortito.totalSlots) || 10,
          costPerSlot: parseInt(editCortito.costPerSlot) || 100
        } : c
      )
    }));
    setEditCortito(null);
    toast("Cortito actualizado", "success");
  };

  const deleteCortito = (id) => {
    setDb(prev => ({ ...prev, cortitos: prev.cortitos.filter(c => c.id !== id) }));
    setDeleteConfirm(null);
    toast("Cortito eliminado", "warn");
  };

  const resetCortito = (id) => {
    setDb(prev => ({
      ...prev,
      cortitos: prev.cortitos.map(c =>
        c.id === id ? {
          ...c,
          status: "open",
          players: [],
          seq: [],
          winner: null
        } : c
      )
    }));
    setResetConfirm(null);
    toast("Cortito reiniciado", "success");
  };

  // Funciones de usuarios
  const createUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      toast("Completá todos los campos", "warn");
      return;
    }
    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setDb(prev => ({
      ...prev,
      users: [...prev.users, { ...newUser, id, credits: Number(newUser.credits) || 0 }]
    }));
    setNewUser({ username: "", password: "", name: "", avatar: "👤", credits: 0, isAdmin: false });
    toast("Usuario creado", "success");
  };

  const saveEditUser = () => {
    if (!editUser) return;
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === editUser.id ? { ...u, ...editUser } : u)
    }));
    setEditUser(null);
    toast("Usuario actualizado", "success");
  };

  const deleteUser = (id) => {
    setDb(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
    setDeleteConfirm(null);
    toast("Usuario eliminado", "warn");
  };

  // Funciones de créditos
  const approveCredit = (id) => {
    const req = creditRequests.find(r => r.id === id);
    if (!req) return;
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === req.userId ? { ...u, credits: u.credits + req.amount } : u),
      creditRequests: prev.creditRequests.map(r => r.id === id ? { ...r, status: "approved" } : r)
    }));
    toast(`Solicitud de ${req.userName} aprobada: +${req.amount} cr.`, "success");
  };

  const rejectCredit = (id) => {
    setDb(prev => ({
      ...prev,
      creditRequests: prev.creditRequests.map(r => r.id === id ? { ...r, status: "rejected" } : r)
    }));
    toast("Solicitud rechazada", "warn");
  };

  // Funciones de sorteo
  const startDraw = (rifa) => {
    const soldNumbers = Object.entries(rifa.numbers)
      .filter(([_, n]) => n.status === "reservado")
      .map(([num]) => num);

    if (soldNumbers.length === 0) {
      toast("No hay números vendidos para sortear", "warn");
      return;
    }

    setRifaToDraw(rifa);
    setRouletteNumbers(soldNumbers);
    setShowRoulette(true);
  };

  const handleWinnerSelected = (winnerNumber) => {
    setDb(prev => ({
      ...prev,
      rifas: prev.rifas.map(r =>
        r.id === rifaToDraw.id ? {
          ...r,
          status: "finished",
          winnerNumber,
          winner: { number: winnerNumber, name: "Ganador" }
        } : r
      )
    }));
    toast(`¡Ganador: Número ${winnerNumber}!`, "success");
    setShowRoulette(false);
  };

  // Estilos reutilizables
  const inputStyle = {
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.09)",
    borderRadius: 7,
    padding: "9px 12px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
    fontFamily: "'Barlow Condensed', sans-serif",
    width: "100%",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    padding: "5px 11px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600
  };

  // Datos derivados
  const pendingRequests = creditRequests.filter(r => r.status === "pending");
  const totalCredits = users.reduce((sum, user) => sum + user.credits, 0);
  const totalParticipations = rifas.reduce((sum, rifa) => sum + Object.keys(rifa.numbers).length, 0);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Barlow Condensed', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: "#0d0d14",
        borderBottom: "1px solid rgba(78,205,196,.18)",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>⚙️</span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 700, color: "#4ECDC4", letterSpacing: 3 }}>
            PANEL ADMIN
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onLobby} style={{
            ...buttonStyle,
            background: "rgba(255,215,0,.07)",
            border: "1px solid rgba(255,215,0,.22)",
            color: YELLOW
          }}>← Rifas</button>
          <button onClick={onLogout} style={{
            ...buttonStyle,
            background: "transparent",
            border: "1px solid rgba(255,100,100,.28)",
            color: "#FF6464"
          }}>Salir</button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 22 }}>
          {[
            { label: "Jugadores", val: users.filter(u => !u.isAdmin).length, icon: "👥", c: "#4ECDC4" },
            { label: "Rifas activas", val: rifas.filter(r => r.status === "active").length, icon: "🎫", c: YELLOW },
            { label: "Cortitos activos", val: cortitos.filter(c => c.status === "open").length, icon: "⚡", c: "#FF8C00" },
            { label: "Créditos emitidos", val: totalCredits.toLocaleString(), icon: "💰", c: "#00C853" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "#0d0d14",
              border: `1px solid ${stat.c}22`,
              borderRadius: 10,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <span style={{ fontSize: 24 }}>{stat.icon}</span>
              <div>
                <p style={{ color: "rgba(255,255,255,.32)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 1 }}>
                  {stat.label}
                </p>
                <p style={{ color: stat.c, fontSize: 21, fontWeight: 700 }}>{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[
            ["dashboard", "Dashboard"],
            ["users", "👥 Usuarios"],
            ["rifas", "🎫 Rifas"],
            ["cortitos", "⚡ Cortitos"]
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              style={{
                padding: "7px 18px",
                borderRadius: 7,
                fontSize: 12,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                background: tab === val ? "rgba(78,205,196,.09)" : "transparent",
                border: `1px solid ${tab === val ? "#4ECDC4" : "rgba(255,255,255,.09)"}`,
                color: tab === val ? "#4ECDC4" : "rgba(255,255,255,.38)"
              }}
            >
              {label}
              {val === "dashboard" && pendingRequests.length > 0 && ` (${pendingRequests.length})`}
            </button>
          ))}
        </div>

        {/* Contenido por tab */}
        {tab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Solicitudes de crédito */}
            <div style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ color: "#fff", fontSize: 14, fontFamily: "'Cinzel', serif" }}>Solicitudes de crédito</h3>
                {pendingRequests.length > 0 && (
                  <span style={{ background: "rgba(255,140,0,.12)", border: "1px solid rgba(255,140,0,.28)", borderRadius: 10, padding: "2px 8px", color: "#FF8C00", fontSize: 11 }}>
                    {pendingRequests.length} pendientes
                  </span>
                )}
              </div>
              <p style={{ color: "rgba(255,255,255,.3)", fontSize: 11, marginBottom: 12, lineHeight: 1.5 }}>
                Los jugadores pueden pedir créditos desde su perfil.
              </p>
              {creditRequests.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,.18)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Sin solicitudes</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {creditRequests.map(req => (
                    <div key={req.id} style={{
                      background: "rgba(255,255,255,.02)",
                      border: "1px solid rgba(255,255,255,.06)",
                      borderRadius: 8,
                      padding: "9px 12px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{req.userName}</p>
                          <p style={{ color: "rgba(255,255,255,.35)", fontSize: 11 }}>{req.date}</p>
                        </div>
                        <span style={{ color: YELLOW, fontWeight: 700, fontSize: 14 }}>{req.amount} cr.</span>
                        {req.status === "pending" ? (
                          <div style={{ display: "flex", gap: 5 }}>
                            <button onClick={() => approveCredit(req.id)} style={{
                              background: "rgba(0,200,83,.1)",
                              border: "1px solid rgba(0,200,83,.28)",
                              color: "#00C853",
                              padding: "4px 9px",
                              borderRadius: 5,
                              cursor: "pointer",
                              fontSize: 12
                            }}>✓</button>
                            <button onClick={() => rejectCredit(req.id)} style={{
                              background: "rgba(255,50,50,.08)",
                              border: "1px solid rgba(255,50,50,.22)",
                              color: "#FF6464",
                              padding: "4px 9px",
                              borderRadius: 5,
                              cursor: "pointer",
                              fontSize: 12
                            }}>✗</button>
                          </div>
                        ) : (
                          <span style={{
                            fontSize: 12,
                            color: req.status === "approved" ? "#00C853" : "#FF6464",
                            fontWeight: 600
                          }}>
                            {req.status === "approved" ? "Aprobada" : "Rechazada"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Crear rifa y cortito */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "18px" }}>
                <h3 style={{ color: "#fff", fontSize: 14, fontFamily: "'Cinzel', serif", marginBottom: 14 }}>Crear rifa</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input value={newRifa.name} onChange={e => setNewRifa(p => ({ ...p, name: e.target.value }))} placeholder="Nombre" style={inputStyle} />
                  <input value={newRifa.subtitle} onChange={e => setNewRifa(p => ({ ...p, subtitle: e.target.value }))} placeholder="Descripción" style={inputStyle} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <input value={newRifa.prize} onChange={e => setNewRifa(p => ({ ...p, prize: e.target.value }))} placeholder="Premio" style={inputStyle} />
                    <input type="number" value={newRifa.pricePerNumber} onChange={e => setNewRifa(p => ({ ...p, pricePerNumber: +e.target.value }))} placeholder="Precio/número" style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <input value={newRifa.icon} onChange={e => setNewRifa(p => ({ ...p, icon: e.target.value }))} placeholder="Ícono" style={inputStyle} />
                    <input type="number" value={newRifa.totalNumbers} onChange={e => setNewRifa(p => ({ ...p, totalNumbers: +e.target.value }))} placeholder="Números" style={inputStyle} />
                  </div>
                  <button
                    onClick={createRifa}
                    disabled={!newRifa.name || !newRifa.prize}
                    style={{
                      ...buttonStyle,
                      background: newRifa.name && newRifa.prize ? `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})` : "rgba(255,255,255,.04)",
                      border: "none",
                      color: newRifa.name && newRifa.prize ? "#000" : "rgba(255,255,255,.28)",
                      fontWeight: 700,
                      padding: "10px",
                      borderRadius: 8
                    }}
                  >
                    Crear rifa
                  </button>
                </div>
              </div>

              <div style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "18px" }}>
                <h3 style={{ color: "#fff", fontSize: 14, fontFamily: "'Cinzel', serif", marginBottom: 14 }}>Crear cortito</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input value={newCortito.name} onChange={e => setNewCortito(p => ({ ...p, name: e.target.value }))} placeholder="Nombre" style={inputStyle} />
                  <input value={newCortito.description} onChange={e => setNewCortito(p => ({ ...p, description: e.target.value }))} placeholder="Descripción" style={inputStyle} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <input type="number" value={newCortito.costPerSlot} onChange={e => setNewCortito(p => ({ ...p, costPerSlot: +e.target.value }))} placeholder="Costo/slot" style={inputStyle} />
                    <input type="number" value={newCortito.totalSlots} onChange={e => setNewCortito(p => ({ ...p, totalSlots: +e.target.value }))} placeholder="Slots" style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <input type="number" value={newCortito.casillerosToWin} onChange={e => setNewCortito(p => ({ ...p, casillerosToWin: +e.target.value }))} placeholder="Casilleros" style={inputStyle} />
                    <input type="number" value={newCortito.bolMin} onChange={e => setNewCortito(p => ({ ...p, bolMin: +e.target.value }))} placeholder="Bola mín" style={inputStyle} />
                    <input type="number" value={newCortito.bolMax} onChange={e => setNewCortito(p => ({ ...p, bolMax: +e.target.value }))} placeholder="Bola máx" style={inputStyle} />
                  </div>
                  <button
                    onClick={createCortito}
                    disabled={!newCortito.name || !newCortito.costPerSlot || !newCortito.totalSlots}
                    style={{
                      ...buttonStyle,
                      background: newCortito.name && newCortito.costPerSlot && newCortito.totalSlots ? `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})` : "rgba(255,255,255,.04)",
                      border: "none",
                      color: newCortito.name && newCortito.costPerSlot && newCortito.totalSlots ? "#000" : "rgba(255,255,255,.28)",
                      fontWeight: 700,
                      padding: "10px",
                      borderRadius: 8
                    }}
                  >
                    Crear cortito
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#fff", fontSize: 14, fontFamily: "'Cinzel', serif" }}>Usuarios</h3>
              <button
                onClick={createUser}
                disabled={!newUser.username || !newUser.password || !newUser.name}
                style={{
                  ...buttonStyle,
                  background: newUser.username && newUser.password && newUser.name ? `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})` : "rgba(255,255,255,.04)",
                  border: "none",
                  color: newUser.username && newUser.password && newUser.name ? "#000" : "rgba(255,255,255,.28)",
                  fontWeight: 700,
                  padding: "8px 16px"
                }}
              >
                + Crear usuario
              </button>
            </div>
            <div style={{ padding: "0 18px 18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                <input value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} placeholder="Nombre" style={inputStyle} />
                <input value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))} placeholder="Usuario" style={inputStyle} />
                <input type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} placeholder="Contraseña" style={inputStyle} />
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                  {["", "Nombre", "Usuario", "Rol", "Créditos", "Acciones"].map(h => (
                    <th key={h} style={{
                      padding: "11px 16px",
                      textAlign: "left",
                      color: "rgba(255,255,255,.3)",
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      fontWeight: 600
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} style={{
                    borderBottom: "1px solid rgba(255,255,255,.04)",
                    background: i % 2 ? "rgba(255,255,255,.01)" : "transparent"
                  }}>
                    <td style={{ padding: "10px 16px", fontSize: 18 }}>{user.avatar}</td>
                    <td style={{ padding: "10px 16px", color: "#fff", fontSize: 13, fontWeight: 600 }}>{user.name}</td>
                    <td style={{ padding: "10px 16px", color: "rgba(255,255,255,.45)", fontSize: 12 }}>{user.username}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontSize: 10,
                        background: user.isAdmin ? "rgba(78,205,196,.1)" : "rgba(255,255,255,.04)",
                        border: `1px solid ${user.isAdmin ? "rgba(78,205,196,.28)" : "rgba(255,255,255,.09)"}`,
                        color: user.isAdmin ? "#4ECDC4" : "rgba(255,255,255,.38)"
                      }}>
                        {user.isAdmin ? "Admin" : "Jugador"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      {editCredits.id === user.id ? (
                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                          <input
                            type="number"
                            value={editCredits.val}
                            onChange={e => setEditCredits(p => ({ ...p, val: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                const v = parseInt(editCredits.val);
                                if (!isNaN(v) && v >= 0) {
                                  setDb(prev => ({
                                    ...prev,
                                    users: prev.users.map(u => u.id === user.id ? { ...u, credits: v } : u)
                                  }));
                                  toast("Créditos actualizados", "success");
                                }
                                setEditCredits({ id: null, val: "" });
                              }
                            }}
                            style={{ ...inputStyle, width: 80, padding: "3px 8px", fontSize: 12 }}
                            autoFocus
                          />
                          <button onClick={() => {
                            const v = parseInt(editCredits.val);
                            if (!isNaN(v) && v >= 0) {
                              setDb(prev => ({
                                ...prev,
                                users: prev.users.map(u => u.id === user.id ? { ...u, credits: v } : u)
                              }));
                              toast("Créditos actualizados", "success");
                            }
                            setEditCredits({ id: null, val: "" });
                          }} style={{
                            background: "rgba(0,200,83,.1)",
                            border: "1px solid rgba(0,200,83,.28)",
                            color: "#00C853",
                            padding: "3px 7px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 12
                          }}>✓</button>
                          <button onClick={() => setEditCredits({ id: null, val: "" })} style={{
                            background: "rgba(255,50,50,.08)",
                            border: "1px solid rgba(255,50,50,.22)",
                            color: "#FF6464",
                            padding: "3px 7px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 12
                          }}>✗</button>
                        </div>
                      ) : (
                        <span style={{ color: YELLOW, fontWeight: 700, fontSize: 14 }}>{user.credits.toLocaleString()}</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setEditCredits({ id: user.id, val: String(user.credits) })} title="Editar créditos" style={{
                          background: "rgba(255,215,0,.07)",
                          border: "1px solid rgba(255,215,0,.2)",
                          color: YELLOW,
                          padding: "5px 10px",
                          borderRadius: 5,
                          cursor: "pointer",
                          fontSize: 13
                        }}>💰</button>
                        <button onClick={() => setEditUser({ ...user })} title="Editar usuario" style={{
                          background: "rgba(78,205,196,.07)",
                          border: "1px solid rgba(78,205,196,.2)",
                          }}>
                          ✏
                        </button>
                        {!user.isAdmin && (
                          <button
                            onClick={() => setDeleteConfirm({ type: "user", id: user.id })}
                            title="Eliminar usuario"
                            style={{
                              background: "rgba(255,50,50,.07)",
                              border: "1px solid rgba(255,50,50,.2)",
                              color: "#FF6464",
                              padding: "5px 10px",
                              borderRadius: 5,
                              cursor: "pointer",
                              fontSize: 13,
                            }}
                          >
                            🗑
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Rifas */}
        {tab === "rifas" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {rifas.map((rifa) => {
              const sold = Object.values(rifa.numbers).filter((n) => n.status === "reservado").length;
              const total = rifa.totalNumbers || 100;
              const soldNumbers = Object.entries(rifa.numbers)
                .filter(([_, n]) => n.status === "reservado")
                .map(([num]) => num);

              return (
                <div
                  key={rifa.id}
                  style={{
                    background: "#0d0d14",
                    border: `1px solid ${rifa.status === "finished" ? "rgba(255,215,0,.2)" : "rgba(255,255,255,.07)"}`,
                    borderRadius: 10,
                    padding: "13px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 24 }}>{rifa.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: 13, marginBottom: 2 }}>
                      {rifa.name}
                    </h4>
                    <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>
                      {rifa.pricePerNumber} cr./número · {rifa.prize} · {total} números
                    </p>
                  </div>
                  {[
                    { label: "Vendidos", val: sold, c: "#00C853" },
                    { label: "Libres", val: total - sold, c: "rgba(255,255,255,.5)" },
                    {
                      label: "Estado",
                      val: rifa.status === "active" ? "Activa" : "🏆 Sorteada",
                      c: rifa.status === "active" ? "#4ECDC4" : YELLOW,
                    },
                  ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: "center", minWidth: 70 }}>
                      <p style={{ color: stat.c, fontWeight: 700, fontSize: 15 }}>{stat.val}</p>
                      <p style={{ color: "rgba(255,255,255,.28)", fontSize: 10 }}>{stat.label}</p>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 6 }}>
                    {/* Botón de editar (solo para rifas activas) */}
                    {rifa.status === "active" && (
                      <button
                        onClick={() => setEditRifa({ ...rifa })}
                        style={{
                          ...buttonStyle,
                          background: "rgba(78,205,196,.07)",
                          border: "1px solid rgba(78,205,196,.2)",
                          color: "#4ECDC4",
                        }}
                      >
                        ✏ Editar
                      </button>
                    )}
                    {/* Botón de sortear (solo para rifas activas con números vendidos) */}
                    {rifa.status === "active" && soldNumbers.length > 0 && (
                      <button
                        onClick={() => startDraw(rifa)}
                        style={{
                          ...buttonStyle,
                          background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
                          border: "none",
                          color: "#000",
                          fontWeight: 700,
                          fontFamily: "'Cinzel', serif",
                          letterSpacing: 0.5,
                        }}
                      >
                        🎡 Sortear
                      </button>
                    )}
                    {/* Botón de reinicio (para TODAS las rifas, activas o sorteadas) */}
                    <button
                      onClick={() => setResetConfirm({ type: "rifa", id: rifa.id })}
                      title="Reiniciar rifa"
                      style={{
                        ...buttonStyle,
                        background: "rgba(0,200,83,.07)",
                        border: "1px solid rgba(0,200,83,.2)",
                        color: "#00C853",
                      }}
                    >
                      🔄 Reiniciar
                    </button>
                    {/* Botón de eliminar */}
                    <button
                      onClick={() => setDeleteConfirm({ type: "rifa", id: rifa.id })}
                      style={{
                        ...buttonStyle,
                        background: "rgba(255,50,50,.07)",
                        border: "1px solid rgba(255,50,50,.2)",
                        color: "#FF6464",
                      }}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab: Cortitos */}
        {tab === "cortitos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {cortitos.map((cortito) => {
              const filled = cortito.players.length;
              const total = cortito.totalSlots;
              return (
                <div
                  key={cortito.id}
                  style={{
                    background: "#0d0d14",
                    border: `1px solid ${cortito.status === "finished" ? "rgba(255,215,0,.2)" : "rgba(255,255,255,.07)"}`,
                    borderRadius: 10,
                    padding: "13px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 24 }}>📋</span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: 13, marginBottom: 2 }}>
                      {cortito.name}
                    </h4>
                    <p style={{ color: "rgba(255,255,255,.38)", fontSize: 12 }}>
                      {cortito.description} · {cortito.costPerSlot} cr./slot · {total} slots
                    </p>
                  </div>
                  {[
                    { label: "Ocupados", val: filled, c: "#00C853" },
                    { label: "Libres", val: total - filled, c: "rgba(255,255,255,.5)" },
                    {
                      label: "Estado",
                      val: cortito.status === "open" ? "Abierto" : "🏆 Finalizado",
                      c: cortito.status === "open" ? "#4ECDC4" : YELLOW,
                    },
                  ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: "center", minWidth: 70 }}>
                      <p style={{ color: stat.c, fontWeight: 700, fontSize: 15 }}>{stat.val}</p>
                      <p style={{ color: "rgba(255,255,255,.28)", fontSize: 10 }}>{stat.label}</p>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 6 }}>
                    {/* Botón de editar (solo para cortitos abiertos) */}
                    {cortito.status === "open" && (
                      <button
                        onClick={() => setEditCortito({ ...cortito })}
                        style={{
                          ...buttonStyle,
                          background: "rgba(78,205,196,.07)",
                          border: "1px solid rgba(78,205,196,.2)",
                          color: "#4ECDC4",
                        }}
                      >
                        ✏ Editar
                      </button>
                    )}
                    {/* Botón de reinicio (para TODOS los cortitos) */}
                    <button
                      onClick={() => setResetConfirm({ type: "cortito", id: cortito.id })}
                      title="Reiniciar cortito"
                      style={{
                        ...buttonStyle,
                        background: "rgba(0,200,83,.07)",
                        border: "1px solid rgba(0,200,83,.2)",
                        color: "#00C853",
                      }}
                    >
                      🔄 Reiniciar
                    </button>
                    {/* Botón de eliminar */}
                    <button
                      onClick={() => setDeleteConfirm({ type: "cortito", id: cortito.id })}
                      style={{
                        ...buttonStyle,
                        background: "rgba(255,50,50,.07)",
                        border: "1px solid rgba(255,50,50,.2)",
                        color: "#FF6464",
                      }}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- MODALES --- */}
        {/* Modal: Editar Usuario */}
        {editUser && (
          <div
            onClick={(e) => e.target === e.currentTarget && setEditUser(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                width: "min(420px,100%)",
                background: "#0d0d14",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 14,
                padding: "28px",
                boxShadow: "0 20px 60px rgba(0,0,0,.6)",
              }}
            >
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: 16, marginBottom: 18 }}>Editar Usuario</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Nombre completo", key: "name", type: "text" },
                  { label: "Usuario", key: "username", type: "text" },
                  { label: "Contraseña", key: "password", type: "text" },
                ].map((field) => (
                  <div key={field.key}>
                    <label
                      style={{
                        color: "rgba(255,255,255,.4)",
                        fontSize: 11,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: 5,
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={editUser[field.key]}
                      onChange={(e) => setEditUser((p) => ({ ...p, [field.key]: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <label
                    style={{
                      color: "rgba(255,255,255,.4)",
                      fontSize: 11,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    Créditos
                  </label>
                  <input
                    type="number"
                    value={editUser.credits}
                    onChange={(e) => setEditUser((p) => ({ ...p, credits: parseInt(e.target.value) || 0 }))}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => setEditUser(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.09)",
                    borderRadius: 8,
                    color: "rgba(255,255,255,.5)",
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEditUser}
                  style={{
                    flex: 2,
                    padding: "10px",
                    background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
                    border: "none",
                    borderRadius: 8,
                    color: "#000",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: 1,
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Editar Rifa */}
        {editRifa && (
          <div
            onClick={(e) => e.target === e.currentTarget && setEditRifa(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                width: "min(420px,100%)",
                background: "#0d0d14",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 14,
                padding: "28px",
                boxShadow: "0 20px 60px rgba(0,0,0,.6)",
              }}
            >
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: 16, marginBottom: 18 }}>Editar Rifa</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  value={editRifa.name}
                  onChange={(e) => setEditRifa((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nombre de la rifa"
                  style={inputStyle}
                />
                <input
                  value={editRifa.subtitle}
                  onChange={(e) => setEditRifa((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Descripción corta"
                  style={inputStyle}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input
                    value={editRifa.prize}
                    onChange={(e) => setEditRifa((p) => ({ ...p, prize: e.target.value }))}
                    placeholder="Premio"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={editRifa.pricePerNumber}
                    onChange={(e) => setEditRifa((p) => ({ ...p, pricePerNumber: +e.target.value }))}
                    placeholder="Costo/número"
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input
                    value={editRifa.icon}
                    onChange={(e) => setEditRifa((p) => ({ ...p, icon: e.target.value }))}
                    placeholder="Ícono (emoji)"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={editRifa.totalNumbers}
                    onChange={(e) => setEditRifa((p) => ({ ...p, totalNumbers: +e.target.value }))}
                    placeholder="Cant. de números"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => setEditRifa(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.09)",
                    borderRadius: 8,
                    color: "rgba(255,255,255,.5)",
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEditRifa}
                  style={{
                    flex: 2,
                    padding: "10px",
                    background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
                    border: "none",
                    borderRadius: 8,
                    color: "#000",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: 1,
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Editar Cortito */}
        {editCortito && (
          <div
            onClick={(e) => e.target === e.currentTarget && setEditCortito(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                width: "min(420px,100%)",
                background: "#0d0d14",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 14,
                padding: "28px",
                boxShadow: "0 20px 60px rgba(0,0,0,.6)",
              }}
            >
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: 16, marginBottom: 18 }}>Editar Cortito</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  value={editCortito.name}
                  onChange={(e) => setEditCortito((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nombre del cortito"
                  style={inputStyle}
                />
                <input
                  value={editCortito.description}
                  onChange={(e) => setEditCortito((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Descripción"
                  style={inputStyle}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input
                    type="number"
                    value={editCortito.costPerSlot}
                    onChange={(e) => setEditCortito((p) => ({ ...p, costPerSlot: +e.target.value }))}
                    placeholder="Costo por slot"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={editCortito.totalSlots}
                    onChange={(e) => setEditCortito((p) => ({ ...p, totalSlots: +e.target.value }))}
                    placeholder="Total de slots"
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <input
                    type="number"
                    value={editCortito.casillerosToWin}
                    onChange={(e) => setEditCortito((p) => ({ ...p, casillerosToWin: +e.target.value }))}
                    placeholder="Casilleros para ganar"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={editCortito.bolMin}
                    onChange={(e) => setEditCortito((p) => ({ ...p, bolMin: +e.target.value }))}
                    placeholder="Bola mínima"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={editCortito.bolMax}
                    onChange={(e) => setEditCortito((p) => ({ ...p, bolMax: +e.target.value }))}
                    placeholder="Bola máxima"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => setEditCortito(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.09)",
                    borderRadius: 8,
                    color: "rgba(255,255,255,.5)",
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEditCortito}
                  style={{
                    flex: 2,
                    padding: "10px",
                    background: `linear-gradient(135deg, ${YELLOW2}, ${YELLOW})`,
                    border: "none",
                    borderRadius: 8,
                    color: "#000",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: 1,
                    }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Confirmar eliminación */}
        {deleteConfirm && (
          <div
            onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                width: "min(400px,100%)",
                background: "#0d0d14",
                border: "1px solid rgba(255,100,100,.28)",
                borderRadius: 14,
                padding: "28px",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "#FF6464", fontSize: 16, marginBottom: 10 }}>
                ¿Eliminar {deleteConfirm.type === "user" ? "usuario" : deleteConfirm.type === "rifa" ? "rifa" : "cortito"}?
              </h3>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginBottom: 20 }}>
                Esta acción no se puede deshacer.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    padding: "10px 20px",
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.09)",
                    borderRadius: 8,
                    color: "rgba(255,255,255,.5)",
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === "user") deleteUser(deleteConfirm.id);
                    else if (deleteConfirm.type === "rifa") deleteRifa(deleteConfirm.id);
                    else if (deleteConfirm.type === "cortito") deleteCortito(deleteConfirm.id);
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "rgba(255,50,50,.1)",
                    border: "1px solid rgba(255,50,50,.28)",
                    borderRadius: 8,
                    color: "#FF6464",
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Confirmar reinicio */}
        {resetConfirm && (
          <div
            onClick={(e) => e.target === e.currentTarget && setResetConfirm(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                width: "min(400px,100%)",
                background: "#0d0d14",
                border: "1px solid rgba(0,200,83,.28)",
                borderRadius: 14,
                padding: "28px",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "#00C853", fontSize: 16, marginBottom: 10 }}>
                ¿Reiniciar {resetConfirm.type === "rifa" ? "rifa" : "cortito"}?
              </h3>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginBottom: 20 }}>
                Se borrarán todos los números/participantes y el ganador actual. ¿Estás seguro?
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  onClick={() => setResetConfirm(null)}
                  style={{
                    padding: "10px 20px",
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.09)",
                    borderRadius: 8,
                    color: "rgba(255,255,255,.5)",
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (resetConfirm.type === "rifa") resetRifa(resetConfirm.id);
                    else if (resetConfirm.type === "cortito") resetCortito(resetConfirm.id);
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "rgba(0,200,83,.1)",
                    border: "1px solid rgba(0,200,83,.28)",
                    borderRadius: 8,
                    color: "#00C853",
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Ruleta */}
        {showRoulette && rifaToDraw && (
          <div
            onClick={(e) => e.target === e.currentTarget && setShowRoulette(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 3000,
              background: "rgba(0,0,0,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                background: BG,
                border: `2px solid ${YELLOW}`,
                borderRadius: 15,
                padding: 20,
                maxWidth: 800,
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h2
                  style={{
                    color: YELLOW,
                    fontFamily: "'Cinzel', serif",
                    fontSize: 18,
                  }}
                >
                  Sorteo: {rifaToDraw.name}
                </h2>
                <button
                  onClick={() => setShowRoulette(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,.2)",
                    color: "rgba(255,255,255,.5)",
                    padding: "5px 10px",
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  ✕ Cerrar
                </button>
              </div>
              <Roulette
                numbers={rouletteNumbers}
                onClose={() => setShowRoulette(false)}
                onWinnerSelected={handleWinnerSelected}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}