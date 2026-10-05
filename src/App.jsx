import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Services from './components/Services';
import Contact from './components/Contact';
import MotionProvider from './components/MotionProvider';

const App = () => {
  return (
    <MotionProvider>
      <div className="site-content">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Home />
          <About />
          <Skills />
          <Projects />
          <Education />
          <Services />
          <Contact />
        </main>
      </div>
    </MotionProvider>
  );
};

export default App;
