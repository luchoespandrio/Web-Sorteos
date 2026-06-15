import { useState, useCallback } from "react";
import {
  USERS_INIT, RIFAS_INIT, CORTITOS_INIT, PLANILLAS_INIT,
  DB_KEY
} from "../utils/constants";

const INIT = {
  users:                USERS_INIT,
  rifas:                RIFAS_INIT,
  cortitos:             CORTITOS_INIT,
  planillas:            PLANILLAS_INIT.map(p => ({ ...p, drawMode: "auto" })),
  creditRequests:       [],
  registrationRequests: [],
};

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return INIT;
    const parsed = JSON.parse(raw);
    return {
      users:                parsed.users                || INIT.users,
      rifas:                parsed.rifas                || INIT.rifas,
      cortitos:             parsed.cortitos             || INIT.cortitos,
      planillas:            parsed.planillas            || INIT.planillas,
      creditRequests:       parsed.creditRequests       || [],
      registrationRequests: parsed.registrationRequests || [],
    };
  } catch {
    return INIT;
  }
}

function saveDB(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch {}
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

export function useDB() {
  const [db, setDb] = useState(() => loadDB());

  const updateDB = useCallback(fn => {
    setDb(prev => {
      const next = fn(prev);

      // ── Sorteo automático cortitos ──────────────────────────────────────
      const rc = next.cortitos?.find(c =>
        c.players.length === c.totalSlots && c.status === "open"
      );
      if (rc) {
        const prize = rc.costPerSlot * rc.totalSlots;
        const { seq, winner } = runCortitosDraw(rc);
        next.cortitos = next.cortitos.map(c =>
          c.id === rc.id ? { ...c, seq, winner, status: "finished" } : c
        );
        if (winner?.player?.userId) {
          next.users = next.users.map(u =>
            u.id === winner.player.userId ? { ...u, credits: u.credits + prize } : u
          );
        }
      }

      // ── Sorteo automático planillas ─────────────────────────────────────
      const rp = next.planillas?.find(p =>
        p.status === "open" && p.drawMode === "auto" && isPlanillaFull(p)
      );
      if (rp) {
        const prizeQ = Math.floor(rp.prize / 4);
        const { seq, winner } = runPlanillaDraw(rp);
        next.planillas = next.planillas.map(p =>
          p.id === rp.id ? { ...p, seq, winner, status: "finished" } : p
        );
        if (winner?.slots) {
          const map = {};
          winner.slots.filter(Boolean).forEach(s => {
            map[s.userId] = (map[s.userId] || 0) + prizeQ;
          });
          next.users = next.users.map(u =>
            map[u.id] ? { ...u, credits: u.credits + map[u.id] } : u
          );
        }
      }

      // ── Planilla manual: marcar readyManual cuando está llena ───────────
      next.planillas = next.planillas?.map(p =>
        p.status === "open" && p.drawMode === "manual" && isPlanillaFull(p)
          ? { ...p, status: "readyManual" }
          : p
      );

      saveDB(next);
      return next;
    });
  }, []);

  // ── Disparo manual de sorteo ────────────────────────────────────────────
  const triggerManualDraw = useCallback(planillaId => {
    setDb(prev => {
      const planilla = prev.planillas?.find(p => p.id === planillaId);
      if (!planilla || (planilla.status !== "open" && planilla.status !== "readyManual")) return prev;

      const prizeQ = Math.floor(planilla.prize / 4);
      const { seq, winner } = runPlanillaDraw(planilla);
      const map = {};
      winner?.slots?.filter(Boolean).forEach(s => {
        map[s.userId] = (map[s.userId] || 0) + prizeQ;
      });

      const next = {
        ...prev,
        users: prev.users.map(u => map[u.id] ? { ...u, credits: u.credits + map[u.id] } : u),
        planillas: prev.planillas.map(p =>
          p.id === planillaId ? { ...p, seq, winner, status: "finished" } : p
        ),
      };
      saveDB(next);
      return next;
    });
  }, []);

  // ── Cambiar modo de sorteo ──────────────────────────────────────────────
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