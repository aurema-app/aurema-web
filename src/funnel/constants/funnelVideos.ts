export const FUNNEL_VIDEOS = {
  ANALYSIS: "/lexi/lexi-analysis.mp4",
  JUDGE: "/lexi/lexi-judge.mp4",
} as const;

export const FUNNEL_VIDEO_SRCS = [
  FUNNEL_VIDEOS.ANALYSIS,
  FUNNEL_VIDEOS.JUDGE,
] as const;
