import { useEffect, useRef, useState } from "react";
import { MotionContext } from "./motion-context";
import { isInternalAnchor, scrollToHash } from "../smooth-scroll";
import "./motion.css";

export default function MotionProvider({ children }) {
  const root = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [userPaused, setUserPaused] = useState(false);
  const paused = reducedMotion || userPaused;

  useEffect(() => {
    const handleAnchorClick = (event) => {
      const anchor = isInternalAnchor(event);
      if (!anchor) return;
      if (!scrollToHash(anchor.getAttribute("href"))) return;
      event.preventDefault();
    };
    const handleHistoryNavigation = () => {
      if (window.location.hash) scrollToHash(window.location.hash, { updateUrl: false, behavior: "auto" });
      else window.scrollTo({ top: 0, behavior: "auto" });
    };
    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("popstate", handleHistoryNavigation);
    window.addEventListener("hashchange", handleHistoryNavigation);
    const frame = requestAnimationFrame(() => {
      if (window.location.hash) scrollToHash(window.location.hash, { updateUrl: false, behavior: "auto" });
    });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("popstate", handleHistoryNavigation);
      window.removeEventListener("hashchange", handleHistoryNavigation);
    };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (event) => setReducedMotion(event.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const host = root.current;
    const sections = host.querySelectorAll("section[id]");
    const reveals = host.querySelectorAll(".reveal-3d");
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { entry.target.dataset.inView = String(entry.isIntersecting); });
    }, { threshold: 0 });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    sections.forEach((section) => sectionObserver.observe(section));
    reveals.forEach((element) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) element.classList.add("is-visible");
      else revealObserver.observe(element);
    });
    const addedContent = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        const observe = element => {
          if (element.matches('section[id]')) sectionObserver.observe(element);
          if (element.matches('.reveal-3d:not(.is-visible)')) revealObserver.observe(element);
        };
        observe(node);
        node.querySelectorAll('section[id], .reveal-3d').forEach(observe);
      }));
    });
    addedContent.observe(host, { childList: true, subtree: true });
    host.classList.add("motion-ready");
    const updateVisibility = () => { host.dataset.pageVisible = String(!document.hidden); };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
      addedContent.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const toggleMotion = () => setUserPaused((value) => !value);

  return (
    <MotionContext.Provider value={{ paused, reducedMotion, toggleMotion }}>
      <div ref={root} className="portfolio-app adri-portfolio" data-motion={paused ? "paused" : "running"}>
        {children}
        <button
          type="button"
          className="motion-toggle"
          onClick={toggleMotion}
          disabled={reducedMotion}
          aria-pressed={paused}
          aria-label={reducedMotion ? "Animations off: reduced motion enabled" : paused ? "Resume all animations" : "Pause all animations"}
        >
          <span className={`motion-toggle-icon ${paused ? "is-paused" : ""}`} aria-hidden="true"><i /><i /><i /></span>
          <span>{reducedMotion ? "Reduced motion" : paused ? "Motion off" : "Motion on"}</span>
          <span className="motion-toggle-action" aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
        </button>
      </div>
    </MotionContext.Provider>
  );
}
