"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";

import styles from "./SpecularButton.module.css";

type SpecularSize = "sm" | "md" | "lg";

type SpecularStyle = CSSProperties & {
  "--specular-auto-speed": string;
  "--specular-base": string;
  "--specular-blur": string;
  "--specular-highlight": string;
  "--specular-line": string;
  "--specular-radius": string;
  "--specular-shine-end": string;
  "--specular-shine-size": string;
  "--specular-speed": string;
  "--specular-text": string;
  "--specular-thickness": string;
  "--specular-tint": string;
  "--specular-tint-opacity": string;
};

type SpecularButtonProps = {
  as?: "a" | "button";
  autoAnimate?: boolean;
  baseColor?: string;
  blur?: number;
  children: ReactNode;
  className?: string;
  followMouse?: boolean;
  href?: string;
  intensity?: number;
  lineColor?: string;
  onClick?: () => void;
  proximity?: number;
  radius?: number;
  rel?: string;
  shineFade?: number;
  shineSize?: number;
  size?: SpecularSize;
  speed?: number;
  target?: "_blank" | "_parent" | "_self" | "_top";
  textColor?: string;
  thickness?: number;
  tint?: string;
  tintOpacity?: number;
  type?: "button" | "reset" | "submit";
};

function clamp(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, value));
}

function safeColor(value: string, fallback: string) {
  return value.trim() || fallback;
}

export default function SpecularButton({
  as = "button",
  autoAnimate = false,
  baseColor = "#525252",
  blur = 0,
  children,
  className,
  followMouse = false,
  href,
  intensity = 1,
  lineColor = "#ffffff",
  onClick,
  proximity = 250,
  radius = 18,
  rel,
  shineFade = 40,
  shineSize = 10,
  size = "md",
  speed = 0.35,
  target,
  textColor = "#f5f5f5",
  thickness = 1,
  tint = "#ffffff",
  tintOpacity = 0,
  type = "button",
}: SpecularButtonProps) {
  const rootRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const safeProximity = clamp(proximity, 0, 800);
  const safeShineSize = clamp(shineSize, 1, 120);
  const safeShineFade = clamp(shineFade, 1, 180);
  const safeSpeed = clamp(speed, 0.05, 4);
  const safeIntensity = clamp(intensity, 0, 3);
  const style: SpecularStyle = {
    "--specular-auto-speed": `${safeSpeed * 12}s`,
    "--specular-base": safeColor(baseColor, "#525252"),
    "--specular-blur": `${clamp(blur, 0, 64)}px`,
    "--specular-highlight": `${clamp(42 + safeIntensity * 18, 0, 100)}%`,
    "--specular-line": safeColor(lineColor, "#ffffff"),
    "--specular-radius": `${clamp(radius, 0, 999)}px`,
    "--specular-shine-end": `${safeShineSize + safeShineFade}px`,
    "--specular-shine-size": `${safeShineSize}px`,
    "--specular-speed": `${safeSpeed}s`,
    "--specular-text": safeColor(textColor, "#f5f5f5"),
    "--specular-thickness": `${clamp(thickness, 0.5, 6)}px`,
    "--specular-tint": safeColor(tint, "#ffffff"),
    "--specular-tint-opacity": `${clamp(tintOpacity, 0, 1) * 100}%`,
  };
  const classes = [styles.root, className ?? ""].filter(Boolean).join(" ");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !followMouse) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let frame = 0;
    let listening = false;
    let nearViewport = typeof IntersectionObserver === "undefined";
    let pointerX = 0;
    let pointerY = 0;

    const reset = () => {
      root.dataset.active = "false";
      root.style.setProperty("--specular-strength", "0");
    };

    const renderPointer = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const nearestX = Math.min(rect.right, Math.max(rect.left, pointerX));
      const nearestY = Math.min(rect.bottom, Math.max(rect.top, pointerY));
      const distance = Math.hypot(pointerX - nearestX, pointerY - nearestY);
      const inside =
        pointerX >= rect.left &&
        pointerX <= rect.right &&
        pointerY >= rect.top &&
        pointerY <= rect.bottom;
      const active = safeProximity === 0 ? inside : distance <= safeProximity;

      if (!active) {
        reset();
        return;
      }

      const strength =
        safeProximity === 0 ? 1 : Math.max(0, 1 - distance / safeProximity);
      root.dataset.active = "true";
      root.style.setProperty("--specular-x", `${pointerX - rect.left}px`);
      root.style.setProperty("--specular-y", `${pointerY - rect.top}px`);
      root.style.setProperty("--specular-strength", strength.toFixed(3));
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(renderPointer);
    };

    const removePointerListener = () => {
      if (!listening) return;
      window.removeEventListener("pointermove", handlePointerMove);
      listening = false;
      reset();
    };

    const syncInteraction = () => {
      const motionDisabled = reducedMotion.matches || coarsePointer.matches;
      const shouldListen =
        nearViewport &&
        document.visibilityState === "visible" &&
        !motionDisabled;

      root.dataset.motion = motionDisabled ? "disabled" : "enabled";
      if (shouldListen && !listening) {
        window.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        listening = true;
      } else if (!shouldListen) {
        removePointerListener();
      }
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              nearViewport = entry?.isIntersecting ?? false;
              syncInteraction();
            },
            { rootMargin: `${safeProximity}px` },
          );

    reducedMotion.addEventListener("change", syncInteraction);
    coarsePointer.addEventListener("change", syncInteraction);
    document.addEventListener("visibilitychange", syncInteraction);
    observer?.observe(root);
    syncInteraction();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      removePointerListener();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", syncInteraction);
      coarsePointer.removeEventListener("change", syncInteraction);
      document.removeEventListener("visibilitychange", syncInteraction);
    };
  }, [followMouse, safeProximity]);

  const content = (
    <>
      <span className={styles.surface} aria-hidden="true" />
      <span className={styles.shine} aria-hidden="true" />
      <span className={styles.content}>{children}</span>
    </>
  );
  const commonProps = {
    className: classes,
    "data-active": "false",
    "data-auto-animate": autoAnimate ? "true" : "false",
    "data-follow-mouse": followMouse ? "true" : "false",
    "data-motion": "enabled",
    "data-size": size,
    onClick,
    style,
  } as const;

  if (as === "a") {
    return (
      <a
        ref={(node) => {
          rootRef.current = node;
        }}
        {...commonProps}
        href={href}
        rel={rel}
        target={target}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        rootRef.current = node;
      }}
      {...commonProps}
      type={type}
    >
      {content}
    </button>
  );
}
