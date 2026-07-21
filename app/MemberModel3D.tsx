"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import type { GoogleModelViewerElement } from "./model-viewer";
import { loadModelViewer } from "./modelViewerLoader";
import styles from "./MemberModel3D.module.css";

type MemberModel3DProps = {
  name: string;
  modelSrc: string;
  posterSrc: string;
  accent: string;
  cameraOrbit: string;
};

type ModelStatus = "script" | "loading" | "ready" | "error";

export default function MemberModel3D({
  name,
  modelSrc,
  posterSrc,
  accent,
  cameraOrbit,
}: MemberModel3DProps) {
  const modelRef = useRef<GoogleModelViewerElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<ModelStatus>("script");

  useEffect(() => {
    let active = true;

    loadModelViewer()
      .then(() => {
        if (active) setScriptReady(true);
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [modelSrc]);

  useEffect(() => {
    if (!scriptReady) return;
    const model = modelRef.current;
    if (!model) return;

    const handleLoad = () => setStatus("ready");
    const handleError = () => setStatus("error");
    model.addEventListener("load", handleLoad);
    model.addEventListener("error", handleError);
    setStatus("loading");

    // React can reuse an upgraded custom element while switching records.
    // Reapply the identity-bearing attributes after definition so a detached
    // viewer cannot clear the next member's model.
    model.setAttribute("src", modelSrc);
    model.setAttribute("poster", posterSrc);
    model.setAttribute("alt", `${name}的可旋转宇航员三维模型`);
    model.setAttribute("camera-orbit", cameraOrbit);

    if (model.loaded) setStatus("ready");

    return () => {
      model.removeEventListener("load", handleLoad);
      model.removeEventListener("error", handleError);
    };
  }, [cameraOrbit, name, posterSrc, scriptReady, modelSrc]);

  return (
    <section
      className={styles.archive}
      style={{ "--model-accent": accent } as CSSProperties}
      aria-label={`${name}的可旋转角色模型`}
    >
      <header className={styles.header}>
        <div>
          <span>MEMBER MODEL</span>
          <strong>{name}</strong>
        </div>
        <span className={styles.status} data-status={status} aria-live="polite">
          {status === "ready"
            ? "可旋转"
            : status === "error"
              ? "静态预览"
              : "载入中"}
        </span>
      </header>

      <div className={styles.viewport} data-ready={status === "ready"}>
        <Image
          className={styles.poster}
          src={posterSrc}
          alt=""
          fill
          sizes="280px"
          unoptimized
          aria-hidden="true"
        />
        <model-viewer
          key={modelSrc}
          ref={modelRef}
          className={styles.modelViewer}
          src={modelSrc}
          poster={posterSrc}
          alt={`${name}的可旋转宇航员三维模型`}
          loading="eager"
          reveal="auto"
          exposure="1.05"
          camera-controls=""
          camera-orbit={cameraOrbit}
          min-camera-orbit="auto auto 130%"
          max-camera-orbit="auto auto 170%"
          field-of-view="30deg"
          min-field-of-view="30deg"
          max-field-of-view="30deg"
          disable-pan=""
          disable-zoom=""
          environment-image="neutral"
          interaction-prompt="none"
          shadow-intensity="0.55"
          shadow-softness="0.85"
          tone-mapping="aces"
          touch-action="pan-y"
        />
        <span className={styles.hint}>
          {status === "ready"
            ? "左右拖动旋转"
            : status === "error"
                ? "模型暂不可用"
                : "正在准备模型"}
        </span>
      </div>

      <footer className={styles.controls} data-active={status === "ready"}>
        <span>←</span>
        <strong>DRAG TO ROTATE</strong>
        <span>→</span>
      </footer>
    </section>
  );
}
