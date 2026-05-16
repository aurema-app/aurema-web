import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type AnalyzeBody = {
  evidenceText?: string;
  answers?: {
    peaceBreaker?: string;
    overthinking?: string;
    digitalAnxiety?: string;
    friendGroup?: string;
    projection?: string;
    reinforcement?: string;
  };
};

type LexiResult = {
  phrase: string;
  pattern: string;
};

// Deterministic fallbacks keyed on answer combos so users without OpenAI still
// get a personalised-feeling result.
function fallback(body: AnalyzeBody): LexiResult {
  const text = body.evidenceText?.trim() ?? "";

  if (text.length > 0) {
    const snippet =
      text
        .split(/[.!?\n]/)[0]
        ?.trim()
        .slice(0, 70) ?? text.slice(0, 70);
    return {
      phrase: snippet,
      pattern:
        "Lexi detected a classic avoidant reinforcement pattern — offering just enough warmth to maintain control without committing.",
    };
  }

  if (body.answers?.reinforcement === "yes") {
    return {
      phrase: "I've just been really busy lately",
      pattern:
        "Intermittent reinforcement loop detected. One affectionate text is functioning as a reward reset, keeping you locked in the cycle.",
    };
  }

  return {
    phrase: "I'm not ready for anything serious right now",
    pattern:
      "Classic commitment-phobe framing — keeps you emotionally available while allowing them to withdraw accountability.",
  };
}

export async function POST(request: Request) {
  let body: AnalyzeBody;
  try {
    body = (await request.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // If no OpenAI key configured, return a deterministic fallback immediately.
  if (!OPENAI_API_KEY) {
    return NextResponse.json(fallback(body));
  }

  const userContent = [
    body.evidenceText?.trim()
      ? `Evidence submitted: "${body.evidenceText.slice(0, 500)}"`
      : "No text evidence provided.",
    `Quiz answers: ${JSON.stringify(body.answers ?? {})}`,
  ].join("\n");

  const systemPrompt = `You are Lexi — a brutally honest, Gen Z relationship advisor who clocks red flags fast.

Given user evidence and quiz answers, extract:
1. phrase: A short, specific phrase (5-15 words max) from their evidence — the most manipulative or evasive sentence. If no text was provided, invent a realistic example based on their answers.
2. pattern: One punchy sentence (max 25 words) naming the behavioral loop you detected.

Respond ONLY with valid JSON: { "phrase": "...", "pattern": "..." }
No markdown, no explanation. Just JSON.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        max_tokens: 120,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(fallback(body));
    }

    type OpenAIResponse = {
      choices: { message: { content: string | null } }[];
    };

    const data = (await res.json()) as OpenAIResponse;
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";

    const parsed = JSON.parse(raw) as LexiResult;

    if (!parsed.phrase || !parsed.pattern) {
      return NextResponse.json(fallback(body));
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(fallback(body));
  }
}
