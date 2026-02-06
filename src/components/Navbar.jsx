import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NAV_LINKS } from "../constants";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);


  const navHeight = 80; // Approx 10vh in pixels

  // Shadow effect and scroll spy
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);

      NAV_LINKS.forEach((link) => {
        const section = document.getElementById(link.toLowerCase());
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= navHeight && rect.bottom >= navHeight) {
            setActiveLink(link.toLowerCase());
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll that offsets navbar height
  const handleClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.offsetTop;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-gray-100/20 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "shadow-lg" : ""
        }`}
      style={{ height: `${navHeight}px` }}
    >
      <div className="flex justify-between items-center h-full px-4 md:px-8">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold text-gray-900">
          Guddu <span className="text-green-700">Kumar</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {NAV_LINKS.map((link) => {
            const id = link.toLowerCase();
            return (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className={`relative text-lg font-medium transition duration-300 group ${activeLink === id
                  ? "text-green-700"
                  : "text-gray-900 hover:text-green-700"
                  }`}
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-200 group-hover:w-full"></span>
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-900 text-3xl focus:outline-none"
          onClick={() => setIsOpen(true)}
          aria-label="Open Menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-gray-100/95 backdrop-blur-md flex flex-col items-center justify-center transition-transform duration-300 ${isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <button
          className="absolute top-6 right-6 text-gray-900 text-3xl focus:outline-none"
          onClick={() => setIsOpen(false)}
          aria-label="Close Menu"
        >
          <FaTimes />
        </button>

        {NAV_LINKS.map((link) => {
          const id = link.toLowerCase();
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`text-2xl py-4 w-full text-center transition duration-200 ${activeLink === id
                ? "text-green-700 bg-gray-200"
                : "text-gray-900 hover:bg-green-700 hover:text-white"
                }`}
            >
              {link}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
