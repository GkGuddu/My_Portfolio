import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="w-full min-h-[90vh] flex items-center justify-center py-16 bg-gray-900"
    >
      <div className="w-[90%] flex flex-col items-center">
        {/* Section Title */}
        <h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          About <span className="text-green-700">Me</span>
        </h2>

        {/* Flex Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-20 md:gap-32">
          {/* Left: Profile Image */}
          <div
            className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-xl overflow-hidden hover:bg-transparent hover:border-1.5 hover:border-green-700/50 hover:text-green-700/50 hover:shadow-[0_0_30px_#077b32] transition duration-200 hover:-translate-y-2  cursor-pointer"
            data-aos="fade-right"
            data-aos-duration="1500"
          >
            <img
              src="/Profile.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: About Text */}
          <div
            className="max-w-[650px] text-center md:text-left"
            data-aos="fade-left"
            data-aos-duration="1500"
          >
            <p className="text-sm md:text-base leading-relaxed">
              I'm a passionate web developer with expertise in creating dynamic
              and responsive web applications. With a strong foundation in
              frontend technologies and the <b>MERN stack</b>, I strive to
              deliver user-friendly and visually appealing solutions.
              <br />
              <br />
              Currently, I’m sharpening my <b>JavaScript</b> skills to write
              cleaner, more efficient, and scalable code — the key pillar behind
              React, Node.js, and modern web development.
              <br />
              <br />
              My goal is to continuously learn and adapt to new technologies to
              build innovative projects.
            </p>

            {/* Download CV Button */}
            <a
              href="/Guddu_Resume.pdf"
              download="Guddu_Resume.pdf"
              className="inline-block mt-6 px-6 py-3 bg-green-700 text-white font-medium rounded-md hover:bg-transparent hover:border-1.5 hover:border-green-700 hover:text-green-700 hover:shadow-[0_0_30px_#077b32] transition duration-200"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
