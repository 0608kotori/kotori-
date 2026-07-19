"use client";

import Image from "next/image";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./OrbitImages.module.css";

export type OrbitImageItem = {
  src: string;
  alt: string;
  label?: string;
  width: number;
  height: number;
};

type OrbitImagesProps = {
  images: readonly OrbitImageItem[];
  shape?: "circle" | "ellipse";
  radiusX?: number;
  radiusY?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  responsive?: boolean;
  radius?: number;
  direction?: "normal" | "reverse";
  fill?: boolean;
  showPath?: boolean;
  paused?: boolean;
  ariaLabel?: string;
  centerLabel?: string;
  centerMeta?: string;
};

type OrbitStyle = CSSProperties & {
  "--orbit-radius-x": string;
  "--orbit-radius-y": string;
  "--orbit-rotation": string;
  "--orbit-duration": string;
  "--orbit-item-size": string;
  "--orbit-stage-height": string;
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

export default function OrbitImages({
  images,
  shape = "ellipse",
  radiusX = 340,
  radiusY = 80,
  rotation = -8,
  duration = 30,
  itemSize = 120,
  responsive = true,
  radius = 160,
  direction = "normal",
  fill = false,
  showPath = false,
  paused = false,
  ariaLabel = "Project image orbit",
  centerLabel = "PAPERFIT",
  centerMeta = "PROTOTYPE TRACE · 01—04",
}: OrbitImagesProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const baseRadiusX = shape === "circle" ? radius : radiusX;
  const baseRadiusY = shape === "circle" ? radius : radiusY;
  const [geometry, setGeometry] = useState({
    radiusX: baseRadiusX,
    radiusY: baseRadiusY,
  });
  const [active, setActive] = useState(!paused);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || !responsive || typeof ResizeObserver === "undefined") {
      setGeometry({ radiusX: baseRadiusX, radiusY: baseRadiusY });
      return;
    }

    const updateGeometry = (width: number) => {
      const cardWidth = itemSize * 1.62;
      const availableRadius = Math.max(72, (width - cardWidth - 36) / 2);
      const scale = Math.min(1, availableRadius / baseRadiusX);

      setGeometry({
        radiusX: Math.round(baseRadiusX * scale),
        radiusY: Math.round(baseRadiusY * scale),
      });
    };

    const observer = new ResizeObserver(([entry]) => {
      if (entry) updateGeometry(entry.contentRect.width);
    });

    updateGeometry(root.getBoundingClientRect().width);
    observer.observe(root);

    return () => observer.disconnect();
  }, [baseRadiusX, baseRadiusY, itemSize, responsive]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;
    let inView = true;

    const updateActiveState = () => {
      setActive(
        !paused &&
          !reducedMotion.matches &&
          !saveData &&
          inView &&
          document.visibilityState === "visible",
      );
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              inView = entry?.isIntersecting ?? false;
              updateActiveState();
            },
            { rootMargin: "120px 0px", threshold: 0.05 },
          );

    observer?.observe(root);
    reducedMotion.addEventListener("change", updateActiveState);
    document.addEventListener("visibilitychange", updateActiveState);
    updateActiveState();

    return () => {
      observer?.disconnect();
      reducedMotion.removeEventListener("change", updateActiveState);
      document.removeEventListener("visibilitychange", updateActiveState);
    };
  }, [paused]);

  const orbitStyle = useMemo<OrbitStyle>(() => {
    const stageHeight = Math.max(
      itemSize * 1.8,
      geometry.radiusY * 2 + itemSize + 36,
    );

    return {
      "--orbit-radius-x": `${geometry.radiusX}px`,
      "--orbit-radius-y": `${geometry.radiusY}px`,
      "--orbit-rotation": `${rotation}deg`,
      "--orbit-duration": `${Math.max(duration, 1)}s`,
      "--orbit-item-size": `${itemSize}px`,
      "--orbit-stage-height": `${stageHeight}px`,
    };
  }, [duration, geometry.radiusX, geometry.radiusY, itemSize, rotation]);

  return (
    <section
      ref={rootRef}
      className={styles.root}
      style={orbitStyle}
      data-active={active}
      data-responsive={responsive}
      data-fill={fill}
      aria-label={ariaLabel}
    >
      <div className={styles.track}>
        {fill ? <div className={styles.fill} aria-hidden="true" /> : null}
        {showPath ? <div className={styles.path} aria-hidden="true" /> : null}

        <ul className={styles.list}>
          {images.map((image, index) => {
            const start = images.length === 0 ? 0 : (index / images.length) * 100;
            const itemStyle: CSSProperties = {
              animationDelay: `${(-duration * index) / images.length}s`,
              animationDirection: direction,
              offsetDistance: `${start}%`,
            };

            return (
              <li key={image.src} className={styles.item} style={itemStyle}>
                <figure className={styles.card}>
                  <div className={styles.imageFrame}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 680px) 82vw, 210px"
                      unoptimized
                    />
                  </div>
                  {image.label ? <figcaption>{image.label}</figcaption> : null}
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.legend} aria-hidden="true">
        <strong>{centerLabel}</strong>
        <span>{centerMeta}</span>
      </div>
    </section>
  );
}
