import React from "react";
import { SKILLS } from "../constants";

const Skills = () => {


  return (
    <section
      id="skills"
      className="w-full min-h-[90vh] flex items-center justify-center py-16 px-6 md:px-16 bg-gray-900"
    >
      <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          My <span className="text-green-700">Skills</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {SKILLS.map((skill, index) => (
            <div
              key={skill.name}
              className="bg-gray-800/70 p-6 rounded-xl shadow-lg 
                         hover:shadow-green-700/50 hover:-translate-y-2 
                         transition-all duration-300 cursor-pointer flex flex-col items-center"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-delay={100 + index * 100}
            >
              {skill.icon}
              <p className="mt-3 text-sm md:text-base font-semibold text-white">
                {skill.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
