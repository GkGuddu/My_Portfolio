import React from "react";
import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaFigma,
} from "react-icons/fa";
import {
  SiJavascript,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiMysql,
  SiCplusplus,
  SiNextdotjs,
} from "react-icons/si";
import { MdOutlineSchema } from "react-icons/md"; // For DSA
import { RiFlowChart } from "react-icons/ri"; // For OOPS

const Skills = () => {
  const skills = [
    { name: "HTML", icon: <FaHtml5 className="text-orange-600 text-5xl" /> },
    { name: "CSS", icon: <FaCss3Alt className="text-blue-600 text-5xl" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="text-sky-400 text-5xl" /> },
    { name: "JavaScript", icon: <SiJavascript className="text-yellow-500 text-5xl" /> },
    { name: "React", icon: <FaReact className="text-cyan-400 text-5xl" /> },
    { name: "Next.js", icon: <SiNextdotjs className="text-white text-5xl" /> },
    { name: "Node.js", icon: <FaNodeJs className="text-green-600 text-5xl" /> },
    { name: "Express.js", icon: <SiExpress className="text-gray-400 text-5xl" /> },
    { name: "MongoDB", icon: <SiMongodb className="text-green-700 text-5xl" /> },
    { name: "MySQL", icon: <SiMysql className="text-yellow-400 text-5xl" /> },
    { name: "GitHub", icon: <FaGithub className="text-white text-5xl" /> },
    { name: "Figma", icon: <FaFigma className="text-purple-500 text-5xl" /> },
    { name: "C/C++", icon: <SiCplusplus className="text-blue-500 text-5xl" /> },

    // ➕ Added New Skills
    { name: "OOPS", icon: <RiFlowChart className="text-pink-400 text-5xl" /> },
    { name: "DSA", icon: <MdOutlineSchema className="text-red-400 text-5xl" /> },
  ];

  return (
    <section
      id="skills"
      className="w-full min-h-[90vh] flex items-center justify-center py-16 bg-gray-900"
    >
      <div className="w-[90%] flex flex-col items-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          My <span className="text-green-700">Skills</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {skills.map((skill, index) => (
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
