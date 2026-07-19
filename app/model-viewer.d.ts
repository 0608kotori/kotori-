import type { HTMLAttributes, RefAttributes } from "react";

export type GoogleModelViewerElement = HTMLElement & {
  loaded?: boolean;
};

type GoogleModelViewerAttributes = HTMLAttributes<GoogleModelViewerElement> &
  RefAttributes<GoogleModelViewerElement> & {
    src: string;
    poster: string;
    alt: string;
    loading: "lazy" | "eager";
    reveal: "auto" | "interaction" | "manual";
    exposure?: string;
    "camera-controls"?: string;
    "camera-orbit"?: string;
    "min-camera-orbit"?: string;
    "max-camera-orbit"?: string;
    "field-of-view"?: string;
    "min-field-of-view"?: string;
    "max-field-of-view"?: string;
    "disable-pan"?: string;
    "disable-zoom"?: string;
    "environment-image"?: string;
    "interaction-prompt"?: "auto" | "none";
    "shadow-intensity"?: string;
    "shadow-softness"?: string;
    "tone-mapping"?: string;
    "touch-action"?: "pan-y" | "pan-x" | "none";
  };

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": GoogleModelViewerAttributes;
    }
  }
}
