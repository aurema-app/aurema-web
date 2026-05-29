"use client";

import { useFunnelContext } from "@/funnel/state/FunnelContext";
import type { FunnelAnswers } from "@/funnel/state/types";

export function useFunnelAnswers<K extends keyof FunnelAnswers>(key?: K) {
  const { answers, setAnswer } = useFunnelContext();
  return {
    answers,
    answer: key !== undefined ? answers[key] : undefined,
    setAnswer,
  };
}
