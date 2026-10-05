import { createContext, useContext } from "react";

export const MotionContext = createContext({ paused: true, reducedMotion: false, toggleMotion: () => {} });

export const useMotion = () => useContext(MotionContext);
