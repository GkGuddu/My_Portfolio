import React from "react";
import {
    FaHtml5,
    FaCss3Alt,
    FaReact,
    FaNodeJs,
    FaGithub,
    FaCode,
    FaPaintBrush,
    FaDatabase,
    FaCogs,
    FaLinkedin,
    FaTwitter,
    FaInstagram,
    FaLaptopCode,
    FaLayerGroup,
    FaExchangeAlt,
    FaShieldAlt,
    FaProjectDiagram,
    FaCubes,
    FaSyncAlt,
} from "react-icons/fa";
import {
    SiJavascript,
    SiMongodb,
    SiExpress,
    SiTailwindcss,
    SiMysql,
    SiCplusplus,
    SiNextdotjs,
    SiTypescript,
    SiPostgresql,
    SiVercel,
    SiC,
    SiGit,
    SiRender,
    SiGithubcopilot,
    SiOpenai,
    SiClaude,
    SiFramer,
    SiRedux,
    SiReacthookform,
    SiPrisma,
    SiSupabase,
    SiCloudinary,
    SiPostman,
} from "react-icons/si";

export const NAV_LINKS = ["Home", "About", "Skills", "Projects", "Education", "Services", "Contact"];

export const EDUCATION = [
    {
        id: "btech",
        degree: "Bachelor of Technology",
        field: "Computer Science and Engineering",
        institution: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal",
        start: { label: "Aug 2022", value: "2022-08" },
        end: { label: "Jun 2026", value: "2026-06" },
        cgpa: "7.58",
        level: "Undergraduate",
        focus: ["Software development", "DSA", "DBMS", "OOP"],
    },
    {
        id: "bcom",
        degree: "Bachelor of Commerce",
        institution: "School of Open Learning (DU SOL), University of Delhi",
        start: { label: "2019", value: "2019" },
        end: { label: "2023", value: "2023" },
        cgpa: "7.12",
        level: "Undergraduate",
    },
    {
        id: "higher-secondary",
        degree: "Higher Secondary Education",
        field: "Science",
        institution: "Bihar School Examination Board (BSEB)",
        start: { label: "Jun 2017", value: "2017-06" },
        end: { label: "Feb 2019", value: "2019-02" },
        level: "School education",
    },
    {
        id: "secondary",
        degree: "Secondary School Certificate",
        field: "General Education",
        institution: "Bihar School Examination Board (BSEB)",
        start: { label: "Apr 2016", value: "2016-04" },
        end: { label: "Apr 2017", value: "2017-04" },
        level: "School education",
    },
];

export const SKILL_CATEGORIES = [
    {
        name: "Programming Languages", tone: "lavender", description: "The foundations behind the code.",
        skills: [
            { name: "JavaScript", icon: <SiJavascript /> },
            { name: "TypeScript", icon: <SiTypescript /> },
            { name: "C", icon: <SiC /> },
            { name: "C++", icon: <SiCplusplus /> },
        ],
    },
    {
        name: "CS Core", tone: "cream", description: "Problem solving and software fundamentals.",
        skills: [
            { name: "DSA", icon: <FaProjectDiagram /> },
            { name: "DBMS", icon: <FaDatabase /> },
            { name: "OOPS", icon: <FaCubes /> },
            { name: "SDLC", icon: <FaSyncAlt /> },
        ],
    },
    {
        name: "Frontend", tone: "pink", description: "Interfaces that feel right.",
        skills: [
            { name: "HTML5", icon: <FaHtml5 /> },
            { name: "CSS3", icon: <FaCss3Alt /> },
            { name: "Tailwind CSS", icon: <SiTailwindcss /> },
            { name: "React.js", icon: <FaReact /> },
            { name: "Next.js", icon: <SiNextdotjs /> },
            { name: "Redux", icon: <SiRedux /> },
            { name: "React Hook Form", icon: <SiReacthookform /> },
            { name: "Framer Motion", icon: <SiFramer /> },
        ],
    },
    {
        name: "Backend", tone: "mustard", description: "Connected services, thoughtful logic.",
        skills: [
            { name: "Node.js", icon: <FaNodeJs /> },
            { name: "Express.js", icon: <SiExpress /> },
            { name: "REST APIs", icon: <FaExchangeAlt /> },
            { name: "Auth.js", icon: <FaShieldAlt /> },
        ],
    },
    {
        name: "Databases & ORM", tone: "lavender", description: "Structured data for real applications.",
        skills: [
            { name: "MongoDB", icon: <SiMongodb /> },
            { name: "MySQL", icon: <SiMysql /> },
            { name: "PostgreSQL", icon: <SiPostgresql /> },
            { name: "Prisma", icon: <SiPrisma /> },
            { name: "Supabase", icon: <SiSupabase /> },
        ],
    },
    {
        name: "Tools & Deployment", tone: "pink", description: "From version control to going live.",
        skills: [
            { name: "Git", icon: <SiGit /> },
            { name: "GitHub", icon: <FaGithub /> },
            { name: "Postman", icon: <SiPostman /> },
            { name: "Cloudinary", icon: <SiCloudinary /> },
            { name: "Vercel", icon: <SiVercel /> },
            { name: "Render", icon: <SiRender /> },
        ],
    },
    {
        name: "AI Tools", tone: "cream", description: "For debugging, code review, and productivity.",
        skills: [
            { name: "GitHub Copilot", icon: <SiGithubcopilot /> },
            { name: "ChatGPT", icon: <SiOpenai /> },
            { name: "Claude", icon: <SiClaude /> },
        ],
    },
];

export const PROJECTS = [
    {
        title: "GP MiniMart",
        description: "A full-stack e-commerce platform for groceries and daily essentials. Features include user authentication, product search, cart management, and admin dashboard.",
        image: `${import.meta.env.BASE_URL}GP_MiniMart.png`,
        techStack: ["React", "Node.js", "Express", "MongoDB", "Redux"],
        link: "https://gp-mini-mart.vercel.app",
        github: "https://github.com/GkGuddu/GP-MiniMart",
    },
    {
        title: "SchoolMgt",
        description: "A full-stack school management application built with MongoDB, Express.js, React, and Node.js.",
        image: `${import.meta.env.BASE_URL}SchoolMgt.svg`,
        techStack: ["React", "Node.js", "Express.js", "MongoDB"],
        link: null,
        github: null,
    },
    {
        title: "EstateHub",
        description: "A full-stack real estate platform for discovering, listing, and comparing properties. Includes property search, saved favorites, visit scheduling, and dashboards for users, agents, and admins.",
        image: `${import.meta.env.BASE_URL}EstateHub.png`,
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
        link: "https://estate-hub-rho.vercel.app",
        github: "https://github.com/GkGuddu/EstateHub",
    },
    {
        title: "Cross Road Game",
        description: "An engaging 3D arcade-style Cross Road game built with Next.js. Features interactive gameplay, smooth animations, obstacle avoidance, and dynamic score tracking.",
        image: "https://www.sourcecodester.com/sites/default/files/images/razormist/crossy-road-clone-game-using-html-css-in-threejs.jpg", 
        techStack: ["Next.js", "React", "Tailwind CSS", "Three.js", "JavaScript"],
        link: "https://cross-road-game-amber.vercel.app",
        github: "https://github.com/GkGuddu/Cross-Road-Game",
    },
];

export const SERVICES = [
    {
        title: "Full Stack Developer",
        desc: "Building end-to-end scalable web applications using modern frontend and backend tech.",
        icon: <FaLayerGroup className="text-4xl text-green-700" />,
    },
    {
        title: "Software Developer",
        desc: "Designing and engineering efficient algorithms, data structures, and maintainable software systems.",
        icon: <FaLaptopCode className="text-4xl text-green-700" />,
    },
    {
        title: "MERN Stack Developer",
        desc: "Delivering end-to-end solutions using the MERN stack.",
        icon: <FaCogs className="text-4xl text-green-700" />,
    },
    {
        title: "Web Development",
        desc: "Building responsive and dynamic web applications.",
        icon: <FaCode className="text-4xl text-green-700" />,
    },
    {
        title: "Frontend Developer",
        desc: "Creating visually appealing and user-friendly interfaces.",
        icon: <FaPaintBrush className="text-4xl text-green-700" />,
    },
    {
        title: "Backend Development",
        desc: "Developing robust server-side applications with Node.js and Express.",
        icon: <FaDatabase className="text-4xl text-green-700" />,
    },
    {
        title: "Database Management",
        desc: "Handling databases efficiently using MongoDB and modern tools.",
        icon: <SiMongodb className="text-4xl text-green-700" />,
    },
];

export const CONTACT_INFO = {
    phone: "+91-7367850872",
    email: "gkgudd860@gmail.com",
    location: "Bhopal, Madhya Pradesh, India",
    googleMapsUrl: "https://www.google.com/maps/place/Bhopal,+Madhya+Pradesh,+India",
};

export const SOCIAL_LINKS = [
    { icon: <FaGithub />, url: "https://github.com/GkGuddu", platform: "github" },
    { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/guddukr73/", platform: "linkedin" },
    { icon: <FaTwitter />, url: "https://x.com/SaahoGuddu?t=ixgdl4AUu5dn8ofpMoPqCA&s=09", platform: "twitter" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/__.itz_g_k73?igsh=MWVveTF5MnZjejM0MA==", platform: "instagram" },
];

export const RESUME_LINK = `${import.meta.env.BASE_URL}Resume.pdf`;
