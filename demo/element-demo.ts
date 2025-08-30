import "../src/slide-to-unlock/element.ts"; // registers <slide-unlock>

const el = document.querySelector("slide-unlock");
el?.addEventListener("unlocked", () => {
  console.log("Unlocked via custom element!");
});
