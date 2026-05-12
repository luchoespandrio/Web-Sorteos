import { useState, useCallback, useRef } from "react";
import { DB_KEY, USERS_INIT, RIFAS_INIT, CORTITOS_INIT } from "../utils/constants";
 
// ─── Lógica del sorteo (igual que en CortitosView) ────────────────────────────
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
 
export function useDB() {
  // Cargar la DB desde localStorage o crear una nueva si no existe
  const [db, setDb] = useState(() => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Error al cargar la DB:", e);
    }
    const initial = {
      users: USERS_INIT,
      rifas: RIFAS_INIT,
      creditRequests: [],
      cortitos: CORTITOS_INIT,
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  });
 
  // Guardar la DB en localStorage
  const saveDB = (newDb) => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(newDb));
    } catch (e) {
      console.error("Error al guardar la DB:", e);
    }
  };
 
  // ── Ref para rastrear cortitos que ya están siendo sorteados ───────────────
  // Vive dentro del hook, así NO se pierde cuando los componentes se re-renderizan.
  const processingRef = useRef(new Set());
 
  // ── Función que revisa si hay cortitos listos para sortear ────────────────
  // Se llama automáticamente después de cada updateDB.
  const checkAndRunDraws = useCallback((currentDb) => {
    const readyCortito = currentDb.cortitos?.find(
      (c) =>
        c.players.length === c.totalSlots &&
        c.status === "open" &&
        !processingRef.current.has(c.id)
    );
 
    if (!readyCortito) return;
 
    // Marcar como en proceso ANTES de cualquier setState para evitar duplicados
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
 
  // ── updateDB: actualiza la DB y luego revisa si hay sorteos pendientes ────
  const updateDB = useCallback(
    (fn) => {
      setDb((prev) => {
        const next = fn(prev);
        saveDB(next);
        // Revisar sorteos después de guardar, con el estado actualizado
        checkAndRunDraws(next);
        return next;
      });
    },
    [checkAndRunDraws]
  );
 
  return { db, updateDB };
}