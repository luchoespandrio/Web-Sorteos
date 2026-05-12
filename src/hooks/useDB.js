import { useState, useCallback, useRef } from "react";
import { DB_KEY, USERS_INIT, RIFAS_INIT, CORTITOS_INIT } from "../utils/constants";
 
// ─── Lógica del sorteo ────────────────────────────────────────────────────────
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
    const readyCortito = currentDb.cortitos?.find(
      (c) =>
        c.players.length === c.totalSlots &&
        c.status === "open" &&
        !processingRef.current.has(c.id)
    );
 
    if (!readyCortito) return;
 
    processingRef.current.add(readyCortito.id);
 
    // Paso 1: marcar como "running"
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
 
    // Paso 2: sortear después de 1.5s
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
 
      processingRef.current.delete(readyCortito.id);
    }, 1500);
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