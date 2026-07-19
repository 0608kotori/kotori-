"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  PropsWithChildren,
} from "react";
import { useEffect, useRef } from "react";

import styles from "./SpotlightCard.module.css";

type SpotlightStyle = CSSProperties & {
  "--spotlight-color"?: string;
};

type SpotlightCardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    spotlightColor?: string;
  }
>;

/**
 * A restrained, local adaptation of React Bits SpotlightCard.
 * Pointer work stays scoped to the card and the content remains complete when
 * the decorative highlight is unavailable.
 */
export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(85, 96, 221, 0.11)",
  style,
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  ...rest
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ clientX: 0, clientY: 0 });

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (event.pointerType === "touch" || !cardRef.current) return;

    pointerRef.current = { clientX: event.clientX, clientY: event.clientY };
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      const card = cardRef.current;
      frameRef.current = null;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty(
        "--mouse-x",
        `${pointerRef.current.clientX - rect.left}px`,
      );
      card.style.setProperty(
        "--mouse-y",
        `${pointerRef.current.clientY - rect.top}px`,
      );
    });
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    resetSpotlight();
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(event);
    resetSpotlight();
  };

  function resetSpotlight() {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    cardRef.current?.style.removeProperty("--mouse-x");
    cardRef.current?.style.removeProperty("--mouse-y");
  };

  const cardStyle: SpotlightStyle = {
    ...style,
    "--spotlight-color": spotlightColor,
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${className}`.trim()}
      style={cardStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      {...rest}
    >
      {children}
    </div>
  );
}
