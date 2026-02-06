import React from "react";
import {
    FaHtml5,
    FaCss3Alt,
    FaReact,
    FaNodeJs,
    FaGithub,
    FaFigma,
    FaCode,
    FaPaintBrush,
    FaDatabase,
    FaCogs,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaLinkedin,
    FaTwitter,
    FaInstagram,
} from "react-icons/fa";
import {
    SiJavascript,
    SiMongodb,
    SiExpress,
    SiTailwindcss,
    SiMysql,
    SiCplusplus,
    SiNextdotjs,
    SiFigma,
} from "react-icons/si";
import { MdOutlineSchema } from "react-icons/md";
import { RiFlowChart } from "react-icons/ri";

// Navigation Links
export const NAV_LINKS = ["Home", "About", "Skills", "Services", "Contact"];

// Hero Section Texts
export const HERO_TEXTS = [
    "Frontend Developer",
    "Web Developer",
    "MERN Stack Developer",
    "Full Stack Engineer",
];

// Skills Data
export const SKILLS = [
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
    { name: "OOPS", icon: <RiFlowChart className="text-pink-400 text-5xl" /> },
    { name: "DSA", icon: <MdOutlineSchema className="text-red-400 text-5xl" /> },
];

// Services Data
export const SERVICES = [
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
    {
        title: "App Development",
        desc: "Building cross-platform mobile applications using React Native.",
        icon: <FaReact className="text-4xl text-green-700" />,
    }
];

// Contact Info
export const CONTACT_INFO = {
    phone: "+91-7367850872", // Placeholder, replace if user provided specific one
    email: "gkgudd860@gmail.com",
    location: "Bhopal, Madhya Pradesh, India",
    googleMapsUrl: "https://www.google.com/maps/place/Bhopal,+Madhya+Pradesh,+India",
};

// Social Links
export const SOCIAL_LINKS = [
    { icon: <FaGithub />, url: "https://github.com/GkGuddu", platform: "github" },
    { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/guddukr73/", platform: "linkedin" },
    { icon: <FaTwitter />, url: "https://x.com/SaahoGuddu?t=ixgdl4AUu5dn8ofpMoPqCA&s=09", platform: "twitter" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/__.itz_g_k73?igsh=MWVveTF5MnZjejM0MA==", platform: "instagram" },
];

// Resume Link
export const RESUME_LINK = "/Resume.pdf";
