export type SliderOptions = {
  text?: string;
  unlockedText?: string;
  height?: number;
  handleWidth?: number;
  radius?: number;
  bgColor?: string;
  textColor?: string;
  handleColorFrom?: string;
  handleColorTo?: string;
  threshold?: number;
  resetDelayMs?: number;
  shimmer?: boolean;
  onUnlock?: () => void;
  onChange?: (progress: number) => void;
};
type SliderAPI = {
  reset: () => void;
  setText: (t: string) => void;
  setColors: (
    c: Partial<
      Pick<
        SliderOptions,
        "bgColor" | "textColor" | "handleColorFrom" | "handleColorTo"
      >
    >
  ) => void;
  destroy: () => void;
};
const DEFAULTS = {
  text: "slide to unlock",
  unlockedText: "unlocked",
  height: 42,
  handleWidth: 50,
  radius: 10,
  bgColor: "rgba(0,0,0,0.9)",
  textColor: "#ffffff",
  handleColorFrom: "#d4d4d4",
  handleColorTo: "#b4b4b4",
  threshold: 0.9,
  resetDelayMs: 1000,
  shimmer: true,
} as const;

export function attachSlider(
  host: HTMLElement,
  options: SliderOptions = {}
): SliderAPI {
  const opts = { ...DEFAULTS, ...options };
  host.style.display = "block";
  host.style.position = "relative";
  host.style.width = "100%";
  host.style.height = `${opts.height}px`;

  const bg = document.createElement("div");
  Object.assign(bg.style, {
    position: "relative",
    width: "100%",
    height: "100%",
    background: opts.bgColor,
    border: "1px solid rgba(0,0,0,0.4)",
    borderRadius: `${opts.radius}px`,
    overflow: "hidden",
    boxShadow: "inset 0 1px 1px rgba(0,0,0,.1),0 1px 0 rgba(255,255,255,.2)",
  });

  const text = document.createElement("div");
  Object.assign(text.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: `'Helvetica Neue', Helvetica, Arial, sans-serif`,
    fontSize: "18px",
    color: opts.textColor,
    pointerEvents: "none",
    textShadow: "0 1px 2px rgba(0,0,0,.5)",
  });
  text.textContent = opts.text;

  if (opts.shimmer) {
    text.style.background = `-webkit-gradient(linear,left top,right top,
      color-stop(0%,#4d4d4d),color-stop(40%,#4d4d4d),color-stop(50%,#ffffff),
      color-stop(60%,#4d4d4d),color-stop(100%,#4d4d4d))`;
    // @ts-ignore
    text.style.webkitBackgroundClip = "text";
    // @ts-ignore
    text.style.webkitTextFillColor = "transparent";
    text.style.backgroundSize = "200% 100%";
    text.style.animation = "slideShine 2s infinite linear";
    if (!document.getElementById("__slideShineKeyframes")) {
      const style = document.createElement("style");
      style.id = "__slideShineKeyframes";
      style.textContent = `@keyframes slideShine{0%{background-position:100% 0}100%{background-position:0 0}}`;
      document.head.appendChild(style);
    }
  }

  const handle = document.createElement("div");
  Object.assign(handle.style, {
    position: "absolute",
    top: "1px",
    left: "1px",
    width: `${opts.handleWidth}px`,
    height: `${opts.height - 4}px`,
    background: `linear-gradient(to bottom, ${opts.handleColorFrom}, ${opts.handleColorTo})`,
    border: "1px solid #999",
    borderRadius: `${opts.radius}px`,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.8),0 1px 2px rgba(0,0,0,.3)",
    cursor: "grab",
    transition: "left .3s ease-out",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });
  const arrow = document.createElement("div");
  Object.assign(arrow.style, {
    position: "relative",
    width: "15px",
    height: "10px",
    background: "gray",
    left: "0",
  });
  const arrowHead = document.createElement("div");
  Object.assign(arrowHead.style, {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "0",
    height: "0",
    borderTop: "8px solid transparent",
    borderBottom: "8px solid transparent",
    borderLeft: "12px solid gray",
    left: "15px",
  });
  arrow.appendChild(arrowHead);
  handle.appendChild(arrow);
  bg.appendChild(text);
  bg.appendChild(handle);
  host.appendChild(bg);

  let dragging = false,
    pointerOffset = 0;
  const maxLeftPx = () => host.clientWidth - opts.handleWidth - 2;
  const setLeft = (px: number) => {
    const clamped = Math.max(1, Math.min(px, maxLeftPx()));
    handle.style.left = `${clamped}px`;
    const progress = clamped / maxLeftPx();
    opts.onChange?.(progress);
  };
  const reset = () => {
    handle.style.transition = "left .3s ease-out";
    handle.style.left = "1px";
    text.textContent = opts.text;
  };

  const onPointerDown = (e: PointerEvent) => {
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    handle.style.transition = "none";
    handle.style.cursor = "grabbing";
    const rect = handle.getBoundingClientRect();
    pointerOffset = e.clientX - rect.left;
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const hostLeft = host.getBoundingClientRect().left;
    setLeft(e.clientX - pointerOffset - hostLeft);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    dragging = false;
    handle.style.cursor = "grab";
    handle.style.transition = "left .3s ease-out";
    const progress = parseFloat(handle.style.left) / maxLeftPx();
    if (progress >= opts.threshold) {
      text.textContent = opts.unlockedText;
      opts.onUnlock?.();
      setTimeout(reset, opts.resetDelayMs);
    } else reset();
  };

  handle.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  return {
    reset,
    setText: (t) => {
      opts.text = t;
      text.textContent = t;
    },
    setColors: (c) => {
      if (c.bgColor) bg.style.background = c.bgColor;
      if (c.textColor) text.style.color = c.textColor;
      if (c.handleColorFrom || c.handleColorTo) {
        handle.style.background = `linear-gradient(to bottom, ${
          c.handleColorFrom ?? opts.handleColorFrom
        }, ${c.handleColorTo ?? opts.handleColorTo})`;
      }
      Object.assign(opts, c);
    },
    destroy: () => {
      handle.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      host.innerHTML = "";
    },
  };
}
