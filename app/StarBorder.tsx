import type { CSSProperties, ReactNode } from "react";

import styles from "./StarBorder.module.css";

const DEFAULT_COLOR = "#9b8cff";
const DEFAULT_SPEED = "5s";
const SPEED_PATTERN = /^\d*\.?\d+(?:ms|s)$/;

type StarBorderStyle = CSSProperties & {
  "--star-border-color": string;
  "--star-border-speed": string;
};

type StarBorderProps = {
  as?: "a" | "button";
  children: ReactNode;
  className?: string;
  color?: string;
  href?: string;
  rel?: string;
  speed?: string;
  target?: "_blank" | "_parent" | "_self" | "_top";
  type?: "button" | "reset" | "submit";
};

export default function StarBorder({
  as = "button",
  children,
  className,
  color = DEFAULT_COLOR,
  href,
  rel,
  speed = DEFAULT_SPEED,
  target,
  type = "button",
}: StarBorderProps) {
  const safeColor = color.trim() || DEFAULT_COLOR;
  const safeSpeed = SPEED_PATTERN.test(speed.trim())
    ? speed.trim()
    : DEFAULT_SPEED;
  const style: StarBorderStyle = {
    "--star-border-color": safeColor,
    "--star-border-speed": safeSpeed,
  };
  const classes = [styles.root, className ?? ""].filter(Boolean).join(" ");
  const content = <span className={styles.content}>{children}</span>;

  if (as === "a") {
    return (
      <a
        className={classes}
        href={href}
        rel={rel}
        style={style}
        target={target}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classes} style={style} type={type}>
      {content}
    </button>
  );
}
