import { useEffect, useRef } from "react";
import { attachSlider, type SliderOptions } from "./core";
export type SlideToUnlockProps = SliderOptions & { className?: string; style?: React.CSSProperties; };
export function SlideToUnlock({ className, style, ...opts }: SlideToUnlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!ref.current) return; const api = attachSlider(ref.current, opts); return () => api.destroy(); }, []);
  return <div className={className} style={style} ref={ref} />;
}