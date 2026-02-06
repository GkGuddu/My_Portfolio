import React from "react";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-gray-400 py-4 flex justify-center items-center border-t border-gray-800">
            <p className="text-center text-sm md:text-base">
                &copy; {new Date().getFullYear()} Guddu Kumar. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
