const getTargetId = (hash) => {
  if (!hash || hash === "#") return "";
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
};

export const scrollToHash = (hash, { updateUrl = true, behavior } = {}) => {
  const id = getTargetId(hash);
  const target = id ? document.getElementById(id) : null;
  if (!target) return false;

  const header = document.querySelector(".site-header");
  const headerHeight = header?.getBoundingClientRect().height || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
  const scrollBehavior = behavior || (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

  if (updateUrl && window.location.hash !== hash) window.history.pushState(null, "", hash);
  window.scrollTo({ top: Math.max(0, top), behavior: scrollBehavior });
  return true;
};

export const isInternalAnchor = (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = event.target.closest?.("a[href^='#']");
  if (!anchor || anchor.target === "_blank") return null;
  return anchor;
};
