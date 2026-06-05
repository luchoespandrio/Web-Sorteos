import { useState, useCallback } from "react";
import { USERS_INIT, RIFAS_INIT, CORTITOS_INIT, PLANILLAS_INIT } from "../utils/constants";
 
const DB_KEY = "rifasreal_db_v1";
 
// ─── Estado inicial ───────────────────────────────────────────────────────────
function getInitialDB() {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    users:          USERS_INIT,
    rifas:          RIFAS_INIT,
    cortitos:       CORTITOS_INIT,
    planillas:      PLANILLAS_INIT.map(p => ({ ...p, drawMode: p.drawMode || "auto" })),
    creditRequests: [],
  };
}
 
function saveDB(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) {}
}
 
// ─── Sorteo Cortitos ──────────────────────────────────────────────────────────
function runCortitosDraw(cortito) {
  const { players, bolMin, bolMax, casillerosToWin, totalSlots } = cortito;
  const cnt = {};
  players.forEach(p => { cnt[p.slotNumber] = 0; });
  const seq = []; let winner = null; let safety = 500;
  while (!winner && safety-- > 0) {
    const n = Math.floor(Math.random() * (bolMax - bolMin + 1)) + bolMin;
    seq.push(n);
    if (n >= 1 && n <= totalSlots && cnt[n] !== undefined) {
      cnt[n]++;
      if (cnt[n] >= casillerosToWin)
        winner = { slotNumber: n, player: players.find(p => p.slotNumber === n) || null };
    }
  }
  return { seq, winner };
}
 
// ─── Sorteo Planillas ─────────────────────────────────────────────────────────
function runPlanillaDraw(planilla) {
  const { totalNumbers, timesOut } = planilla;
  const cnt = {};
  for (let i = 1; i <= totalNumbers; i++) cnt[i] = 0;
  const seq = []; let winner = null; let safety = 5000;
  while (!winner && safety-- > 0) {
    const n = Math.floor(Math.random() * totalNumbers) + 1;
    seq.push(n);
    cnt[n]++;
    if (cnt[n] >= timesOut) {
      winner = { number: n, slots: planilla.numbers?.[String(n)] || [null,null,null,null] };
      break;
    }
  }
  return { seq, winner };
}
 
// ─── Comprobación planilla llena ──────────────────────────────────────────────
function isPlanillaFull(p) {
  for (let n = 1; n <= p.totalNumbers; n++) {
    const slots = p.numbers?.[String(n)] || [];
    if (slots.length < 4 || slots.some(s => !s)) return false;
  }
  return true;
}
 
// ─── Hook principal ───────────────────────────────────────────────────────────
export function useDB() {
  const [db, setDb] = useState(() => getInitialDB());
 
  // Actualiza estado + localStorage
  const updateDB = useCallback(fn => {
    setDb(prev => {
      const next = fn(prev);
      saveDB(next);
      // Chequear sorteos automáticos después de actualizar
      checkDraws(next, setDb);
      return next;
    });
  }, []);
 
  // ─── Disparo manual de sorteo ───────────────────────────────────────────
  const triggerManualDraw = useCallback(planillaId => {
    setDb(prev => {
      const planilla = prev.planillas.find(p => p.id === planillaId);
      if (!planilla || (planilla.status !== "open" && planilla.status !== "readyManual")) return prev;
 
      // Marcar running
      const running = {
        ...prev,
        planillas: prev.planillas.map(p =>
          p.id === planillaId ? { ...p, status: "running" } : p
        ),
      };
      saveDB(running);
 
      // Ejecutar sorteo con delay
      setTimeout(() => {
        setDb(cur => {
          const p = cur.planillas.find(x => x.id === planillaId);
          if (!p) return cur;
          const prizeQ = Math.floor(p.prize / 4);
          const { seq, winner } = runPlanillaDraw(p);
          const owners = winner?.slots?.filter(Boolean) || [];
          const map = {};
          owners.forEach(s => { map[s.userId] = (map[s.userId] || 0) + prizeQ; });
          const next = {
            ...cur,
            users:     cur.users.map(u => map[u.id] ? { ...u, credits: u.credits + map[u.id] } : u),
            planillas: cur.planillas.map(x =>
              x.id === planillaId ? { ...x, seq, winner, status: "finished" } : x
            ),
          };
          saveDB(next);
          return next;
        });
      }, 2000);
 
      return running;
    });
  }, []);
 
  // ─── Cambiar modo de sorteo ─────────────────────────────────────────────
  const setDrawMode = useCallback((planillaId, mode) => {
    setDb(prev => {
      const next = {
        ...prev,
        planillas: prev.planillas.map(p =>
          p.id === planillaId ? { ...p, drawMode: mode } : p
        ),
      };
      saveDB(next);
      return next;
    });
  }, []);
 
  return { db, updateDB, triggerManualDraw, setDrawMode, loading: false, error: null };
}
 
// ─── Sorteos automáticos (fuera del hook para evitar stale closures) ──────────
function checkDraws(db, setDb) {
  // Cortito listo
  const rc = db.cortitos?.find(c =>
    c.players.length === c.totalSlots && c.status === "open"
  );
  if (rc) {
    // Marcar running
    const withRunning = {
      ...db,
      cortitos: db.cortitos.map(c => c.id === rc.id ? { ...c, status: "running" } : c),
    };
    saveDB(withRunning);
 
    setTimeout(() => {
      setDb(cur => {
        const cortito = cur.cortitos.find(c => c.id === rc.id);
        if (!cortito || cortito.status !== "running") return cur;
        const prize = cortito.costPerSlot * cortito.totalSlots;
        const { seq, winner } = runCortitosDraw(cortito);
        const next = {
          ...cur,
          users: cur.users.map(u =>
            winner?.player?.userId === u.id ? { ...u, credits: u.credits + prize } : u
          ),
          cortitos: cur.cortitos.map(c =>
            c.id === rc.id ? { ...c, seq, winner, status: "finished" } : c
          ),
        };
        saveDB(next);
        return next;
      });
    }, 1500);
  }
 
  // Planilla auto lista
  const rp = db.planillas?.find(p =>
    p.status === "open" && p.drawMode === "auto" && isPlanillaFull(p)
  );
  if (rp) {
    setTimeout(() => {
      setDb(cur => {
        const planilla = cur.planillas.find(p => p.id === rp.id);
        if (!planilla || planilla.status !== "open") return cur;
        const prizeQ = Math.floor(planilla.prize / 4);
        const { seq, winner } = runPlanillaDraw(planilla);
        const owners = winner?.slots?.filter(Boolean) || [];
        const map = {};
        owners.forEach(s => { map[s.userId] = (map[s.userId] || 0) + prizeQ; });
        const next = {
          ...cur,
          users:     cur.users.map(u => map[u.id] ? { ...u, credits: u.credits + map[u.id] } : u),
          planillas: cur.planillas.map(p =>
            p.id === rp.id ? { ...p, seq, winner, status: "finished" } : p
          ),
        };
        saveDB(next);
        return next;
      });
    }, 2000);
  }
 
  // Planilla manual: marcar readyManual
  db.planillas?.forEach(p => {
    if (p.status === "open" && p.drawMode === "manual" && isPlanillaFull(p)) {
      setDb(cur => {
        const next = {
          ...cur,
          planillas: cur.planillas.map(x =>
            x.id === p.id ? { ...x, status: "readyManual" } : x
          ),
        };
        saveDB(next);
        return next;
      });
    }
  });
}
 