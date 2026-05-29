import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "gpt-4o-mini";
const IS_DEV = process.env.NODE_ENV !== "production";

type AnswersContext = {
  decodingTarget?: string;
  demographics?: string;
  timeline?: string;
  peaceBreaker?: string;
  overthinking?: string;
  digitalAnxiety?: string;
  friendGroup?: string;
  projection?: string;
  reinforcement?: string;
};

type AnalyzeBody = {
  evidenceText?: string;
  evidenceImages?: string[]; // base64 data URLs
  evidenceType?: "text" | "screenshot" | "chip";
  answers?: AnswersContext;
};

export type LexiResult = {
  spicy_detail: string;
  detected_pattern: string;
  teaser_copy: string;
  paywall_hook: string;
};

const SYSTEM_PROMPT = `You are Lexi, a sharp situationship analyzer.

Analyze the user's pasted text and/or screenshots. Extract only one highly specific, emotionally sharp detail that can be used as personalization copy in the next funnel screen.

Goal:
Make the user feel: "wait, Lexi actually understands my situation."

Do not give full advice.
Do not be generic.
Do not mention that you are an AI.
Do not diagnose.
Do not moralize.

Return valid JSON only:

{
  "spicy_detail": "one specific observation from their text/screenshots",
  "detected_pattern": "2-5 word label",
  "teaser_copy": "one punchy sentence Lexi would say before the paywall",
  "paywall_hook": "one sentence that makes them want the full read"
}

Tone:
sassy, emotionally intelligent, slightly savage, but not cruel.

Examples of good teaser copy:
- "Lexi spotted it: they want access without giving you clarity."
- "This is not mixed signals. This is consistency only when it benefits them."
- "They are keeping you close enough to hope, but far enough to not ask for more."`;

function fallback(body: AnalyzeBody): LexiResult {
  const { evidenceType, evidenceText, answers } = body;

  if (evidenceType === "chip") {
    const chip = evidenceText?.trim() ?? "";
    return {
      spicy_detail: chip || "I'm not looking for anything serious",
      detected_pattern: "Convenient Ambiguity",
      teaser_copy:
        "Lexi spotted it: they keep the door open just wide enough to keep you wondering.",
      paywall_hook:
        "Your full read reveals exactly why this phrase keeps working on you — and how to stop letting it.",
    };
  }

  if (evidenceType === "screenshot" && !evidenceText?.trim()) {
    return {
      spicy_detail: "visual evidence of selective availability",
      detected_pattern: "Hot & Cold Cycle",
      teaser_copy:
        "The screenshots don't lie. They are warm when they need you and cold when they don't.",
      paywall_hook:
        "Unlock your full pattern breakdown — including the exact moment they stopped choosing you.",
    };
  }

  const snippet = evidenceText?.trim().slice(0, 70) ?? "";

  if (answers?.reinforcement === "yes") {
    return {
      spicy_detail: snippet || "I've just been really busy lately",
      detected_pattern: "Intermittent Reward Loop",
      teaser_copy:
        "One warm text shouldn't undo three days of silence — but it does. Lexi knows why.",
      paywall_hook:
        "Your full read explains the exact brain mechanic they are triggering — and how to break it.",
    };
  }

  if (answers?.projection === "potential") {
    return {
      spicy_detail: snippet || "I'm not ready for anything serious right now",
      detected_pattern: "Potential Projection",
      teaser_copy:
        "You are not in love with them. You are in love with the version of them that only shows up occasionally.",
      paywall_hook:
        "Lexi's full read will show you exactly what they are actually offering vs. what you keep hoping for.",
    };
  }

  return {
    spicy_detail: snippet || "I'm not ready for anything serious right now",
    detected_pattern: "Avoidant Reinforcement Loop",
    teaser_copy:
      "They are keeping you close enough to hope, but far enough to not ask for more.",
    paywall_hook:
      "Your full Delusion Score, Red Flag breakdown, and custom Next-Move strategy are ready.",
  };
}

type OpenAIMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | {
      role: "user";
      content: (
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string; detail: "low" } }
      )[];
    };

export async function POST(request: Request) {
  let body: AnalyzeBody;
  try {
    body = (await request.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!OPENAI_API_KEY) {
    if (IS_DEV) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not set. Add it to .env.local and restart the dev server.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(fallback(body));
  }

  const { evidenceText, evidenceImages, evidenceType, answers } = body;
  const hasText = Boolean(evidenceText?.trim());
  const hasImages = Array.isArray(evidenceImages) && evidenceImages.length > 0;
  const isChip = evidenceType === "chip";

  // Chips get a fast generic response without burning tokens on the LLM.
  if (isChip) {
    return NextResponse.json(fallback(body));
  }

  const contextSummary = answers
    ? `Quiz context: decoding=${answers.decodingTarget ?? "?"}, age=${answers.demographics ?? "?"}, timeline=${answers.timeline ?? "?"}, reinforcement=${answers.reinforcement ?? "?"}, projection=${answers.projection ?? "?"}.`
    : "";

  const userMessage: OpenAIMessage = hasImages
    ? {
        role: "user",
        content: [
          {
            type: "text",
            text: [
              contextSummary,
              hasText
                ? `They also wrote: "${evidenceText!.slice(0, 500)}"`
                : "No additional text was provided — analyze the screenshot(s) only.",
              "What is the single most emotionally sharp detail you can extract from this evidence?",
            ]
              .filter(Boolean)
              .join("\n"),
          },
          ...evidenceImages.slice(0, 3).map((url) => ({
            type: "image_url" as const,
            image_url: { url, detail: "low" as const },
          })),
        ],
      }
    : {
        role: "user",
        content: [
          contextSummary,
          `Evidence: "${evidenceText!.slice(0, 800)}"`,
          "What is the single most emotionally sharp detail you can extract?",
        ]
          .filter(Boolean)
          .join("\n"),
      };

  const messages: OpenAIMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    userMessage,
  ];

  const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 220,
      temperature: 0.75,
      response_format: { type: "json_object" },
    }),
  });

  if (!openAIRes.ok) {
    const errBody = await openAIRes.text();
    if (IS_DEV) {
      return NextResponse.json(
        { error: `OpenAI ${openAIRes.status}: ${errBody}` },
        { status: 502 },
      );
    }
    return NextResponse.json(fallback(body));
  }

  type OpenAIResponse = {
    choices: { message: { content: string | null } }[];
  };

  let raw = "";
  try {
    const data = (await openAIRes.json()) as OpenAIResponse;
    raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(raw) as Partial<LexiResult>;

    if (
      !parsed.spicy_detail ||
      !parsed.detected_pattern ||
      !parsed.teaser_copy ||
      !parsed.paywall_hook
    ) {
      if (IS_DEV) {
        return NextResponse.json(
          {
            error: `OpenAI returned incomplete JSON. Raw: ${raw.slice(0, 300)}`,
          },
          { status: 502 },
        );
      }
      return NextResponse.json(fallback(body));
    }

    return NextResponse.json(parsed as LexiResult);
  } catch (parseErr) {
    if (IS_DEV) {
      return NextResponse.json(
        {
          error: `JSON parse failed: ${parseErr instanceof Error ? parseErr.message : String(parseErr)}. Raw: ${raw.slice(0, 300)}`,
        },
        { status: 502 },
      );
    }
    return NextResponse.json(fallback(body));
  }
}
