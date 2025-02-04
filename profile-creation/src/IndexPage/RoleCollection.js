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
      link: "https://www.naukri.com/full-stack-developer-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 2,
      name: "Mobile / App Developer",
      jobCount: "2.9K+ Jobs",
      link: "https://www.naukri.com/mobile-application-development-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 3,
      name: "Front End Developer",
      jobCount: "4.8K+ Jobs",
      link: "https://www.naukri.com/front-end-developer-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 4,
      name: "DevOps Engineer",
      jobCount: "2.8K+ Jobs",
      link: "https://www.naukri.com/devops-engineer-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 5,
      name: "Engineering Manager",
      jobCount: "1.4K+ Jobs",
      link: "https://www.naukri.com/engineering-manager-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 6,
      name: "Technical Lead",
      jobCount: "10K+ Jobs",
      link: "https://www.naukri.com/technical-lead-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 7,
      name: "Automation Test Engineer",
      jobCount: "2.7K+ Jobs",
      link: "https://www.naukri.com/automation-test-engineer-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 8,
      name: "Cyber Security",
      jobCount: "618 Jobs",
      link: "https://www.naukri.com/cyber-security-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 9,
      name: "Technical Architect",
      jobCount: "4.8K+ Jobs",
      link: "https://www.naukri.com/technical-architect-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 10,
      name: "Business Analyst",
      jobCount: "4.5K+ Jobs",
      link: "https://www.naukri.com/business-analyst-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 11,
      name: "Data Scientist",
      jobCount: "1.2K+ Jobs",
      link: "https://www.naukri.com/data-scientist-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 12,
      name: "Program Manager - Technology / IT",
      jobCount: "534 Jobs",
      link: "https://www.naukri.com/technical-program-manager-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 13,
      name: "Product Manager",
      jobCount: "969 Jobs",
      link: "https://www.naukri.com/product-manager-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 14,
      name: "UI / UX Designer",
      jobCount: "1.6K+ Jobs",
      link: "https://www.naukri.com/ui-ux-designer-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 15,
      name: "Research Analyst",
      jobCount: "149 Jobs",
      link: "https://www.naukri.com/research-analyst-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 16,
      name: "Branch Manager",
      jobCount: "376 Jobs",
      link: "https://www.naukri.com/branch-manager-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 17,
      name: "Functional Consultant",
      jobCount: "4K+ Jobs",
      link: "https://www.naukri.com/functional-consultant-jobs?src=popular_roles_homepage_srch",
    },
    {
      id: 18,
      name: "Chartered Accountant (CA)",
      jobCount: "949 Jobs",
      link: "https://www.naukri.com/chartered-accountant-jobs?src=popular_roles_homepage_srch",
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
            src="https://static.naukimg.com/s/0/0/i/role-collection-ot.png"
            className="role-img"
            alt="naukri role-collection"
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
        href="https://www.naukri.com/allcompanies?searchType=premiumLogo&title=Featured+companies+actively+hiring&branding=%257B%2522pagename%2522%253A%2522ni-desktop-premium-viewAll%2522%257D&pageNo=1&qcount=47"
        target="_blank"
        rel="noopener noreferrer"
      >
        View all companies
      </a>
    </div>
  );
}

export default RoleCollection;
