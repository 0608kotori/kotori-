import type { CSSProperties, ReactNode } from "react";

import styles from "./GradientText.module.css";

const fallbackColors = ["#353049", "#5560dd", "#e38db3"] as const;

type GradientTextStyle = CSSProperties & {
  "--gradient-text-colors": string;
  "--gradient-text-speed": string;
};

type GradientTextProps = {
  animationSpeed?: number;
  children: ReactNode;
  className?: string;
  colors?: readonly string[];
  showBorder?: boolean;
};

export default function GradientText({
  animationSpeed = 8,
  children,
  className,
  colors = fallbackColors,
  showBorder = false,
}: GradientTextProps) {
  const palette = colors.length >= 2 ? colors : fallbackColors;
  const firstColor = palette[0];
  const seamlessPalette =
    firstColor === palette[palette.length - 1]
      ? palette
      : [...palette, firstColor];
  const safeSpeed =
    Number.isFinite(animationSpeed) && animationSpeed > 0 ? animationSpeed : 8;
  const style: GradientTextStyle = {
    "--gradient-text-colors": `linear-gradient(90deg, ${seamlessPalette.join(", ")})`,
    "--gradient-text-speed": `${safeSpeed}s`,
  };
  const classes = [
    styles.root,
    showBorder ? styles.withBorder : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} style={style}>
      <span className={styles.text}>{children}</span>
    </span>
  );
}
