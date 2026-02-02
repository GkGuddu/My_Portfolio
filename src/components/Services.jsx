import React from "react";
import { FaCode, FaPaintBrush, FaDatabase, FaCogs } from "react-icons/fa";
import { SiFigma, SiMongodb } from "react-icons/si";

const Services = () => {
  const services = [
    {
      title: "Web Development",
      desc: "Building responsive and dynamic web applications.",
      icon: <FaCode className="text-4xl text-green-700" />,
    },
    {
      title: "Frontend Design",
      desc: "Creating visually appealing and user-friendly interfaces.",
      icon: <FaPaintBrush className="text-4xl text-green-700" />,
    },
    {
      title: "Backend Development",
      desc: "Developing robust server-side applications with Node.js and Express.",
      icon: <FaDatabase className="text-4xl text-green-700" />,
    },
    {
      title: "MERN Stack Solutions",
      desc: "Delivering end-to-end solutions using the MERN stack.",
      icon: <FaCogs className="text-4xl text-green-700" />,
    },
    {
      title: "UI/UX (Figma)",
      desc: "Designing user-centric interfaces and prototypes with Figma.",
      icon: <SiFigma className="text-4xl text-green-700" />,
    },
    {
      title: "Database Management",
      desc: "Handling databases efficiently using MongoDB and modern tools.",
      icon: <SiMongodb className="text-4xl text-green-700" />,
    },
  ];

  return (
    <section
      id="services"
      className="w-full min-h-[90vh] flex items-center justify-center py-16 bg-gray-900"
    >
      <div className="w-[80%] flex flex-col items-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12 text-white"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          My <span className="text-green-700">Services</span>
        </h2>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="bg-gray-800/70 p-6 rounded-xl shadow-lg 
                         hover:shadow-green-700/50 hover:-translate-y-2 
                         transition-all duration-300 cursor-pointer"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-delay={100 + index * 100}
            >
              <div className="flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white text-center">
                {service.title}
              </h3>
              <p className="mt-2 text-gray-300 text-center">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
