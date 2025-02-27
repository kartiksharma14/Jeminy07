// src/components/RoleCollection/RoleCollection.js

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { motion } from "framer-motion"; // For animations
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./RoleCollection.css";

function RoleCollection() {
  // Sample data for roles
  const roles = [
    {
      id: 1,
      name: "Full Stack Developer",
      jobCount: "18.7K+ Jobs",
      link: "",
    },
    {
      id: 2,
      name: "Mobile / App Developer",
      jobCount: "2.9K+ Jobs",
      link: "",
    },
    {
      id: 3,
      name: "Front End Developer",
      jobCount: "4.8K+ Jobs",
      link: "",
    },
    {
      id: 4,
      name: "DevOps Engineer",
      jobCount: "2.8K+ Jobs",
      link: "",
    },
    {
      id: 5,
      name: "Engineering Manager",
      jobCount: "1.4K+ Jobs",
      link: "",
    },
    {
      id: 6,
      name: "Technical Lead",
      jobCount: "10K+ Jobs",
      link: "",
    },
    {
      id: 7,
      name: "Automation Test Engineer",
      jobCount: "2.7K+ Jobs",
      link: "",
    },
    {
      id: 8,
      name: "Cyber Security",
      jobCount: "618 Jobs",
      link: "",
    },
    {
      id: 9,
      name: "Technical Architect",
      jobCount: "4.8K+ Jobs",
      link: "",
    },
    {
      id: 10,
      name: "Business Analyst",
      jobCount: "4.5K+ Jobs",
      link: "",
    },
    {
      id: 11,
      name: "Data Scientist",
      jobCount: "1.2K+ Jobs",
      link: "",
    },
    {
      id: 12,
      name: "Program Manager - Technology / IT",
      jobCount: "534 Jobs",
      link: "",
    },
    {
      id: 13,
      name: "Product Manager",
      jobCount: "969 Jobs",
      link: "",
    },
    {
      id: 14,
      name: "UI / UX Designer",
      jobCount: "1.6K+ Jobs",
      link: "",
    },
    {
      id: 15,
      name: "Research Analyst",
      jobCount: "149 Jobs",
      link: "",
    },
    {
      id: 16,
      name: "Branch Manager",
      jobCount: "376 Jobs",
      link: "",
    },
    {
      id: 17,
      name: "Functional Consultant",
      jobCount: "4K+ Jobs",
      link: "",
    },
    {
      id: 18,
      name: "Chartered Accountant (CA)",
      jobCount: "949 Jobs",
      link: "",
    },
  ];

  // Function to split roles into chunks of 6
  const chunkRoles = (rolesArray, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < rolesArray.length; i += chunkSize) {
      chunks.push(rolesArray.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const roleChunks = chunkRoles(roles, 6);

  // Animation variants for role chips
  const roleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <div className="role-collection-section" id="role-collection-wdgt">
      <div className="card-container">
        {/* Left Section */}
        <div className="left-section">
          <img
            src="https://img.freepik.com/free-vector/human-resources-managers-doing-professional-staff-research-with-magnifier-human-resources-hr-team-work-headhunter-service-concept-illustration_335657-2061.jpg?t=st=1739505113~exp=1739508713~hmac=e5c953877f19a600c59cfd16786ce808d532b85bf893c7f47f8bc416d426daca&w=900"
            className="role-img"
            alt=" role-collection"
            height="175"
            width="389"
          />
          <p className="heading">Discover jobs across popular roles</p>
          <p className="sub-heading">Select a role and we'll show you relevant jobs for it!</p>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {/* Swiper Slider */}
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            className="role-swiper"
          >
            {roleChunks.map((chunk, chunkIndex) => (
              <SwiperSlide key={chunkIndex}>
                <div className="role-grid">
                  {chunk.map((role, index) => (
                    <motion.div
                      className="role-chip"
                      key={role.id}
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={roleVariants}
                    >
                      <div className="chip-text">
                        <a href={role.link} className="chip-heading">
                          {role.name}
                        </a>
                        <p className="chip-count">
                          {role.jobCount}
                          <img
                            className="arrow-icon"
                            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/role-collection-wdgt/latest/assets/arrowImg.994f60e9.svg"
                            alt="arrow-icon"
                          />
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* View All Companies Link */}
      <a
        className="view-all-comp"
        href=""
        target="_blank"
        rel="noopener noreferrer"
      >
        View all companies
      </a>
    </div>
  );
}

export default RoleCollection;
