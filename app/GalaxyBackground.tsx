"use client";

import { useEffect, useRef } from "react";

import styles from "./GalaxyBackground.module.css";

const TARGET_FRAME_INTERVAL = 1000 / 30;
const MAX_BACKING_PIXELS = 1_200_000;

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;

varying vec2 vUv;

#define NUM_LAYERS 2.0
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)

float hash21(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

float starShape(vec2 point, float flare) {
  float distanceFromCenter = max(length(point), 0.002);
  float glow = 0.0042 / distanceFromCenter;
  float rays = 1.0 - smoothstep(0.0, 1.0, abs(point.x * point.y * 720.0));
  glow += rays * flare * 0.22;

  point *= MAT45;
  rays = 1.0 - smoothstep(0.0, 1.0, abs(point.x * point.y * 720.0));
  glow += rays * flare * 0.075;
  glow *= 1.0 - smoothstep(0.08, 0.34, distanceFromCenter);
  return glow;
}

vec3 starLayer(vec2 uv, float layerSeed) {
  vec2 cell = floor(uv);
  vec2 point = fract(uv) - 0.5;
  float seed = hash21(cell + layerSeed);
  float size = pow(fract(seed * 345.32), 2.0);

  vec2 drift = vec2(
    sin(uTime * 0.09 + seed * 31.0),
    cos(uTime * 0.07 + seed * 47.0)
  ) * 0.035;
  vec2 offset = vec2(
    hash21(cell + layerSeed + 11.7),
    hash21(cell + layerSeed + 29.3)
  ) - 0.5;
  offset = offset * 0.15 + drift;

  float pulse = 0.82 + 0.18 * sin(uTime * (0.65 + seed * 0.5) + seed * 42.0);
  float flare = smoothstep(0.88, 1.0, size) * pulse;
  float star = starShape(point - offset, flare);
  float twinkle = mix(1.0, pulse, 0.12);

  vec3 coolWhite = vec3(0.88, 0.92, 1.0);
  vec3 violet = vec3(0.65, 0.56, 1.0);
  vec3 blue = vec3(0.43, 0.74, 1.0);
  vec3 accent = mix(violet, blue, hash21(cell + layerSeed + 71.0));
  vec3 color = mix(coolWhite, accent, 0.44 + seed * 0.22);

  return star * (0.14 + size * 1.24) * twinkle * color;
}

void main() {
  vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float angle = uTime * 0.009;
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  uv = rotation * uv;

  vec3 color = vec3(0.0);

  for (float layer = 0.0; layer < 1.0; layer += 1.0 / NUM_LAYERS) {
    float depth = fract(layer + 0.18 + uTime * 0.009);
    float scale = mix(17.0, 6.0, depth);
    float fadeIn = smoothstep(0.0, 0.16, depth);
    float fadeOut = 1.0 - smoothstep(0.82, 1.0, depth);
    color += starLayer(uv * scale + layer * 453.32, layer * 97.0) * fadeIn * fadeOut;
  }

  float brightness = max(max(color.r, color.g), color.b);
  float alpha = smoothstep(0.003, 0.18, brightness) * 0.84;
  vec3 tone = color / max(brightness, 0.001);
  gl_FragColor = vec4(tone, alpha);
}
`;

type ConnectionAwareNavigator = Navigator & {
  connection?: EventTarget & {
    saveData?: boolean;
  };
};

type GalaxyOglModule = Pick<
  typeof import("ogl"),
  "Mesh" | "Program" | "Renderer" | "Triangle"
>;

function createGalaxyRuntime(
  ogl: GalaxyOglModule,
  host: HTMLDivElement,
  root: HTMLDivElement,
) {
  const renderer = new ogl.Renderer({
    alpha: true,
    antialias: false,
    depth: false,
    dpr: 1,
    premultipliedAlpha: false,
    powerPreference: "low-power",
    stencil: false,
  });
  const gl = renderer.gl;
  const canvas = gl.canvas;
  const resolution = new Float32Array([1, 1, 1]);
  const geometry = new ogl.Triangle(gl);
  const program = new ogl.Program(gl, {
    cullFace: false,
    depthTest: false,
    depthWrite: false,
    fragment: fragmentShader,
    transparent: true,
    uniforms: {
      uResolution: { value: resolution },
      uTime: { value: 0 },
    },
    vertex: vertexShader,
  });

  if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
    geometry.remove();
    program.remove();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    throw new Error("Galaxy shader failed to link.");
  }

  const mesh = new ogl.Mesh(gl, { geometry, program });
  let animationFrame = 0;
  let disposed = false;
  let hasRendered = false;
  let isHeroVisible = false;
  let runtimeAvailable = true;
  let lastRenderTime = 0;
  const startTime = performance.now();

  gl.clearColor(0, 0, 0, 0);
  canvas.className = styles.canvas;
  canvas.setAttribute("role", "presentation");
  host.appendChild(canvas);

  const resize = () => {
    const { height, width } = host.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;

    const pixelScale = Math.min(
      1,
      Math.sqrt(MAX_BACKING_PIXELS / (width * height)),
    );
    const renderWidth = Math.max(1, Math.floor(width * pixelScale));
    const renderHeight = Math.max(1, Math.floor(height * pixelScale));

    renderer.setSize(renderWidth, renderHeight);
    resolution[0] = gl.canvas.width;
    resolution[1] = gl.canvas.height;
    resolution[2] = gl.canvas.width / gl.canvas.height;
  };

  const shouldRender = () =>
    !disposed &&
    runtimeAvailable &&
    isHeroVisible &&
    document.visibilityState === "visible";

  const stopLoop = () => {
    if (!animationFrame) return;
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const render = (time: number) => {
    animationFrame = 0;
    if (!shouldRender()) return;

    if (time - lastRenderTime >= TARGET_FRAME_INTERVAL) {
      lastRenderTime = time - ((time - lastRenderTime) % TARGET_FRAME_INTERVAL);
      program.uniforms.uTime.value = (time - startTime) * 0.001;

      try {
        renderer.render({ frustumCull: false, scene: mesh, sort: false });
        if (!hasRendered) {
          hasRendered = true;
          root.dataset.ready = "true";
        }
      } catch {
        root.dataset.ready = "false";
        runtimeAvailable = false;
        return;
      }
    }

    animationFrame = window.requestAnimationFrame(render);
  };

  const startLoop = () => {
    if (!shouldRender() || animationFrame) return;
    animationFrame = window.requestAnimationFrame(render);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      startLoop();
    } else {
      stopLoop();
    }
  };

  const handleContextLost = () => {
    root.dataset.ready = "false";
    runtimeAvailable = false;
    stopLoop();
  };

  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isHeroVisible = entry?.isIntersecting ?? false;
      if (isHeroVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    },
    { threshold: 0.01 },
  );

  resize();
  resizeObserver.observe(host);
  intersectionObserver.observe(root.closest(".hero") ?? root);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  canvas.addEventListener("webglcontextlost", handleContextLost);
  startLoop();

  return () => {
    disposed = true;
    stopLoop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    canvas.remove();
    geometry.remove();
    program.remove();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    root.dataset.ready = "false";
  };
}

export function GalaxyBackground() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const root = rootRef.current;
    if (!host || !root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const highContrast = window.matchMedia("(prefers-contrast: more)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const connection = (navigator as ConnectionAwareNavigator).connection;
    const missingObserverSupport =
      typeof IntersectionObserver === "undefined" ||
      typeof ResizeObserver === "undefined";
    let disposed = false;
    let generation = 0;
    let destroyRuntime: (() => void) | undefined;

    const shouldUseFallback = () =>
      reducedMotion.matches ||
      highContrast.matches ||
      coarsePointer.matches ||
      connection?.saveData === true ||
      missingObserverSupport;

    const clearRuntime = () => {
      destroyRuntime?.();
      destroyRuntime = undefined;
      root.dataset.ready = "false";
    };

    const syncBackground = () => {
      generation += 1;
      const requestGeneration = generation;
      clearRuntime();

      if (shouldUseFallback()) return;

      void import("ogl")
        .then(({ Mesh, Program, Renderer, Triangle }) => {
          if (
            disposed ||
            requestGeneration !== generation ||
            shouldUseFallback()
          ) {
            return;
          }

          destroyRuntime = createGalaxyRuntime(
            { Mesh, Program, Renderer, Triangle },
            host,
            root,
          );
        })
        .catch(() => {
          if (!disposed && requestGeneration === generation) {
            root.dataset.ready = "false";
          }
        });
    };

    reducedMotion.addEventListener("change", syncBackground);
    highContrast.addEventListener("change", syncBackground);
    coarsePointer.addEventListener("change", syncBackground);
    connection?.addEventListener("change", syncBackground);
    syncBackground();

    return () => {
      disposed = true;
      generation += 1;
      reducedMotion.removeEventListener("change", syncBackground);
      highContrast.removeEventListener("change", syncBackground);
      coarsePointer.removeEventListener("change", syncBackground);
      connection?.removeEventListener("change", syncBackground);
      clearRuntime();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-ready="false"
      aria-hidden="true"
    >
      <div className={`${styles.fallback} ${styles.fallbackOne}`} />
      <div className={`${styles.fallback} ${styles.fallbackTwo}`} />
      <div ref={hostRef} className={styles.canvasHost} />
      <div className={styles.scrim} />
    </div>
  );
}
