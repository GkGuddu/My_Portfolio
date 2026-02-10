import React, { useEffect, useState, useRef } from "react";
import { HERO_TEXTS } from "../constants";

const Home = () => {

  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const intervalRef = useRef(null);

  // Code block typing
  const codeLines = [
    `  const developer = {`,
    `  name: "Guddu",`,
    `  role: "MERN Stack Developer",`,
    `  location: "India",`,
    `  email: "gkgudd860@gmail.com",`,
    `  skills: ["MongoDB", "Express", "React", "Node.js"],`,
    `};`,
  ];
  const [typedCode, setTypedCode] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Role typewriter
  useEffect(() => {
    const typeWriter = () => {
      const currentWord = HERO_TEXTS[textIndex];
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % HERO_TEXTS.length);
        }
      }
    };

    intervalRef.current = setInterval(typeWriter, isDeleting ? 60 : 120);
    return () => clearInterval(intervalRef.current);
  }, [currentText, isDeleting, textIndex]);

  // Code typing effect
  useEffect(() => {
    if (lineIndex < codeLines.length) {
      if (charIndex < codeLines[lineIndex].length) {
        setTimeout(() => {
          setTypedCode((prev) => prev + codeLines[lineIndex][charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 60);
      } else {
        setTypedCode((prev) => prev + "\n");
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      }
    }
  }, [lineIndex, charIndex]);

  return (
    <section
      id="home"
      className="w-full min-h-[100vh] flex items-start md:items-center justify-center px-6 md:px-16 bg-gray-900 pt-32 md:pt-0"
    >
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 md:gap-12 max-w-[1200px] mx-auto">
        {/* Left: Text Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1
            className="text-3xl md:text-5xl font-bold"
            data-aos="fade-left"
            data-aos-duration="1500"
            data-aos-delay="700"
          >
            Hi, I'm <span className="text-green-700">Guddu</span>
          </h1>

          {/* Typewriter Text */}
          <div
            className="text-xl md:text-3xl font-semibold mt-2"
            data-aos="fade-right"
            data-aos-duration="1500"
            data-aos-delay="900"
          >
            I'm a <span className="text-green-700">{currentText}</span>
            <span className="animate-pulse">|</span>
          </div>

          {/* About Section */}
          <p
            className="text-sm md:text-base mt-4 max-w-[600px] text-gray-300"
            data-aos="flip-down"
            data-aos-duration="1500"
            data-aos-delay="1100"
          >
            I specialize in building modern, scalable, and user-friendly web
            applications using <b>MongoDB, Express.js, React, and Node.js</b>.
            <br />
            <br />
            Passionate about writing clean code, solving real-world problems,
            and creating seamless digital experiences. Always eager to learn new
            technologies and contribute to impactful projects 🚀.
          </p>

          {/* Let's Go Button */}
          <a
            href="#contact"
            className="mt-4 md:mt-8 px-6 py-3 bg-green-700 text-white rounded-md hover:bg-transparent hover:border-2 hover:border-green-700 hover:text-green-700 hover:shadow-[0_0_40px_#077b32] transition duration-200 cursor-pointer"
            data-aos="zoom-in"
            data-aos-duration="1500"
            data-aos-delay="1800"
          >
            Meet me!
          </a>
        </div>

        {/* Right: Code Block */}
        <div
          className="w-full md:w-1/2 flex justify-center"
          data-aos="fade-left"
          data-aos-duration="2000"
        >
          <div className="relative group perspective">
            <div className="w-[300px] md:w-[450px] h-[280px] bg-[#1e1e1e] rounded-xl p-6 text-green-400 font-mono text-sm shadow-[0_10px_50px_rgba(0,0,0,0.6)] transform transition-transform duration-500 group-hover:rotate-y-6 group-hover:-rotate-x-3 overflow-hidden">
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <pre className="whitespace-pre-wrap">{typedCode}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
