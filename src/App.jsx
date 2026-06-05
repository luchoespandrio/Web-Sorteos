import React, { useState, useEffect, useCallback } from "react";
import { useDB } from "./hooks/useDB";
import { Toast } from "./components/common/Toast";
import { Header } from "./components/common/Header";
import { AgeVerificationScreen } from "./components/auth/AgeVerificationScreen";
import { LoginScreen } from "./components/auth/LoginScreen";
import { GameLobby } from "./components/game/GameLobby";
import { NumberGrid } from "./components/game/NumberGrid";
import { ConfirmModal } from "./components/game/ConfirmModal";
import { WinnerModal } from "./components/game/WinnerModal";
import { ProfileView } from "./components/profile/ProfileView";
import { HowItWorksView } from "./components/game/HowItWorksView";
import { CortitosView } from "./components/game/CortitosView";
import { PlanillasView } from "./components/game/PlanillasView";
import { SupervisorPanel } from "./components/admin/SupervisorPanel";
import { StreamView } from "./components/game/StreamView";
import { AdminPanel } from "./components/admin/AdminPanel";
import { RequestCreditModal } from "./components/profile/RequestCreditModal";
// ── NUEVO ──────────────────────────────────────────────────────────────────────
import BolilleroRifas from "./components/game/BolilleroRifas";
// ──────────────────────────────────────────────────────────────────────────────
import { COLORS } from "./utils/constants";
 
const { YELLOW, YELLOW2 } = COLORS;
 
export default function RifasReal() {
  const { db, updateDB, triggerManualDraw, setDrawMode, loading, error } = useDB();
 
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("ageVerification");
  const [selectedRifa, setSelectedRifa] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [winnerData, setWinnerData] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [notif, setNotif] = useState(null);
  const [showReqCredit, setShowReqCredit] = useState(false);
 
  // ── NUEVO: estado del bolillero manual ────────────────────────────────────
  const [bolilleroRifa, setBolilleroRifa] = useState(null);
  const [streamMode, setStreamMode]       = useState(false);
  // ──────────────────────────────────────────────────────────────────────────
 
  // Mantener currentUser sincronizado con la DB
  useEffect(() => {
    if (currentUser) {
      const fresh = db.users.find((u) => u.id === currentUser.id);
      if (fresh && JSON.stringify(fresh) !== JSON.stringify(currentUser)) {
        setCurrentUser(fresh);
      }
    }
  }, [db.users, currentUser]);
 
  const toast = useCallback((msg, type = "info") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }, []);
 
  const handleLogin = () => {
    const user = db.users.find(
      (u) => u.username === loginForm.username && u.password === loginForm.password
    );
    if (user) {
      setCurrentUser(user);
      if (user.role === "admin" || user.isAdmin) setView("admin");
      else if (user.role === "supervisor") setView("supervisor");
      else setView("lobby");
      setLoginError("");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  };
 
  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
    setLoginForm({ username: "", password: "" });
  };
 
  // ── MODIFICADO: ya NO sortea automáticamente ──────────────────────────────
  // Cuando se completan todos los números, la rifa pasa a "readyToDraw".
  // El admin inicia el bolillero manualmente desde NumberGrid.
  const handleConfirmNumbers = (rifa, numbers) => {
    const total = numbers.length * rifa.pricePerNumber;
    if (currentUser.credits < total) {
      toast("Créditos insuficientes", "error");
      return;
    }
 
    let updatedNumbers = { ...rifa.numbers };
    numbers.forEach((n) => {
      updatedNumbers[n] = { status: "reservado", userId: currentUser.id };
    });
 
    // Verificar si se llenaron todos los números
    const totalSlots = rifa.totalNumbers || 100;
    const soldCount  = Object.values(updatedNumbers).filter(
      (n) => n.status === "reservado" || n.status === "vendido"
    ).length;
    const isFull = soldCount >= totalSlots;
 
    updateDB((prev) => {
      const newUsers = prev.users.map((u) =>
        u.id === currentUser.id ? { ...u, credits: u.credits - total } : u
      );
      const newRifas = prev.rifas.map((r) => {
        if (r.id !== rifa.id) return r;
        return {
          ...r,
          numbers: updatedNumbers,
          // Si se llenó → "readyToDraw" (espera sorteo manual)
          // Si no → sigue "active"
          status: isFull ? "readyToDraw" : "active",
          winner: null,
        };
      });
      return { ...prev, users: newUsers, rifas: newRifas };
    });
 
    setConfirmData(null);
    setSelectedRifa(null);
 
    if (isFull) {
      toast("¡Todos los números vendidos! El admin realizará el sorteo.", "success");
    } else {
      toast(
        `¡${numbers.length} número${numbers.length > 1 ? "s" : ""} reservado${numbers.length > 1 ? "s" : ""}!`,
        "success"
      );
    }
 
    setView("lobby");
  };
  // ──────────────────────────────────────────────────────────────────────────
 
  // ── NUEVO: cuando el bolillero elige un ganador ───────────────────────────
  const handleRifaWinner = useCallback((rifa, winner) => {
    const prize =
      Object.keys(rifa.numbers).length * rifa.pricePerNumber;
 
    updateDB((prev) => {
      const newUsers = prev.users.map((u) =>
        u.id === winner.userId ? { ...u, credits: u.credits + prize } : u
      );
      const newRifas = prev.rifas.map((r) =>
        r.id === rifa.id
          ? { ...r, status: "finished", winner: { ...winner, prize } }
          : r
      );
      return { ...prev, users: newUsers, rifas: newRifas };
    });
 
    setBolilleroRifa(null);
    // Mostrar WinnerModal después de cerrar el bolillero
    setTimeout(() => {
      setWinnerData({ winner: { ...winner, prize }, rifa: { ...rifa, winner } });
    }, 400);
 
    toast(`🏆 ¡Ganó ${winner.name} con el número ${winner.number}!`, "success");
  }, [updateDB, toast]);
  // ──────────────────────────────────────────────────────────────────────────
 
  const handleRequestCredit = (amount, note) => {
    const req = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      note,
      date: new Date().toLocaleDateString("es-AR"),
      status: "pending",
    };
    updateDB((prev) => ({
      ...prev,
      creditRequests: [...prev.creditRequests, req],
    }));
    setShowReqCredit(false);
    toast("Solicitud enviada al administrador", "success");
  };
 
  const liveRifa = selectedRifa
    ? db.rifas.find((r) => r.id === selectedRifa.id) || selectedRifa
    : null;
 
  const commonHeaderProps = {
    currentUser,
    onLogout: handleLogout,
    onProfile:    () => setView("profile"),
    onLobby:      () => setView("lobby"),
    onHowItWorks: () => setView("howItWorks"),
    onCortitos:   () => setView("cortitos"),
    onPlanillas:  () => setView("planillas"),
    onSupervisor: () => setView("supervisor"),
  };
 
  // Stream mode: reemplaza toda la UI
  if (streamMode && db) return (
    <StreamView
      db={db} updateDB={updateDB}
      triggerManualDraw={triggerManualDraw}
      currentUser={currentUser}
      onExit={() => setStreamMode(false)}
    />
  );
 
  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#040408", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif",
      gap:16 }}>
      <style>{`@keyframes spinCrown{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize:52, animation:"spinCrown 1.5s linear infinite",
        filter:"drop-shadow(0 0 16px rgba(255,215,0,.5))" }}>👑</div>
      <div style={{ fontFamily:"'Cinzel',serif", color:"rgba(255,215,0,.7)", fontSize:16,
        letterSpacing:4, textTransform:"uppercase" }}>Conectando...</div>
      {error && <div style={{ color:"#FF5252", fontSize:12, maxWidth:300, textAlign:"center" }}>
        ⚠ Error: {error}. Verificá la configuración de Firebase.
      </div>}
    </div>
  );
 
  if (!db) return null;
 
  return (
    <>
      <Toast notif={notif} />
 
      {showReqCredit && (
        <RequestCreditModal
          currentUser={currentUser}
          onSubmit={handleRequestCredit}
          onCancel={() => setShowReqCredit(false)}
        />
      )}
 
      {winnerData && (
        <WinnerModal
          winner={winnerData.winner}
          rifa={winnerData.rifa}
          onClose={() => {
            setWinnerData(null);
            setView("lobby");
          }}
        />
      )}
 
      {/* ── NUEVO: Bolillero manual (pantalla completa) ────────────────────── */}
      {bolilleroRifa && (
        <BolilleroRifas
          rifa={bolilleroRifa}
          users={db.users}
          currentUser={currentUser}
          isAdmin={currentUser?.isAdmin || false}
          onWinner={(winner) => handleRifaWinner(bolilleroRifa, winner)}
          onClose={() => setBolilleroRifa(null)}
        />
      )}
      {/* ────────────────────────────────────────────────────────────────────── */}
 
      {view === "ageVerification" && (
        <AgeVerificationScreen
          onVerified={() => setView("login")}
          onRejected={() => {
            document.body.innerHTML =
              "<div style='display:flex;height:100vh;align-items:center;justify-content:center;background:#0a0a0f;color:rgba(255,255,255,.3);font-family:sans-serif;'>Acceso no permitido para menores de 18 años.</div>";
          }}
        />
      )}
 
      {view === "login" && (
        <LoginScreen
          form={loginForm}
          setForm={setLoginForm}
          onLogin={handleLogin}
          error={loginError}
        />
      )}
 
      {view === "lobby" && currentUser && (
        <GameLobby
          currentUser={currentUser}
          rifas={db.rifas}
          onSelectRifa={(r) => {
            setSelectedRifa(r);
            setView("rifa-detail");
          }}
          {...commonHeaderProps}
          onAdmin={() => setView("admin")}
          onPlanillas={() => setView("planillas")}
        />
      )}
 
      {/* ── MODIFICADO: agrega isAdmin y onOpenBolillero ──────────────────── */}
      {view === "rifa-detail" && currentUser && liveRifa && (
        <NumberGrid
          rifa={liveRifa}
          currentUser={currentUser}
          onConfirm={(nums) => setConfirmData({ rifa: liveRifa, numbers: nums })}
          onBack={() => setView("lobby")}
          isAdmin={currentUser?.isAdmin || false}
          onOpenBolillero={() => setBolilleroRifa(liveRifa)}
        />
      )}
      {/* ────────────────────────────────────────────────────────────────────── */}
 
      {view === "profile" && currentUser && (
        <ProfileView
          currentUser={currentUser}
          rifas={db.rifas}
          creditRequests={db.creditRequests}
          onBack={() => setView("lobby")}
          {...commonHeaderProps}
          onRequestCredit={() => setShowReqCredit(true)}
        />
      )}
 
      {view === "howItWorks" && currentUser && (
        <HowItWorksView
          currentUser={currentUser}
          onBack={() => setView("lobby")}
          {...commonHeaderProps}
        />
      )}
 
      {view === "cortitos" && currentUser && (
        <CortitosView
          currentUser={currentUser}
          db={db}
          updateDB={updateDB}
          onBack={() => setView("lobby")}
          {...commonHeaderProps}
        />
      )}
 
      {view === "planillas" && currentUser && (
        <PlanillasView
          currentUser={currentUser}
          db={db}
          updateDB={updateDB}
          onBack={() => setView("lobby")}
          {...commonHeaderProps}
        />
      )}
 
      {view === "admin" && currentUser && (
        <AdminPanel
          db={db}
          setDb={updateDB}
          onLogout={handleLogout}
          onLobby={() => setView("lobby")}
          toast={toast}
          triggerManualDraw={triggerManualDraw}
          setDrawMode={setDrawMode}
          onStreamMode={() => setStreamMode(true)}
        />
      )}
 
      {confirmData && (
        <ConfirmModal
          rifa={confirmData.rifa}
          numbers={confirmData.numbers}
          currentUser={currentUser}
          onConfirm={() => handleConfirmNumbers(confirmData.rifa, confirmData.numbers)}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </>
  );
}