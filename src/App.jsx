import React, { useState, useEffect, useCallback } from "react";
import { useDB } from "./hooks/useDB";
import { Toast } from "./components/common/Toast";
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
 
  // Sincronizar currentUser con la DB
  useEffect(() => {
    if (currentUser) {
      const fresh = db.users.find(u => u.id === currentUser.id);
      if (fresh && JSON.stringify(fresh) !== JSON.stringify(currentUser)) setCurrentUser(fresh);
    }
  }, [db.users, currentUser]);
 
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
 
  const handleLogout = () => { setCurrentUser(null); setView("login"); setLoginForm({ username:"", password:"" }); };
 
  // ── Comprar números de rifa ───────────────────────────────────────────────
  const handleConfirmNumbers = (rifa, numbers) => {
    const total = numbers.length * rifa.pricePerNumber;
    if (currentUser.credits < total) { toast("Créditos insuficientes","error"); return; }
    let updatedNumbers = { ...rifa.numbers };
    numbers.forEach(n => { updatedNumbers[n] = { status:"reservado", userId:currentUser.id }; });
    const soldCount = Object.values(updatedNumbers).filter(n => n.status==="reservado"||n.status==="vendido").length;
    const isFull    = soldCount >= (rifa.totalNumbers || 100);
    updateDB(prev => ({
      ...prev,
      users: prev.users.map(u => u.id===currentUser.id ? { ...u, credits:u.credits-total } : u),
      rifas: prev.rifas.map(r => r.id!==rifa.id ? r : { ...r, numbers:updatedNumbers, status:isFull?"readyToDraw":"active", winner:null }),
    }));
    setConfirmData(null); setSelectedRifa(null);
    toast(`✓ ${numbers.length} número${numbers.length>1?"s":""} reservado${numbers.length>1?"s":""}`, "success");
    setView("lobby");
  };
 
  // ── Cancelar rifa ─────────────────────────────────────────────────────────
  const handleCancelRifa = useCallback((rifaId, numbers) => {
    const rifa = db.rifas.find(r => r.id === rifaId);
    if (!rifa || rifa.status !== "active") { toast("No se puede cancelar en este estado","error"); return; }
    const refund = numbers.length * rifa.pricePerNumber;
    updateDB(prev => {
      const newNums = { ...prev.rifas.find(r=>r.id===rifaId)?.numbers };
      numbers.forEach(n => { delete newNums[n]; });
      return {
        ...prev,
        users: prev.users.map(u => u.id===currentUser.id ? { ...u, credits:u.credits+refund } : u),
        rifas: prev.rifas.map(r => r.id===rifaId ? { ...r, numbers:newNums } : r),
      };
    });
    toast(`✓ Cancelado · Se devolvieron ${refund} cr.`, "success");
  }, [db, currentUser, updateDB, toast]);
 
  // ── Cancelar cortito ──────────────────────────────────────────────────────
  const handleCancelCortito = useCallback((cortitoId, slotNumbers) => {
    const cortito = db.cortitos.find(c => c.id === cortitoId);
    if (!cortito || cortito.status !== "open") { toast("No se puede cancelar en este estado","error"); return; }
    const refund = slotNumbers.length * cortito.costPerSlot;
    updateDB(prev => ({
      ...prev,
      users:    prev.users.map(u => u.id===currentUser.id ? { ...u, credits:u.credits+refund } : u),
      cortitos: prev.cortitos.map(c => c.id===cortitoId
        ? { ...c, players: c.players.filter(p => !(p.userId===currentUser.id && slotNumbers.includes(p.slotNumber))) }
        : c
      ),
    }));
    toast(`✓ Cancelado · Se devolvieron ${refund} cr.`, "success");
  }, [db, currentUser, updateDB, toast]);
 
  // ── Cancelar planilla ─────────────────────────────────────────────────────
  const handleCancelPlanilla = useCallback((planillaId, numStr) => {
    const planilla = db.planillas.find(p => p.id === planillaId);
    if (!planilla || planilla.status !== "open") { toast("No se puede cancelar en este estado","error"); return; }
    const slots   = planilla.numbers?.[numStr] || [];
    const mySlots = slots.filter(s => s?.userId === currentUser.id);
    const cuartos = mySlots.filter(s => s.fraccion==="cuarto").length;
    const medios  = mySlots.filter(s => s.fraccion==="medio").length / 2;
    const enteros = mySlots.filter(s => s.fraccion==="entero").length / 4;
    const refund  = Math.round(cuartos*planilla.prices.cuarto + medios*planilla.prices.medio + enteros*planilla.prices.entero);
    updateDB(prev => ({
      ...prev,
      users:    prev.users.map(u => u.id===currentUser.id ? { ...u, credits:u.credits+refund } : u),
      planillas: prev.planillas.map(p => p.id===planillaId
        ? { ...p, numbers:{ ...p.numbers, [numStr]: slots.map(s => s?.userId===currentUser.id ? null : s) } }
        : p
      ),
    }));
    toast(`✓ Cancelado · Se devolvieron ${refund} cr.`, "success");
  }, [db, currentUser, updateDB, toast]);
 
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
        id: Date.now(), userId:currentUser.id, userName:currentUser.name,
        amount, note, date:new Date().toLocaleDateString("es-AR"), status:"pending",
      }],
    }));
    setShowReqCredit(false);
    toast("Solicitud enviada. El equipo la revisará pronto.", "success");
  };
 
  const liveRifa = selectedRifa ? db.rifas.find(r => r.id===selectedRifa.id)||selectedRifa : null;
 
  const commonHeaderProps = {
    currentUser,
    onLogout:     handleLogout,
    onProfile:    () => setView("profile"),
    onLobby:      () => setView("lobby"),
    onHowItWorks: () => setView("howItWorks"),
    onCortitos:   () => setView("cortitos"),
    onPlanillas:  () => setView("planillas"),
    onSupervisor: () => setView("supervisor"),
  };
 
  // Stream Mode
  if (streamMode && db) return (
    <StreamView db={db} updateDB={updateDB} currentUser={currentUser} onExit={() => setStreamMode(false)} />
  );
 
  return (
    <>
      <Toast notif={notif} />
 
      {showReqCredit && <RequestCreditModal currentUser={currentUser} onSubmit={handleRequestCredit} onCancel={() => setShowReqCredit(false)} />}
      {winnerData    && <WinnerModal winner={winnerData.winner} rifa={winnerData.rifa} onClose={() => { setWinnerData(null); setView("lobby"); }} />}
      {bolilleroRifa && <BolilleroRifas rifa={bolilleroRifa} users={db.users} currentUser={currentUser} isAdmin={currentUser?.role==="admin"||currentUser?.isAdmin||false} onWinner={w => handleRifaWinner(bolilleroRifa,w)} onClose={() => setBolilleroRifa(null)} />}
 
      {view==="ageVerification" && <AgeVerificationScreen onVerified={() => setView("login")} onRejected={() => { document.body.innerHTML="<div style='display:flex;height:100vh;align-items:center;justify-content:center;background:#0d0b1e;color:rgba(255,255,255,.3);font-family:sans-serif;'>Acceso no permitido para menores de 18 años.</div>"; }} />}
      {view==="login"           && <LoginScreen form={loginForm} setForm={setLoginForm} onLogin={handleLogin} error={loginError} />}
 
      {view==="lobby" && currentUser && (
        <GameLobby currentUser={currentUser} rifas={db.rifas}
          onSelectRifa={r => { setSelectedRifa(r); setView("rifa-detail"); }}
          {...commonHeaderProps} onAdmin={() => setView("admin")} />
      )}
 
      {view==="rifa-detail" && currentUser && liveRifa && (
        <NumberGrid rifa={liveRifa} currentUser={currentUser}
          onConfirm={nums => setConfirmData({rifa:liveRifa,numbers:nums})}
          onBack={() => setView("lobby")}
          isAdmin={currentUser?.role==="admin"||currentUser?.isAdmin||false}
          onOpenBolillero={() => setBolilleroRifa(liveRifa)} />
      )}
 
      {view==="profile" && currentUser && (
        <ProfileView currentUser={currentUser} rifas={db.rifas}
          cortitos={db.cortitos} planillas={db.planillas}
          creditRequests={db.creditRequests}
          onBack={() => setView("lobby")} {...commonHeaderProps}
          onRequestCredit={() => setShowReqCredit(true)}
          onCancelRifa={handleCancelRifa}
          onCancelCortito={handleCancelCortito}
          onCancelPlanilla={handleCancelPlanilla} />
      )}
 
      {view==="howItWorks" && currentUser && <HowItWorksView currentUser={currentUser} onBack={() => setView("lobby")} {...commonHeaderProps} />}
      {view==="cortitos"   && currentUser && <CortitosView currentUser={currentUser} db={db} updateDB={updateDB} onBack={() => setView("lobby")} {...commonHeaderProps} />}
      {view==="planillas"  && currentUser && <PlanillasView currentUser={currentUser} db={db} updateDB={updateDB} onBack={() => setView("lobby")} {...commonHeaderProps} />}
 
      {view==="admin" && currentUser && (
        <AdminPanel db={db} setDb={updateDB} onLogout={handleLogout} onLobby={() => setView("lobby")} toast={toast} onStreamMode={() => setStreamMode(true)} />
      )}
 
      {view==="supervisor" && currentUser && (
        <SupervisorPanel currentUser={currentUser} db={db} updateDB={updateDB} onLobby={() => setView("lobby")} onLogout={handleLogout} {...commonHeaderProps} />
      )}
 
      {confirmData && (
        <ConfirmModal rifa={confirmData.rifa} numbers={confirmData.numbers} currentUser={currentUser}
          onConfirm={() => handleConfirmNumbers(confirmData.rifa, confirmData.numbers)}
          onCancel={() => setConfirmData(null)} />
      )}
    </>
  );
}
 