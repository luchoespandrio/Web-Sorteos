import { useState, useCallback } from "react";
import { DB_KEY, USERS_INIT, RIFAS_INIT, CORTITOS_INIT } from "../utils/constants";

export function useDB() {
  // Cargar la DB desde localStorage o crear una nueva si no existe
  const [db, setDb] = useState(() => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Error al cargar la DB:", e);
    }
    // Si no hay nada en localStorage, crear datos iniciales
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

  // Función para actualizar la DB y guardar automáticamente
  const updateDB = useCallback((fn) => {
    setDb((prev) => {
      const next = fn(prev);
      saveDB(next);
      return next;
    });
  }, []);

  return { db, updateDB };
}