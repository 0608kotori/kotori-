"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

import styles from "./MagicBento.module.css";

const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MAX_PARTICLE_COUNT = 24;

export type MagicBentoItem = {
  accent: string;
  copy: string;
  copyZh: string;
  index: string;
  title: string;
  titleZh: string;
};

type MagicBentoProps = {
  clickEffect?: boolean;
  disableAnimations?: boolean;
  enableBorderGlow?: boolean;
  enableMagnetism?: boolean;
  enableSpotlight?: boolean;
  enableStars?: boolean;
  enableTilt?: boolean;
  glowColor?: string;
  items: readonly MagicBentoItem[];
  particleCount?: number;
  spotlightRadius?: number;
  textAutoHide?: boolean;
};

type BentoStyle = CSSProperties & {
  "--accent-rgb": string;
};

type GridStyle = CSSProperties & {
  "--glow-rgb": string;
  "--spotlight-radius": string;
};

type ParticleStyle = CSSProperties & {
  "--particle-delay": string;
  "--particle-drift-x": string;
  "--particle-drift-y": string;
  "--particle-size": string;
  "--particle-x": string;
  "--particle-y": string;
};

function normalizeRgb(value: string) {
  const channels = value.split(",").map((channel) => Number(channel.trim()));

  if (
    channels.length !== 3 ||
    channels.some((channel) => !Number.isFinite(channel))
  ) {
    return DEFAULT_GLOW_COLOR;
  }

  return channels
    .map((channel) => Math.min(255, Math.max(0, Math.round(channel))))
    .join(", ");
}

function createParticleStyle(cardIndex: number, particleIndex: number) {
  const seed = cardIndex * 41 + particleIndex * 67;
  const style: ParticleStyle = {
    "--particle-delay": `${-((seed % 17) * 0.19).toFixed(2)}s`,
    "--particle-drift-x": `${(seed % 19) - 9}px`,
    "--particle-drift-y": `${-8 - (seed % 13)}px`,
    "--particle-size": `${1 + (seed % 3) * 0.7}px`,
    "--particle-x": `${8 + ((seed * 37) % 84)}%`,
    "--particle-y": `${8 + ((seed * 53) % 84)}%`,
  };

  return style;
}

export default function MagicBento({
  clickEffect = true,
  disableAnimations = false,
  enableBorderGlow = true,
  enableMagnetism = false,
  enableSpotlight = true,
  enableStars = true,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  items,
  particleCount = 12,
  spotlightRadius = 360,
  textAutoHide = true,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const safeGlowColor = normalizeRgb(glowColor);
  const safeParticleCount = Math.min(
    MAX_PARTICLE_COUNT,
    Math.max(0, Math.floor(particleCount)),
  );
  const safeSpotlightRadius = Math.min(
    640,
    Math.max(160, Math.round(spotlightRadius)),
  );
  const gridStyle: GridStyle = {
    "--glow-rgb": safeGlowColor,
    "--spotlight-radius": `${safeSpotlightRadius}px`,
  };

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-magic-bento-card]"),
    );
    let frame = 0;
    let sectionVisible = typeof IntersectionObserver === "undefined";

    const animationsAreDisabled = () =>
      disableAnimations || reducedMotion.matches || coarsePointer.matches;

    const interactionsAreDisabled = () =>
      animationsAreDisabled() ||
      !sectionVisible ||
      document.visibilityState !== "visible";

    const resetCard = (card: HTMLElement) => {
      card.dataset.hovered = "false";
      card.style.setProperty("--card-x", "50%");
      card.style.setProperty("--card-y", "50%");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--magnet-x", "0px");
      card.style.setProperty("--magnet-y", "0px");
    };

    const resetInteraction = () => {
      grid.dataset.spotlightActive = "false";
      cards.forEach(resetCard);
    };

    const syncMotionPreference = () => {
      const disabled = animationsAreDisabled();
      grid.dataset.motion = disabled ? "disabled" : "enabled";
      if (disabled) resetInteraction();
    };

    const syncActivity = () => {
      const active = sectionVisible && document.visibilityState === "visible";
      grid.dataset.active = active ? "true" : "false";
      if (!active) resetInteraction();
    };

    const updatePointer = (event: PointerEvent) => {
      if (interactionsAreDisabled()) return;
      if (frame) window.cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const gridRect = grid.getBoundingClientRect();
        grid.style.setProperty(
          "--spotlight-x",
          `${event.clientX - gridRect.left}px`,
        );
        grid.style.setProperty(
          "--spotlight-y",
          `${event.clientY - gridRect.top}px`,
        );
        grid.dataset.spotlightActive = enableSpotlight ? "true" : "false";

        const target = event.target;
        const card =
          target instanceof Element
            ? (target.closest("[data-magic-bento-card]") as HTMLElement | null)
            : null;

        cards.forEach((candidate) => {
          if (candidate !== card) resetCard(candidate);
        });

        if (!card || !grid.contains(card)) return;

        const cardRect = card.getBoundingClientRect();
        const localX = event.clientX - cardRect.left;
        const localY = event.clientY - cardRect.top;
        const horizontalRatio = localX / cardRect.width - 0.5;
        const verticalRatio = localY / cardRect.height - 0.5;

        card.dataset.hovered = "true";
        card.style.setProperty("--card-x", `${localX}px`);
        card.style.setProperty("--card-y", `${localY}px`);
        card.style.setProperty(
          "--tilt-x",
          enableTilt ? `${(-verticalRatio * 4).toFixed(2)}deg` : "0deg",
        );
        card.style.setProperty(
          "--tilt-y",
          enableTilt ? `${(horizontalRatio * 4).toFixed(2)}deg` : "0deg",
        );
        card.style.setProperty(
          "--magnet-x",
          enableMagnetism ? `${(horizontalRatio * 8).toFixed(2)}px` : "0px",
        );
        card.style.setProperty(
          "--magnet-y",
          enableMagnetism ? `${(verticalRatio * 8).toFixed(2)}px` : "0px",
        );
      });
    };

    const createRipple = (event: MouseEvent) => {
      if (!clickEffect || interactionsAreDisabled()) return;

      const target = event.target;
      const card =
        target instanceof Element
          ? (target.closest("[data-magic-bento-card]") as HTMLElement | null)
          : null;
      if (!card || !grid.contains(card)) return;

      const cardRect = card.getBoundingClientRect();
      const ripple = document.createElement("span");
      const diameter = Math.hypot(cardRect.width, cardRect.height) * 1.8;

      ripple.className = styles.ripple;
      ripple.dataset.magicBentoRipple = "true";
      ripple.setAttribute("aria-hidden", "true");
      ripple.style.setProperty("--ripple-size", `${diameter}px`);
      ripple.style.left = `${event.clientX - cardRect.left}px`;
      ripple.style.top = `${event.clientY - cardRect.top}px`;
      ripple.addEventListener("animationend", () => ripple.remove(), {
        once: true,
      });
      card.appendChild(ripple);
    };

    const handlePointerLeave = () => resetInteraction();
    const intersectionObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              sectionVisible = entry?.isIntersecting ?? false;
              syncActivity();
            },
            { threshold: 0.01 },
          );

    reducedMotion.addEventListener("change", syncMotionPreference);
    coarsePointer.addEventListener("change", syncMotionPreference);
    document.addEventListener("visibilitychange", syncActivity);
    grid.addEventListener("pointermove", updatePointer, { passive: true });
    grid.addEventListener("pointerleave", handlePointerLeave);
    grid.addEventListener("click", createRipple);
    intersectionObserver?.observe(grid);
    syncMotionPreference();
    syncActivity();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", syncMotionPreference);
      coarsePointer.removeEventListener("change", syncMotionPreference);
      document.removeEventListener("visibilitychange", syncActivity);
      grid.removeEventListener("pointermove", updatePointer);
      grid.removeEventListener("pointerleave", handlePointerLeave);
      grid.removeEventListener("click", createRipple);
      intersectionObserver?.disconnect();
      grid
        .querySelectorAll<HTMLElement>("[data-magic-bento-ripple]")
        .forEach((ripple) => ripple.remove());
    };
  }, [
    clickEffect,
    disableAnimations,
    enableMagnetism,
    enableSpotlight,
    enableTilt,
  ]);

  return (
    <div
      ref={gridRef}
      className={`${styles.grid} magic-bento-grid`}
      style={gridStyle}
      data-border-glow={enableBorderGlow ? "true" : "false"}
      data-active="true"
      data-motion={disableAnimations ? "disabled" : "enabled"}
      data-spotlight-active="false"
      data-text-auto-hide={textAutoHide ? "true" : "false"}
      role="list"
      aria-label="未来探索方向"
    >
      <span className={styles.spotlight} aria-hidden="true" />

      {items.map((item, cardIndex) => {
        const cardStyle: BentoStyle = {
          "--accent-rgb": normalizeRgb(item.accent),
        };

        return (
          <article
            key={item.index}
            className={`${styles.card} magic-bento-card`}
            style={cardStyle}
            data-hovered="false"
            data-magic-bento-card
            role="listitem"
          >
            <span className={styles.ambient} aria-hidden="true" />

            {enableStars ? (
              <span className={styles.particles} aria-hidden="true">
                {Array.from({ length: safeParticleCount }, (_, particleIndex) => (
                  <span
                    key={particleIndex}
                    className={styles.particle}
                    style={createParticleStyle(cardIndex, particleIndex)}
                  />
                ))}
              </span>
            ) : null}

            <div className={styles.topline}>
              <span>坐标 {item.index} · COORDINATE</span>
              <span className={styles.status}>
                <i aria-hidden="true" />
                持续探索
              </span>
            </div>

            <div className={styles.titleGroup}>
              <h3>{item.titleZh}</h3>
              <p lang="en">{item.title}</p>
            </div>

            <div className={styles.question}>
              <span className={styles.questionLabel}>探索问题 · QUESTION</span>
              <p>{item.copyZh}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
