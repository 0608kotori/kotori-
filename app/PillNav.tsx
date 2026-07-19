"use client";

import { gsap } from "gsap";
import type { CSSProperties, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

import styles from "./PillNav.module.css";

export type PillNavItem = {
  href: string;
  label: string;
};

type PillNavStyle = CSSProperties & {
  "--pill-nav-base": string;
  "--pill-nav-hover-text": string;
  "--pill-nav-pill": string;
  "--pill-nav-pill-text": string;
};

type PillNavProps = {
  activeHref: string;
  baseColor?: string;
  className?: string;
  ease?: string;
  hoveredPillTextColor?: string;
  initialLoadAnimation?: boolean;
  items: readonly PillNavItem[];
  logo?: ReactNode;
  logoAlt?: string;
  logoHref?: string;
  onNavigate?: (href: string) => void;
  pillColor?: string;
  pillTextColor?: string;
  theme?: "dark" | "light";
};

function normalizeEase(value: string) {
  const modernEase = value
    .replace(/\.easeInOut$/, ".inOut")
    .replace(/\.easeIn$/, ".in")
    .replace(/\.easeOut$/, ".out");

  return gsap.parseEase(modernEase) ? modernEase : "power2.out";
}

export default function PillNav({
  activeHref,
  baseColor = "#000000",
  className,
  ease = "power2.out",
  hoveredPillTextColor = "#ffffff",
  initialLoadAnimation = false,
  items,
  logo,
  logoAlt = "Home",
  logoHref = "#home",
  onNavigate,
  pillColor = "#ffffff",
  pillTextColor = "#000000",
  theme = "dark",
}: PillNavProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const hasPositioned = useRef(false);
  const safeEase = normalizeEase(ease);
  const style: PillNavStyle = {
    "--pill-nav-base": baseColor,
    "--pill-nav-hover-text": hoveredPillTextColor,
    "--pill-nav-pill": pillColor,
    "--pill-nav-pill-text": pillTextColor,
  };
  const classes = [styles.root, className ?? ""].filter(Boolean).join(" ");

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pill = pillRef.current;
    const activeItem = itemRefs.current.get(activeHref);
    if (!root || !pill) return;

    if (!activeItem) {
      gsap.killTweensOf(pill);
      gsap.set(pill, { opacity: 0, scale: 0.82 });
      hasPositioned.current = false;
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const getPosition = () => ({
      height: activeItem.offsetHeight,
      width: activeItem.offsetWidth,
      x: activeItem.offsetLeft,
      y: activeItem.offsetTop,
    });
    const positionPill = (animate: boolean) => {
      const position = getPosition();
      gsap.killTweensOf(pill);

      if (!animate || reducedMotion.matches) {
        gsap.set(pill, { ...position, opacity: 1, scale: 1 });
        return;
      }

      gsap.to(pill, {
        ...position,
        duration: 0.34,
        ease: safeEase,
        opacity: 1,
        overwrite: true,
        scale: 1,
      });
    };

    const firstPosition = !hasPositioned.current;
    if (firstPosition && initialLoadAnimation && !reducedMotion.matches) {
      gsap.fromTo(
        pill,
        { ...getPosition(), opacity: 0, scale: 0.78 },
        {
          ...getPosition(),
          duration: 0.42,
          ease: safeEase,
          opacity: 1,
          scale: 1,
        },
      );
    } else {
      positionPill(!firstPosition);
    }
    hasPositioned.current = true;

    const handleMotionPreference = () => positionPill(false);
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => positionPill(false));

    reducedMotion.addEventListener("change", handleMotionPreference);
    resizeObserver?.observe(root);

    return () => {
      gsap.killTweensOf(pill);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      resizeObserver?.disconnect();
    };
  }, [activeHref, initialLoadAnimation, safeEase]);

  return (
    <div ref={rootRef} className={classes} data-theme={theme} style={style}>
      {logo ? (
        <a
          className={styles.logo}
          href={logoHref}
          aria-label={logoAlt}
          onClick={() => onNavigate?.(logoHref)}
        >
          {logo}
        </a>
      ) : null}

      <span ref={pillRef} className={styles.activePill} aria-hidden="true" />

      {items.map((item) => {
        const active = item.href === activeHref;

        return (
          <a
            key={item.href}
            ref={(node) => {
              if (node) itemRefs.current.set(item.href, node);
              else itemRefs.current.delete(item.href);
            }}
            className={styles.item}
            href={item.href}
            aria-current={active ? "location" : undefined}
            data-active={active ? "true" : "false"}
            onClick={() => onNavigate?.(item.href)}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}
