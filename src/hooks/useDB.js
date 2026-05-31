import { useState, useCallback, useRef } from "react";
import { DB_KEY, USERS_INIT, RIFAS_INIT, CORTITOS_INIT, PLANILLAS_INIT } from "../utils/constants";
 
const NO_PERMS = { canGiveCredits:false, canApproveCredits:false, canCreateUsers:false, canManageGames:false };
 
function runDraw(cortito) {
  const { players, bolMin, bolMax, casillerosToWin, totalSlots } = cortito;
  const counters = {};
  players.forEach(p => { counters[p.slotNumber] = 0; });
  const seq = []; let winner = null; let safety = 500;
  while (!winner && safety-- > 0) {
    const n = Math.floor(Math.random() * (bolMax - bolMin + 1)) + bolMin;
    seq.push(n);
    if (n >= 1 && n <= totalSlots && counters[n] !== undefined) {
      counters[n]++;
      if (counters[n] >= casillerosToWin) {
        winner = { slotNumber: n, player: players.find(p => p.slotNumber === n) || null };
      }
    }
  }
  return { seq, winner };
}
 
function runPlanillaDraw(planilla) {
  const { totalNumbers, timesOut } = planilla;
  const counters = {};
  for (let i = 1; i <= totalNumbers; i++) counters[i] = 0;
  const seq = []; let winner = null; let safety = 5000;
  while (!winner && safety-- > 0) {
    const n = Math.floor(Math.random() * totalNumbers) + 1;
    seq.push(n);
    counters[n]++;
    if (counters[n] >= timesOut) {
      winner = { number: n, slots: planilla.numbers?.[String(n)] || [null,null,null,null] };
      break;
    }
  }
  return { seq, winner };
}
 
const CURRENT_DB_KEY = DB_KEY + "_v4"; // bumped → fuerza reset con nuevos roles
 
export function useDB() {
  const [db, setDb] = useState(() => {
    try {
      const raw = localStorage.getItem(CURRENT_DB_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        let dirty = false;
 
        // Migración: role + permissions en usuarios existentes
        if (parsed.users?.some(u => !u.role || !u.permissions)) {
          parsed.users = parsed.users.map(u => ({
            ...u,
            role: u.role || (u.isAdmin ? "admin" : "player"),
            permissions: u.permissions || NO_PERMS,
          }));
          dirty = true;
        }
        // Migración: agregar planillas si no existen
        if (!parsed.planillas) { parsed.planillas = PLANILLAS_INIT; dirty = true; }
        // Recuperar estados "running" trabados
        if (parsed.cortitos?.some(c => c.status === "running")) {
          parsed.cortitos = parsed.cortitos.map(c => c.status === "running" ? { ...c, status:"open" } : c);
          dirty = true;
        }
        if (parsed.planillas?.some(p => p.status === "running")) {
          parsed.planillas = parsed.planillas.map(p => p.status === "running" ? { ...p, status:"open" } : p);
          dirty = true;
        }
        if (dirty) localStorage.setItem(CURRENT_DB_KEY, JSON.stringify(parsed));
        return parsed;
      }
    } catch(e) { console.error("Error cargando DB:", e); }
 
    const initial = { users:USERS_INIT, rifas:RIFAS_INIT, creditRequests:[], cortitos:CORTITOS_INIT, planillas:PLANILLAS_INIT };
    localStorage.setItem(CURRENT_DB_KEY, JSON.stringify(initial));
    return initial;
  });
 
  const saveDB = newDb => { try { localStorage.setItem(CURRENT_DB_KEY, JSON.stringify(newDb)); } catch(e) { console.error(e); } };
  const processingRef = useRef(new Set());
 
  const checkAndRunDraws = useCallback(currentDb => {
    // Cortitos
    const rc = currentDb.cortitos?.find(c =>
      c.players.length === c.totalSlots && c.status === "open" && !processingRef.current.has(`c-${c.id}`)
    );
    if (rc) {
      processingRef.current.add(`c-${rc.id}`);
      setDb(prev => { const n = {...prev, cortitos:prev.cortitos.map(c => c.id===rc.id?{...c,status:"running"}:c)}; saveDB(n); return n; });
      setTimeout(() => {
        const prize = rc.costPerSlot * rc.totalSlots;
        const { seq, winner } = runDraw(rc);
        setDb(prev => {
          const n = { ...prev,
            users: winner?.player ? prev.users.map(u => u.id===winner.player.userId?{...u,credits:u.credits+prize}:u) : prev.users,
            cortitos: prev.cortitos.map(c => c.id===rc.id?{...c,seq,winner,status:"finished"}:c),
          };
          saveDB(n); return n;
        });
        processingRef.current.delete(`c-${rc.id}`);
      }, 1500);
    }
    // Planillas
    const rp = currentDb.planillas?.find(p => {
      if (p.status !== "open" || processingRef.current.has(`p-${p.id}`)) return false;
      for (let n = 1; n <= p.totalNumbers; n++) {
        const slots = p.numbers?.[String(n)] || [];
        if (slots.length < 4 || slots.some(s => !s)) return false;
      }
      return true;
    });
    if (rp) {
      processingRef.current.add(`p-${rp.id}`);
      setDb(prev => { const n = {...prev, planillas:prev.planillas.map(p => p.id===rp.id?{...p,status:"running"}:p)}; saveDB(n); return n; });
      setTimeout(() => {
        const prizeQ = Math.floor(rp.prize / 4);
        const { seq, winner } = runPlanillaDraw(rp);
        setDb(prev => {
          const owners = winner?.slots?.filter(Boolean) || [];
          const map = {};
          owners.forEach(s => { map[s.userId] = (map[s.userId]||0) + prizeQ; });
          const n = { ...prev,
            users: prev.users.map(u => map[u.id] ? {...u,credits:u.credits+map[u.id]} : u),
            planillas: prev.planillas.map(p => p.id===rp.id?{...p,seq,winner,status:"finished"}:p),
          };
          saveDB(n); return n;
        });
        processingRef.current.delete(`p-${rp.id}`);
      }, 2000);
    }
  }, []);
 
  const updateDB = useCallback(fn => {
    setDb(prev => { const next = fn(prev); saveDB(next); checkAndRunDraws(next); return next; });
  }, [checkAndRunDraws]);
 
  return { db, updateDB };
}