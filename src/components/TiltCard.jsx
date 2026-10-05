import { useEffect, useRef } from "react";
import { useMotion } from "./motion-context";

export default function TiltCard({ as: tag = "div", className = "", children, intensity = 7, onPointerMove, onPointerLeave, ...props }) {
  const Component = tag;
  const element = useRef(null);
  const frame = useRef(0);
  const { paused } = useMotion();

  const reset = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (!element.current) return;
    element.current.style.setProperty("--tilt-x", "0deg");
    element.current.style.setProperty("--tilt-y", "0deg");
    element.current.style.setProperty("--glare-opacity", "0");
  };

  useEffect(() => {
    if (paused) reset();
    return () => cancelAnimationFrame(frame.current);
  }, [paused]);

  const move = (event) => {
    onPointerMove?.(event);
    if (paused || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = element.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const style = element.current?.style;
      if (!style) return;
      style.setProperty("--tilt-x", `${(0.5 - y) * intensity}deg`);
      style.setProperty("--tilt-y", `${(x - 0.5) * intensity}deg`);
      style.setProperty("--glare-x", `${x * 100}%`);
      style.setProperty("--glare-y", `${y * 100}%`);
      style.setProperty("--glare-opacity", "1");
    });
  };

  return <Component ref={element} className={`tilt-card ${className}`} onPointerMove={move} onPointerLeave={(event) => { reset(); onPointerLeave?.(event); }} {...props}>{children}</Component>;
}
