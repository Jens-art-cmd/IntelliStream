"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "df_read_articles";
const MAX_STORED  = 500; // Älteste rauswerfen wenn Limit erreicht

function loadFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveToStorage(ids: Set<string>) {
  try {
    const arr = Array.from(ids).slice(-MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // localStorage voll oder nicht verfügbar
  }
}

export function useReadArticles() {
  const [readIds, setReadIds] = useState<Set<string>>(() => loadFromStorage());

  // Sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setReadIds(loadFromStorage());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setReadIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setReadIds(new Set());
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return { readIds, markAsRead, clearAll };
}
