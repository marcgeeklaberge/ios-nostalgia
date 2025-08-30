import { attachSlider, type SliderOptions } from "./core";

export class SlideUnlockElement extends HTMLElement {
  private api: ReturnType<typeof attachSlider> | null = null;

  static get observedAttributes() {
    return [
      "text",
      "unlocked-text",
      "height",
      "handle-width",
      "radius",
      "bg-color",
      "text-color",
      "handle-color-from",
      "handle-color-to",
      "threshold",
      "reset-delay-ms",
      "shimmer",
    ];
  }

  connectedCallback() {
    const opts: SliderOptions = {
      text: this.getAttribute("text") ?? undefined,
      unlockedText: this.getAttribute("unlocked-text") ?? undefined,
      onUnlock: () => this.dispatchEvent(new CustomEvent("unlock")),
    };
    this.api = attachSlider(this, opts);
  }

  disconnectedCallback() {
    this.api?.destroy();
  }
}

// 👇 force define every time, even in build
customElements.define("slide-unlock", SlideUnlockElement);
