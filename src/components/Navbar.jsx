import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes, FaLock } from "react-icons/fa";
import { NAV_LINKS } from "../constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen]);

  return (
    <header className="site-header">
      <nav className="adri-nav" aria-label="Main navigation">
        <a className="adri-wordmark" href="#home">Guddu Kumar</a>
        <div className="adri-nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a className="adri-button adri-button-dark" href="#contact">Work with me</a>
        </div>
        <div className="adri-nav-actions">
        <a className="adri-admin-button" href={`${import.meta.env.BASE_URL}admin`} aria-label="Admin login" title="Admin login"><FaLock aria-hidden="true" /></a>
        <button ref={menuButton} className="adri-menu-toggle" type="button" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close Menu" : "Open Menu"} aria-expanded={isOpen} aria-controls="mobile-menu">
          {isOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
        </div>
        <div id="mobile-menu" className="adri-mobile-menu" hidden={!isOpen}>
          {NAV_LINKS.map((link) => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsOpen(false)}>{link}</a>)}
        </div>
      </nav>
    </header>
  );
}
