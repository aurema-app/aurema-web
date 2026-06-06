"use client";

import { useEffect } from "react";

import { FUNNEL_VIDEO_SRCS } from "@/funnel/constants/funnelVideos";

let didPreload = false;
const preloadedVideos: HTMLVideoElement[] = [];

function preloadFunnelVideos() {
  if (didPreload || typeof document === "undefined") return;
  didPreload = true;

  for (const src of FUNNEL_VIDEO_SRCS) {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = src;
    video.load();
    preloadedVideos.push(video);
  }
}

export function FunnelVideoPreload() {
  useEffect(() => {
    preloadFunnelVideos();
  }, []);

  return null;
}
