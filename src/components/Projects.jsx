import React from "react";
import { PROJECTS } from "../constants";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const Projects = () => {
    return (
        <section
            id="projects"
            className="w-full min-h-[90vh] flex items-center justify-center py-16 bg-gray-900"
        >
            <div className="w-[90%] flex flex-col items-center">
                <h2
                    className="text-3xl md:text-4xl font-bold mb-12 text-white"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                >
                    My <span className="text-green-700">Projects</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PROJECTS.map((project, index) => (
                        <div
                            key={project.title}
                            className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden shadow-lg 
                            hover:shadow-green-700/30 hover:-translate-y-2 
                            transition-all duration-300 group"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                            data-aos-delay={100 + index * 100}
                        >
                            {/* Project Image */}
                            <div className="relative w-full h-48 overflow-hidden">
                                <img
                                    src={project.image || "https://via.placeholder.com/400x300"}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-green-600 hover:border-green-600 transition-all duration-300 shadow-lg"
                                        title="View Code"
                                    >
                                        <FaGithub size={20} />
                                    </a>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-green-600 hover:border-green-600 transition-all duration-300 shadow-lg"
                                        title="Live Demo"
                                    >
                                        <FaExternalLinkAlt size={20} />
                                    </a>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{project.title}</h3>
                                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech, idx) => (
                                        <span key={idx} className="px-3 py-1 text-xs font-medium text-green-300 bg-green-900/20 rounded-full border border-green-700/30">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
