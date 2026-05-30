import { useState, useCallback, useRef } from "react";
import { DB_KEY, USERS_INIT, RIFAS_INIT, CORTITOS_INIT, PLANILLAS_INIT } from "../utils/constants";

// ─── Lógica del sorteo de Cortitos ───────────────────────────────────────────
function runDraw(cortito) {
  const { players, bolMin, bolMax, casillerosToWin, totalSlots } = cortito;
  const counters = {};
  players.forEach((p) => { counters[p.slotNumber] = 0; });
 
  const seq   = [];
  let winner  = null;
  let safety  = 500;
 
  while (!winner && safety-- > 0) {
    const n = Math.floor(Math.random() * (bolMax - bolMin + 1)) + bolMin;
    seq.push(n);
    if (n >= 1 && n <= totalSlots && counters[n] !== undefined) {
      counters[n]++;
      if (counters[n] >= casillerosToWin) {
        const player = players.find((p) => p.slotNumber === n);
        winner = { slotNumber: n, player: player || null };
      }
    }
  }
 
  return { seq, winner };
}

// ─── Lógica del sorteo de Planillas ──────────────────────────────────────────
// "Sale N veces": el bolillero sortea números 1..totalNumbers hasta que
// alguno aparece N veces. Ese número gana; sus dueños cobran prize/4 por slot.
function runPlanillaDraw(planilla) {
  const { totalNumbers, timesOut } = planilla;
  const counters = {};
  for (let i = 1; i <= totalNumbers; i++) counters[i] = 0;

  const seq    = [];
  let winner   = null;
  let safety   = 5000;

  while (!winner && safety-- > 0) {
    const n = Math.floor(Math.random() * totalNumbers) + 1;
    seq.push(n);
    counters[n]++;
    if (counters[n] >= timesOut) {
      const slots = planilla.numbers?.[String(n)] || [null, null, null, null];
      winner = { number: n, slots };
      break;
    }
  }

  return { seq, winner };
}
 
// ─── Clave de la DB — cambiá el número al final para forzar reset en prod ────
const CURRENT_DB_KEY = DB_KEY + "_v3";
 
export function useDB() {
  const [db, setDb] = useState(() => {
    try {
      const raw = localStorage.getItem(CURRENT_DB_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
 
        // ── Recuperar cortitos trabados en "running" ───────────────────────
        // Si un cortito quedó en "running" (por un reload o deploy anterior),
        // lo regresamos a "open" para que el nuevo ciclo lo procese limpiamente.
        const hasStaleCortitos = parsed.cortitos?.some(
          (c) => c.status === "running"
        );
        if (hasStaleCortitos) {
          parsed.cortitos = parsed.cortitos.map((c) =>
            c.status === "running" ? { ...c, status: "open" } : c
          );
          localStorage.setItem(CURRENT_DB_KEY, JSON.stringify(parsed));
        }
 
        return parsed;
      }
    } catch (e) {
      console.error("Error al cargar la DB:", e);
    }
 
    // DB inicial
    const initial = {
      users: USERS_INIT,
      rifas: RIFAS_INIT,
      creditRequests: [],
      cortitos: CORTITOS_INIT,
      planillas: PLANILLAS_INIT,
    };
    localStorage.setItem(CURRENT_DB_KEY, JSON.stringify(initial));
    return initial;
  });
 
  const saveDB = (newDb) => {
    try {
      localStorage.setItem(CURRENT_DB_KEY, JSON.stringify(newDb));
    } catch (e) {
      console.error("Error al guardar la DB:", e);
    }
  };
 
  // ── Ref para cortitos en proceso — vive en el hook, no en los componentes ──
  const processingRef = useRef(new Set());
 
  const checkAndRunDraws = useCallback((currentDb) => {
    // ── Cortitos ──────────────────────────────────────────────────────────────
    const readyCortito = currentDb.cortitos?.find(
      (c) =>
        c.players.length === c.totalSlots &&
        c.status === "open" &&
        !processingRef.current.has(`cortito-${c.id}`)
    );

    if (readyCortito) {
      processingRef.current.add(`cortito-${readyCortito.id}`);

      setDb((prev) => {
        const next = {
          ...prev,
          cortitos: prev.cortitos.map((c) =>
            c.id === readyCortito.id ? { ...c, status: "running" } : c
          ),
        };
        saveDB(next);
        return next;
      });

      setTimeout(() => {
        const prize = readyCortito.costPerSlot * readyCortito.totalSlots;
        const { seq, winner } = runDraw(readyCortito);

        setDb((prev) => {
          const next = {
            ...prev,
            users: winner?.player
              ? prev.users.map((u) =>
                  u.id === winner.player.userId
                    ? { ...u, credits: u.credits + prize }
                    : u
                )
              : prev.users,
            cortitos: prev.cortitos.map((c) =>
              c.id === readyCortito.id
                ? { ...c, seq, winner, status: "finished" }
                : c
            ),
          };
          saveDB(next);
          return next;
        });

        processingRef.current.delete(`cortito-${readyCortito.id}`);
      }, 1500);
    }

    // ── Planillas ─────────────────────────────────────────────────────────────
    // Se dispara cuando todos los slots (totalNumbers × 4) están ocupados
    const readyPlanilla = currentDb.planillas?.find((p) => {
      if (p.status !== "open") return false;
      if (processingRef.current.has(`planilla-${p.id}`)) return false;
      // Verificar que todos los números tienen sus 4 cuartos llenos
      for (let n = 1; n <= p.totalNumbers; n++) {
        const slots = p.numbers?.[String(n)] || [];
        if (slots.length < 4 || slots.some((s) => !s)) return false;
      }
      return true;
    });

    if (readyPlanilla) {
      processingRef.current.add(`planilla-${readyPlanilla.id}`);

      setDb((prev) => {
        const next = {
          ...prev,
          planillas: prev.planillas.map((p) =>
            p.id === readyPlanilla.id ? { ...p, status: "running" } : p
          ),
        };
        saveDB(next);
        return next;
      });

      setTimeout(() => {
        const prizePerSlot = readyPlanilla.prize / 4;
        const { seq, winner } = runPlanillaDraw(readyPlanilla);

        setDb((prev) => {
          // Distribuir premio entre dueños de slots del número ganador
          const slotOwners = winner?.slots?.filter(Boolean) || [];
          const creditMap = {};
          slotOwners.forEach((slot) => {
            creditMap[slot.userId] = (creditMap[slot.userId] || 0) + prizePerSlot;
          });

          const next = {
            ...prev,
            users: prev.users.map((u) =>
              creditMap[u.id] ? { ...u, credits: u.credits + creditMap[u.id] } : u
            ),
            planillas: prev.planillas.map((p) =>
              p.id === readyPlanilla.id
                ? { ...p, seq, winner, status: "finished" }
                : p
            ),
          };
          saveDB(next);
          return next;
        });

        processingRef.current.delete(`planilla-${readyPlanilla.id}`);
      }, 2000);
    }
  }, []);
 
  const updateDB = useCallback(
    (fn) => {
      setDb((prev) => {
        const next = fn(prev);
        saveDB(next);
        checkAndRunDraws(next);
        return next;
      });
    },
    [checkAndRunDraws]
  );
 
  return { db, updateDB };
}