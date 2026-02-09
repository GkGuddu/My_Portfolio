import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { SOCIAL_LINKS, CONTACT_INFO } from "../constants";

const Contact = () => {
  return (
    <>
      <section
        id="contact"
        className="w-full min-h-[90vh] flex items-center justify-center py-16 bg-gray-900"
      >
        <div className="w-[90%] flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left: Image */}
          <div
            className="w-full md:w-1/2 flex justify-center"
            data-aos="fade-right"
            data-aos-duration="1500"
          >
            <img
              src="/My_Portfolio/contact.png"
              alt="Contact"
              className="rounded-xl shadow-lg max-w-xs md:max-w-sm lg:max-w-md
                         transform hover:shadow-green-700/50
                         hover:bg-transparent hover:border-1 hover:border-green-700/50 hover:text-green-700/50 hover:shadow-[0_0_30px_#077b32] transition duration-200 hover:-translate-y-2 cursor-pointer"
            />
          </div>

          {/* Right: Contact Info */}
          <div className="w-full md:w-1/2 text-white space-y-6">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              Contact <span className="text-green-700">Me</span>
            </h2>
            <p className="text-gray-300 mb-6">
              If you have any questions or want to get in touch, feel free to
              contact me via email, phone, or visit my location. I’ll be happy to
              help you!
            </p>

            {/* Phone */}
            <div
              className="flex items-center gap-4 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
              data-aos="fade-left"
            >
              <FaPhoneAlt className="text-green-700 text-xl" />
              <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-green-400 transition-colors">
                {CONTACT_INFO.phone}
              </a>
            </div>

            {/* Email */}
            <div
              className="flex items-center gap-4 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <FaEnvelope className="text-green-700 text-xl" />
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-green-400 transition-colors">
                {CONTACT_INFO.email}
              </a>
            </div>

            {/* Location */}
            <div
              className="flex items-center gap-4 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <FaMapMarkerAlt className="text-green-700 text-xl" />
              <a
                href={CONTACT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors"
              >
                {CONTACT_INFO.location}
              </a>
            </div>

            {/* Working Hours */}
            <div
              className="flex items-center gap-4"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <FaClock className="text-green-700 text-xl" />
              <span>Monday – Friday: 9:00 am – 6:00 pm</span>
            </div>

            {/* Social Links */}
            <div className="flex mt-4 justify-center md:justify-start">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-black hover:scale-125 transition duration-200 mx-3 text-2xl"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-delay={1300 + index * 100}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Contact;
