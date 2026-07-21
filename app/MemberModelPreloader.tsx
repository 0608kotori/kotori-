"use client";

import { useEffect } from "react";

import { loadModelViewer } from "./modelViewerLoader";

type MemberModelPreloaderProps = {
  modelSources: readonly string[];
};

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

const BACKGROUND_DELAY_MS = 700;

function shouldSkipBackgroundPreload() {
  const connection = (navigator as NavigatorWithConnection).connection;
  return (
    connection?.saveData === true ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  );
}

async function preloadModel(source: string, signal: AbortSignal) {
  const response = await fetch(source, {
    cache: "force-cache",
    credentials: "same-origin",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Model preload failed with ${response.status}.`);
  }

  await response.arrayBuffer();
}

export default function MemberModelPreloader({
  modelSources,
}: MemberModelPreloaderProps) {
  useEffect(() => {
    if (shouldSkipBackgroundPreload()) return;

    const controller = new AbortController();
    let started = false;
    let delayId: number | null = null;
    let observer: IntersectionObserver | null = null;

    const start = () => {
      if (started) return;
      started = true;

      void (async () => {
        try {
          await loadModelViewer();
          for (const source of modelSources) {
            await preloadModel(source, controller.signal);
          }
        } catch {
          // The expanded profile keeps its poster and retries the selected
          // model, so a background preload failure is intentionally silent.
        }
      })();
    };

    const schedule = () => {
      delayId = window.setTimeout(start, BACKGROUND_DELAY_MS);
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    const membersSection = document.getElementById("members");
    if (membersSection && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) start();
        },
        { rootMargin: "1200px 0px" },
      );
      observer.observe(membersSection);
    }

    return () => {
      window.removeEventListener("load", schedule);
      if (delayId !== null) window.clearTimeout(delayId);
      observer?.disconnect();
      controller.abort();
    };
  }, [modelSources]);

  return null;
}
