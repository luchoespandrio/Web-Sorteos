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
import { AdminPanel } from "./components/admin/AdminPanel";
import { RequestCreditModal } from "./components/profile/RequestCreditModal";
import { COLORS } from "./utils/constants";

const { YELLOW, YELLOW2 } = COLORS;

export default function RifasReal() {
  // Estado global de la DB
  const { db, updateDB } = useDB();

  // Estado de la app
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("ageVerification"); // Vista actual
  const [selectedRifa, setSelectedRifa] = useState(null); // Rifa seleccionada
  const [confirmData, setConfirmData] = useState(null); // Datos para confirmar jugada
  const [winnerData, setWinnerData] = useState(null); // Datos del ganador
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [notif, setNotif] = useState(null); // Notificación
  const [showReqCredit, setShowReqCredit] = useState(false); // Modal de solicitud de créditos

  // Mantener currentUser sincronizado con la DB
  useEffect(() => {
    if (currentUser) {
      const fresh = db.users.find((u) => u.id === currentUser.id);
      if (fresh && JSON.stringify(fresh) !== JSON.stringify(currentUser)) {
        setCurrentUser(fresh);
      }
    }
  }, [db.users, currentUser]);

  // Función para mostrar notificaciones
  const toast = useCallback((msg, type = "info") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }, []);

  // Manejar login
  const handleLogin = () => {
    const user = db.users.find(
      (u) => u.username === loginForm.username && u.password === loginForm.password
    );
    if (user) {
      setCurrentUser(user);
      setView(user.isAdmin ? "admin" : "lobby");
      setLoginError("");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  };

  // Manejar logout
  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
    setLoginForm({ username: "", password: "" });
  };

  // Lógica de sorteo automático
  const checkAndDraw = (rifa, updatedNumbers) => {
    const total = rifa.totalNumbers || 100;
    const sold = Object.values(updatedNumbers).filter((n) => n.status === "reservado").length;
    if (sold < total) return null;

    // Elegir un ganador al azar
    const entries = Object.entries(updatedNumbers);
    const randIdx = Math.floor(Math.random() * entries.length);
    const [winNum, winEntry] = entries[randIdx];
    const winUser = db.users.find((u) => u.id === winEntry.userId);

    return {
      number: winNum,
      userId: winEntry.userId,
      name: winUser ? winUser.name : "Desconocido",
    };
  };

  // Confirmar números seleccionados
  const handleConfirmNumbers = (rifa, numbers) => {
    const total = numbers.length * rifa.pricePerNumber;
    if (currentUser.credits < total) {
      toast("Créditos insuficientes", "error");
      return;
    }

    // Actualizar números de la rifa
    const padLen = (rifa.totalNumbers || 100) >= 100 ? 2 : 2;
    let updatedNumbers = { ...rifa.numbers };
    numbers.forEach((n) => {
      updatedNumbers[n] = { status: "reservado", userId: currentUser.id };
    });

    // Verificar si hay ganador
    const winner = checkAndDraw(rifa, updatedNumbers);

    // Actualizar DB
    updateDB((prev) => {
      const newUsers = prev.users.map((u) =>
        u.id === currentUser.id ? { ...u, credits: u.credits - total } : u
      );
      const newRifas = prev.rifas.map((r) => {
        if (r.id !== rifa.id) return r;
        return {
          ...r,
          numbers: updatedNumbers,
          status: winner ? "finished" : "active",
          winner: winner || null,
        };
      });
      return { ...prev, users: newUsers, rifas: newRifas };
    });

    setConfirmData(null);
    setSelectedRifa(null);
    toast(`¡${numbers.length} número${numbers.length > 1 ? "s" : ""} reservado${numbers.length > 1 ? "s" : ""}!`, "success");

    if (winner) {
      setTimeout(() => setWinnerData({ winner, rifa: { ...rifa, winner } }), 500);
    } else {
      setView("profile");
    }
  };

  // Solicitar créditos
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

  // Obtener la rifa seleccionada (por si se actualizó)
  const liveRifa = selectedRifa ? db.rifas.find((r) => r.id === selectedRifa.id) || selectedRifa : null;

  // Props comunes para el Header
  const commonHeaderProps = {
    currentUser,
    onLogout: handleLogout,
    onProfile: () => setView("profile"),
    onLobby: () => setView("lobby"),
    onHowItWorks: () => setView("howItWorks"),
    onCortitos: () => setView("cortitos"),
  };

  return (
    <>
      {/* Notificación */}
      <Toast notif={notif} />

      {/* Modal de solicitud de créditos */}
      {showReqCredit && (
        <RequestCreditModal
          currentUser={currentUser}
          onSubmit={handleRequestCredit}
          onCancel={() => setShowReqCredit(false)}
        />
      )}

      {/* Modal de ganador */}
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

      {/* Verificación de edad */}
      {view === "ageVerification" && (
        <AgeVerificationScreen
          onVerified={() => setView("login")}
          onRejected={() => {
            document.body.innerHTML =
              "<div style='display:flex;height:100vh;align-items:center;justify-content:center;background:#0a0a0f;color:rgba(255,255,255,.3);font-family:sans-serif;'>Acceso no permitido para menores de 18 años.</div>";
          }}
        />
      )}

      {/* Login */}
      {view === "login" && (
        <LoginScreen
          form={loginForm}
          setForm={setLoginForm}
          onLogin={handleLogin}
          error={loginError}
        />
      )}

      {/* Lobby (lista de rifas) */}
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
        />
      )}

      {/* Detalle de rifa (selección de números) */}
      {view === "rifa-detail" && currentUser && liveRifa && (
        <NumberGrid
          rifa={liveRifa}
          currentUser={currentUser}
          onConfirm={(nums) => setConfirmData({ rifa: liveRifa, numbers: nums })}
          onBack={() => setView("lobby")}
        />
      )}

      {/* Perfil (mis jugadas) */}
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

      {/* Cómo funciona */}
      {view === "howItWorks" && currentUser && (
        <HowItWorksView
          currentUser={currentUser}
          onBack={() => setView("lobby")}
          {...commonHeaderProps}
        />
      )}

      {/* Cortitos */}
      {view === "cortitos" && currentUser && (
        <CortitosView
          currentUser={currentUser}
          db={db}
          updateDB={updateDB}
          onBack={() => setView("lobby")}
          {...commonHeaderProps}
        />
      )}

      {/* Panel de admin */}
      {view === "admin" && currentUser && (
        <AdminPanel
          db={db}
          setDb={updateDB}
          onLogout={handleLogout}
          onLobby={() => setView("lobby")}
          toast={toast}
        />
      )}

      {/* Modal de confirmación */}
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