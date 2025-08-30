import { attachSlider } from "../src/slide-to-unlock/core.ts";

const slot = document.getElementById("core-slot")!;
const api = attachSlider(slot, {
  text: "slide to unlock",
  unlockedText: "unlocked",
  threshold: 0.85,
  onUnlock: () => console.log("Unlocked via core API!"),
});
