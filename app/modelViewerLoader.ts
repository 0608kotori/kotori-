const MODEL_VIEWER_SOURCE = "/vendor/google-model-viewer.min.js";
const MODEL_VIEWER_TAG = "model-viewer";

let modelViewerPromise: Promise<void> | null = null;

function waitForDefinition() {
  return window.customElements.whenDefined(MODEL_VIEWER_TAG);
}

export function loadModelViewer() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Model Viewer requires a browser."));
  }

  if (window.customElements.get(MODEL_VIEWER_TAG)) {
    return Promise.resolve();
  }

  if (modelViewerPromise) return modelViewerPromise;

  modelViewerPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${MODEL_VIEWER_SOURCE}"]`,
    );
    const script = existing ?? document.createElement("script");

    const handleLoad = () => {
      script.dataset.loaded = "true";
      waitForDefinition().then(() => resolve(), reject);
    };
    const handleError = () => {
      modelViewerPromise = null;
      reject(new Error("Model Viewer could not be loaded."));
    };

    if (script.dataset.loaded === "true") {
      handleLoad();
      return;
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existing) {
      script.type = "module";
      script.src = MODEL_VIEWER_SOURCE;
      script.dataset.modelViewerLoader = "true";
      document.head.appendChild(script);
    }
  });

  return modelViewerPromise;
}
