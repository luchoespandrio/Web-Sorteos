import React, { useState, useEffect, useCallback } from "react";
import { useDB } from "./hooks/useDB";
import { Toast } from "./components/common/Toast";
import { AgeVerificationScreen } from "./components/auth/AgeVerificationScreen";
import { RegisterScreen } from "./components/auth/RegisterScreen";
import { LoginScreen } from "./components/auth/LoginScreen";
import { GameLobby } from "./components/game/GameLobby";
import { NumberGrid } from "./components/game/NumberGrid";
import { ConfirmModal } from "./components/game/ConfirmModal";
import { WinnerModal } from "./components/game/WinnerModal";
import { ProfileView } from "./components/profile/ProfileView";
import { HowItWorksView } from "./components/game/HowItWorksView";
import { CortitosView } from "./components/game/CortitosView";
import { PlanillasView } from "./components/game/PlanillasView";
import { AdminPanel } from "./components/admin/AdminPanel";
import { SupervisorPanel } from "./components/admin/SupervisorPanel";
import { StreamView } from "./components/game/StreamView";
import { RequestCreditModal } from "./components/profile/RequestCreditModal";
import BolilleroRifas from "./components/game/BolilleroRifas";
 
export default function RifasReal() {
  const { db, updateDB } = useDB();
 
  const [currentUser, setCurrentUser]     = useState(null);
  const [view, setView]                   = useState("ageVerification");
  const [selectedRifa, setSelectedRifa]   = useState(null);
  const [confirmData, setConfirmData]     = useState(null);
  const [winnerData, setWinnerData]       = useState(null);
  const [loginForm, setLoginForm]         = useState({ username:"", password:"" });
  const [loginError, setLoginError]       = useState("");
  const [notif, setNotif]                 = useState(null);
  const [showReqCredit, setShowReqCredit] = useState(false);
  const [bolilleroRifa, setBolilleroRifa] = useState(null);
  const [streamMode, setStreamMode]       = useState(false);
  const [showRegister, setShowRegister]   = useState(false);
 
  useEffect(() => {
    if (currentUser) {
      const fresh = db.users.find(u => u.id === currentUser.id);
      if (fresh && JSON.stringify(fresh) !== JSON.stringify(currentUser)) setCurrentUser(fresh);
    }
  }, [db.users]);
 
  const toast = useCallback((msg, type = "info") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3500);
  }, []);
 
  const handleLogin = () => {
    const user = db.users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      if (user.role === "admin" || user.isAdmin) setView("admin");
      else if (user.role === "supervisor")        setView("supervisor");
      else                                        setView("lobby");
      setLoginError("");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  };
 
  const handleRegister = (data) => {
    updateDB(prev => ({
      ...prev,
      registrationRequests: [...(prev.registrationRequests||[]), {
        id: Date.now(),
        ...data,
        date: new Date().toLocaleDateString("es-AR"),
        status: "pending",
      }],
    }));
  };
 
  const handleLogout = () => {
    setCurrentUser(null); setView("login"); setLoginForm({ username:"", password:"" });
  };
 
  // ── Comprar números rifa ──────────────────────────────────────────────────
  const handleConfirmNumbers = (rifa, numbers) => {
    const total = numbers.length * rifa.pricePerNumber;
    if (currentUser.credits < total) { toast("Créditos insuficientes","error"); return; }
    let updatedNumbers = { ...rifa.numbers };
    numbers.forEach(n => { updatedNumbers[n] = { status:"reservado", userId:currentUser.id }; });
    const soldCount = Object.values(updatedNumbers).filter(n => n.status==="reservado"||n.status==="vendido").length;
    const isFull = soldCount >= (rifa.totalNumbers||100);
    updateDB(prev => ({
      ...prev,
      users: prev.users.map(u => u.id===currentUser.id ? { ...u, credits:u.credits-total } : u),
      rifas: prev.rifas.map(r => r.id!==rifa.id ? r : { ...r, numbers:updatedNumbers, status:isFull?"readyToDraw":"active", winner:null }),
    }));
    setConfirmData(null); setSelectedRifa(null);
    toast(`✓ ${numbers.length} número${numbers.length>1?"s":""} reservado${numbers.length>1?"s":""}`, "success");
    setView("lobby");
  };
 
  // ── CANCELAR RIFA ─────────────────────────────────────────────────────────
  const handleCancelRifa = useCallback((rifaId, numbersToCancel) => {
    updateDB(prev => {
      const rifa = prev.rifas.find(r => r.id === rifaId);
      if (!rifa || rifa.status !== "active") return prev;
      const refund = numbersToCancel.length * rifa.pricePerNumber;
      const newNums = { ...rifa.numbers };
      numbersToCancel.forEach(n => { delete newNums[String(n)]; });
      toast(`✓ Jugada cancelada · +${refund} cr. devueltos`, "success");
      return {
        ...prev,
        users: prev.users.map(u => u.id===currentUser.id ? { ...u, credits:u.credits+refund } : u),
        rifas: prev.rifas.map(r => r.id===rifaId ? { ...r, numbers:newNums } : r),
      };
    });
  }, [currentUser, updateDB, toast]);
 
  // ── CANCELAR CORTITO ──────────────────────────────────────────────────────
  const handleCancelCortito = useCallback((cortitoId, slotNumbers) => {
    updateDB(prev => {
      const c = prev.cortitos.find(x => x.id === cortitoId);
      if (!c || c.status !== "open") return prev;
      const refund = slotNumbers.length * c.costPerSlot;
      toast(`✓ Jugada cancelada · +${refund} cr. devueltos`, "success");
      return {
        ...prev,
        users: prev.users.map(u => u.id===currentUser.id ? { ...u, credits:u.credits+refund } : u),
        cortitos: prev.cortitos.map(x => x.id===cortitoId
          ? { ...x, players: x.players.filter(p => !(p.userId===currentUser.id && slotNumbers.includes(p.slotNumber))) }
          : x
        ),
      };
    });
  }, [currentUser, updateDB, toast]);
 
  // ── CANCELAR PLANILLA ─────────────────────────────────────────────────────
  const handleCancelPlanilla = useCallback((planillaId, numStr) => {
    updateDB(prev => {
      const p = prev.planillas.find(x => x.id === planillaId);
      if (!p || p.status !== "open") return prev;
      const slots   = p.numbers?.[numStr] || [];
      const mySlots = slots.filter(s => s?.userId === currentUser.id);
      if (!mySlots.length) return prev;
      const cuartos = mySlots.filter(s => s.fraccion==="cuarto").length;
      const medios  = mySlots.filter(s => s.fraccion==="medio").length / 2;
      const enteros = mySlots.filter(s => s.fraccion==="entero").length / 4;
      const refund  = Math.round(cuartos*(p.prices?.cuarto||0)+medios*(p.prices?.medio||0)+enteros*(p.prices?.entero||0));
      const newSlots = slots.map(s => s?.userId===currentUser.id ? null : s);
      toast(`✓ Cuartos cancelados · +${refund} cr. devueltos`, "success");
      return {
        ...prev,
        users:     prev.users.map(u => u.id===currentUser.id ? { ...u, credits:u.credits+refund } : u),
        planillas: prev.planillas.map(x => x.id===planillaId
          ? { ...x, numbers:{ ...x.numbers, [numStr]:newSlots } }
          : x
        ),
      };
    });
  }, [currentUser, updateDB, toast]);
 
  // ── Ganador bolillero ─────────────────────────────────────────────────────
  const handleRifaWinner = useCallback((rifa, winner) => {
    const prize = Object.keys(rifa.numbers).length * rifa.pricePerNumber;
    updateDB(prev => ({
      ...prev,
      users: prev.users.map(u => u.id===winner.userId ? { ...u, credits:u.credits+prize } : u),
      rifas: prev.rifas.map(r => r.id===rifa.id ? { ...r, status:"finished", winner:{...winner,prize} } : r),
    }));
    setBolilleroRifa(null);
    setTimeout(() => setWinnerData({ winner:{...winner,prize}, rifa:{...rifa,winner} }), 400);
    toast(`🏆 ¡Ganó ${winner.name} con el número ${winner.number}!`, "success");
  }, [updateDB, toast]);
 
  // ── Pedir créditos ────────────────────────────────────────────────────────
  const handleRequestCredit = (amount, note) => {
    updateDB(prev => ({
      ...prev,
      creditRequests: [...prev.creditRequests, {
        id:Date.now(), userId:currentUser.id, userName:currentUser.name,
        amount, note, date:new Date().toLocaleDateString("es-AR"), status:"pending",
      }],
    }));
    setShowReqCredit(false);
    toast("Solicitud enviada. El equipo la revisará pronto.", "success");
  };
 
  const liveRifa = selectedRifa ? db.rifas.find(r => r.id===selectedRifa.id)||selectedRifa : null;
 
  const hp = {
    currentUser,
    onLogout:     handleLogout,
    onProfile:    () => setView("profile"),
    onLobby:      () => setView("lobby"),
    onHowItWorks: () => setView("howItWorks"),
    onCortitos:   () => setView("cortitos"),
    onPlanillas:  () => setView("planillas"),
    onSupervisor: () => setView("supervisor"),
  };
 
  if (streamMode && db) return (
    <StreamView db={db} updateDB={updateDB} currentUser={currentUser} onExit={() => setStreamMode(false)} />
  );
 
  return (
    <>
      <Toast notif={notif} />
      {showReqCredit && <RequestCreditModal currentUser={currentUser} onSubmit={handleRequestCredit} onCancel={() => setShowReqCredit(false)} />}
      {winnerData   && <WinnerModal winner={winnerData.winner} rifa={winnerData.rifa} onClose={() => { setWinnerData(null); setView("lobby"); }} />}
      {bolilleroRifa&& <BolilleroRifas rifa={bolilleroRifa} users={db.users} currentUser={currentUser} isAdmin={currentUser?.role==="admin"||currentUser?.isAdmin||false} onWinner={w => handleRifaWinner(bolilleroRifa,w)} onClose={() => setBolilleroRifa(null)} />}
 
      {view==="ageVerification" && <AgeVerificationScreen onVerified={() => setView("login")} onRejected={() => { document.body.innerHTML="<div style='display:flex;height:100vh;align-items:center;justify-content:center;background:#0d0b1e;color:rgba(255,255,255,.3);font-family:sans-serif;'>Acceso no permitido para menores de 18 años.</div>"; }} />}
      {showRegister && <RegisterScreen onBack={() => setShowRegister(false)} onSubmit={handleRegister} />}
      {view==="login" && !showRegister && <LoginScreen form={loginForm} setForm={setLoginForm} onLogin={handleLogin} error={loginError} onRegister={() => setShowRegister(true)} />}
 
      {view==="lobby" && currentUser && (
        <GameLobby currentUser={currentUser} rifas={db.rifas}
          onSelectRifa={r => { setSelectedRifa(r); setView("rifa-detail"); }}
          {...hp} onAdmin={() => setView("admin")} />
      )}
 
      {view==="rifa-detail" && currentUser && liveRifa && (
        <NumberGrid rifa={liveRifa} currentUser={currentUser}
          onConfirm={nums => setConfirmData({rifa:liveRifa,numbers:nums})}
          onBack={() => setView("lobby")}
          isAdmin={currentUser?.role==="admin"||currentUser?.isAdmin||false}
          onOpenBolillero={() => setBolilleroRifa(liveRifa)} />
      )}
 
      {view==="profile" && currentUser && (
        <ProfileView
          currentUser={currentUser}
          rifas={db.rifas}
          cortitos={db.cortitos||[]}
          planillas={db.planillas||[]}
          creditRequests={db.creditRequests||[]}
          onBack={() => setView("lobby")}
          {...hp}
          onRequestCredit={() => setShowReqCredit(true)}
          onCancelRifa={handleCancelRifa}
          onCancelCortito={handleCancelCortito}
          onCancelPlanilla={handleCancelPlanilla}
        />
      )}
 
      {view==="howItWorks" && currentUser && <HowItWorksView currentUser={currentUser} onBack={() => setView("lobby")} {...hp} />}
      {view==="cortitos"   && currentUser && <CortitosView currentUser={currentUser} db={db} updateDB={updateDB} onBack={() => setView("lobby")} {...hp} />}
      {view==="planillas"  && currentUser && <PlanillasView currentUser={currentUser} db={db} updateDB={updateDB} onBack={() => setView("lobby")} {...hp} />}
 
      {view==="admin" && currentUser && (
        <AdminPanel db={db} setDb={updateDB} onLogout={handleLogout} onLobby={() => setView("lobby")} toast={toast} onStreamMode={() => setStreamMode(true)} />
      )}
      {view==="supervisor" && currentUser && (
        <SupervisorPanel currentUser={currentUser} db={db} updateDB={updateDB} onLobby={() => setView("lobby")} onLogout={handleLogout} {...hp} />
      )}
 
      {confirmData && (
        <ConfirmModal rifa={confirmData.rifa} numbers={confirmData.numbers} currentUser={currentUser}
          onConfirm={() => handleConfirmNumbers(confirmData.rifa, confirmData.numbers)}
          onCancel={() => setConfirmData(null)} />
      )}
    </>
  );
}
 