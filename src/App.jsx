import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Contact from './components/Contact';
import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  useEffect(() => {
    AOS.init({ offset: 0 });

    // Scroll to the home section on page load/refresh
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-poppins">
      <Navbar />
      <Home />
      <About />
      <Skills />
      <Services />
      <Contact />
      

      
    </div>
  );
};

export default App;