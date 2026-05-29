"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { FunnelAnswers } from "@/funnel/state/types";
import { ANSWERS_STORAGE_KEY } from "@/funnel/state/types";

type FunnelContextValue = {
  answers: FunnelAnswers;
  setAnswer: <K extends keyof FunnelAnswers>(
    key: K,
    value: FunnelAnswers[K],
  ) => void;
  resetAnswers: () => void;
};

const FunnelContext = createContext<FunnelContextValue | null>(null);

function readFromStorage(): FunnelAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ANSWERS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as FunnelAnswers;
  } catch {
    return {};
  }
}

// evidenceImages are base64 data URLs — too large for localStorage (5 MB limit).
// They're only needed in-memory for the EvidenceStep → AnalyzingStep hop.
const MEMORY_ONLY_KEYS: (keyof FunnelAnswers)[] = ["evidenceImages"];

function writeToStorage(answers: FunnelAnswers): void {
  if (typeof window === "undefined") return;
  const toStore = { ...answers };
  for (const key of MEMORY_ONLY_KEYS) delete toStore[key];
  try {
    localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // Quota errors on other browsers / private mode — non-fatal.
  }
}

export function FunnelProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<FunnelAnswers>({});

  useEffect(() => {
    setAnswers(readFromStorage());
  }, []);

  const setAnswer = useCallback(
    <K extends keyof FunnelAnswers>(key: K, value: FunnelAnswers[K]) => {
      setAnswers((prev) => {
        const next = { ...prev, [key]: value };
        writeToStorage(next);
        return next;
      });
    },
    [],
  );

  const resetAnswers = useCallback(() => {
    setAnswers({});
    writeToStorage({});
  }, []);

  return (
    <FunnelContext.Provider value={{ answers, setAnswer, resetAnswers }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnelContext(): FunnelContextValue {
  const ctx = useContext(FunnelContext);
  if (!ctx) {
    throw new Error("useFunnelContext must be used inside <FunnelProvider>");
  }
  return ctx;
}
