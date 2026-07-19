import {
  Children,
  type CSSProperties,
  type ReactNode,
} from "react";

import styles from "./ScrollStack.module.css";

type ScrollStackItemProps = {
  children: ReactNode;
  itemClassName?: string;
};

type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: number | string;
  baseScale?: number;
  rotationAmount?: number;
};

type StackStyle = CSSProperties & {
  "--stack-item-distance": string;
};

type StackItemStyle = CSSProperties & {
  "--stack-top": string;
  "--stack-scale": string;
  "--stack-rotation": string;
};

// Concept adapted from Dominik Koch's ScrollStack. This local version uses
// native sticky positioning so the site keeps normal scrolling and needs no
// global smooth-scroll runtime.
export function ScrollStackItem({
  children,
  itemClassName = "",
}: ScrollStackItemProps) {
  return (
    <article
      className={`${styles.card} scroll-stack-card ${itemClassName}`.trim()}
    >
      {children}
    </article>
  );
}

export default function ScrollStack({
  children,
  className = "",
  itemDistance = 88,
  itemScale = 0.03,
  itemStackDistance = 24,
  stackPosition = 112,
  baseScale = 0.92,
  rotationAmount = 0,
}: ScrollStackProps) {
  const items = Children.toArray(children);
  const position =
    typeof stackPosition === "number" ? `${stackPosition}px` : stackPosition;
  const stackStyle: StackStyle = {
    "--stack-item-distance": `${itemDistance}px`,
  };

  return (
    <div
      className={`${styles.scroller} scroll-stack-scroller ${className}`.trim()}
      style={stackStyle}
    >
      <ol className={`${styles.inner} scroll-stack-inner`}>
        {items.map((child, index) => {
          const scale = Math.min(1, baseScale + index * itemScale);
          const itemStyle: StackItemStyle = {
            "--stack-top": `calc(${position} + ${index * itemStackDistance}px)`,
            "--stack-scale": scale.toFixed(3),
            "--stack-rotation": `${index * rotationAmount}deg`,
            zIndex: index + 1,
          };

          return (
            <li key={index} className={styles.item} style={itemStyle}>
              {child}
            </li>
          );
        })}
      </ol>
      <div className={styles.end} aria-hidden="true" />
    </div>
  );
}
