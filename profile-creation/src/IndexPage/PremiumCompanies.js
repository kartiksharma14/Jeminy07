// src/components/PremiumCompanies/PremiumCompanies.js

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { motion } from "framer-motion"; // For animations
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "./PremiumCompanies.css";

function PremiumCompanies() {
  // Sample data for companies
  const companies = [
    {
      id: 4675515,
      name: "Empower",
      logo: "https://img.naukimg.com/logo_images/groups/v2/4675515.gif",
      rating: "3.8",
      reviews: "262 reviews",
      description: "We’re a financial services company.",
      jobsLink: "https://www.naukri.com/empower-overview-4675515?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/empower-overview-4675515?src=premiumLogo",
      color: "rgba(224, 25, 55, 0.03)",
    },
    {
      id: 4847169,
      name: "Optum",
      logo: "https://img.naukimg.com/logo_images/groups/v2/4847169.gif",
      rating: "4.0",
      reviews: "4K+ reviews",
      description: "Leading digital health tech company in India.",
      jobsLink: "https://www.naukri.com/optum-overview-4847169?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/optum-overview-4847169?src=premiumLogo",
      color: "rgba(255, 97, 43, 0.03)",
    },
    {
      id: 2095704,
      name: "Jio",
      logo: "https://img.naukimg.com/logo_images/groups/v2/2095704.gif",
      rating: "3.9",
      reviews: "22K+ reviews",
      description: "True 5G is here to unlock the limitless era.",
      jobsLink: "https://www.naukri.com/jio-overview-2095704?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/jio-overview-2095704?src=premiumLogo",
      color: "rgba(15, 60, 201, 0.03)",
    },
    {
      id: 9558,
      name: "Nagarro",
      logo: "https://img.naukimg.com/logo_images/groups/v2/9558.gif",
      rating: "4.0",
      reviews: "4K+ reviews",
      description: "Leader in digital product engineering.",
      jobsLink: "https://www.naukri.com/nagarro-overview-9558?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/nagarro-overview-9558?src=premiumLogo",
      color: "rgba(19, 41, 75, 0.03)",
    },
    {
      id: 3835862,
      name: "Persistent",
      logo: "https://img.naukimg.com/logo_images/groups/v2/3835862.gif",
      rating: "3.5",
      reviews: "3.7K+ reviews",
      description: "Trusted global solutions company.",
      jobsLink: "https://www.naukri.com/persistent-overview-3835862?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/persistent-overview-3835862?src=premiumLogo",
      color: "rgba(253, 95, 7, 0.03)",
    },
    {
      id: 4702913,
      name: "Lloyds Technology Centre",
      logo: "https://img.naukimg.com/logo_images/groups/v2/4702913.gif",
      rating: "3.5",
      reviews: "60 reviews",
      description: "A tech and data company.",
      jobsLink: "https://www.naukri.com/lloyds-technology-centre-overview-4702913?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/lloyds-technology-centre-overview-4702913?src=premiumLogo",
      color: "rgba(0, 124, 67, 0.03)",
    },
    {
      id: 126896,
      name: "Airtel",
      logo: "https://img.naukimg.com/logo_images/groups/v2/126896.gif",
      rating: "4.1",
      reviews: "24.4K+ reviews",
      description: "World's largest Internet company.",
      jobsLink: "https://www.naukri.com/amazon-overview-398058?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/amazon-overview-398058?src=premiumLogo",
      color: "rgba(244, 117, 36, 0.03)",
    },
    {
      id: 29798,
      name: "Reliance Industries (RIL)",
      logo: "https://img.naukimg.com/logo_images/groups/v2/29798.gif",
      rating: "4.0",
      reviews: "15.4K+ reviews",
      description: "Indian multinational conglomerate company.",
      jobsLink: "https://www.naukri.com/reliance-industries-ril-overview-29798?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/reliance-industries-ril-overview-29798?src=premiumLogo",
      color: "rgb(255, 255, 255)", // No background color
    },
    {
      id: 398058,
      name: "Amazon",
      logo: "https://img.naukimg.com/logo_images/groups/v2/398058.gif",
      rating: "4.1",
      reviews: "24.4K+ reviews",
      description: "World's largest Internet company.",
      jobsLink: "https://www.naukri.com/amazon-overview-398058?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/amazon-overview-398058?src=premiumLogo",
      color: "rgba(237, 29, 37, 0.03)",
    },
    {
      id: 214440,
      name: "Reliance Retail",
      logo: "https://img.naukimg.com/logo_images/groups/v2/214440.gif",
      rating: "3.9",
      reviews: "21.7K+ reviews",
      description: "Building India's largest retail company",
      jobsLink: "https://www.naukri.com/reliance-retail-overview-214440?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/reliance-retail-overview-214440?src=premiumLogo",
      color: "rgba(238, 28, 46, 0.03)",
    },
    {
      id: 162228,
      name: "Firstsource",
      logo: "https://img.naukimg.com/logo_images/groups/v2/162228.gif",
      rating: "3.7",
      reviews: "4.4K+ reviews",
      description: "Leading provider of transformational solutions.",
      jobsLink: "https://www.naukri.com/firstsource-overview-162228?tab=jobs&src=premiumLogo",
      overviewLink: "https://www.naukri.com/firstsource-overview-162228?src=premiumLogo",
      color: "rgba(244, 117, 36, 0.03)",
    },
    // Add more companies as needed
  ];

  // Animation variants for company cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  return (
    <div className="premium-companies-section" id="premium-collection-wdgt">
      <div className="premium-collection-main">
        <h2 className="premium-companies-title">Featured companies actively hiring</h2>
        
        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-chips-wrap">
            {/* Add more filter chips as needed */}
          </div>
          <div className="filter-more-chips">+ more</div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, FreeMode]}
          navigation
          freeMode
          spaceBetween={20}
          slidesPerView={3}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="premium-swiper"
        >
          {companies.map((company, index) => (
            <SwiperSlide key={company.id}>
              <motion.div
                className="company-card"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                style={{ backgroundColor: company.color }}
                tabIndex="0"
              >
                <div className="image-wrap">
                  <img src={company.logo} alt={company.name} className="logo-image" loading="lazy" />
                </div>
                <div className="content-wrap">
                  <h3 className="company-title">
                    <a href={company.overviewLink} className="company-name">
                      {company.name}
                    </a>
                  </h3>
                  <div className="additional-details">
                    <span className="star">
                      <img src="//static.naukimg.com/s/7/0/assets/images/node_modules/@naukri-ui-dev/premiumstandardads/component/assets/star.0f830ab5.svg" alt="rating" className="star-image" />
                    </span>
                    <span className="rating">{company.rating}</span>
                    <span className="reviews">{company.reviews}</span>
                  </div>
                </div>
                <div className="ad-desc-wrap">
                  <p className="ad-desc">{company.description}</p>
                </div>
                <div className="cta-wrap">
                  <a href={company.jobsLink} className="cta-button" target="_blank" rel="noopener noreferrer">
                    View jobs
                  </a>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All Companies Link */}
        <a className="view-all-companies" href="https://www.naukri.com/allcompanies?searchType=premiumLogo&title=Featured+companies+actively+hiring&branding=%257B%2522pagename%2522%253A%2522ni-desktop-premium-viewAll%2522%257D&pageNo=1&qcount=47" target="_blank" rel="noopener noreferrer">
          View all companies
        </a>
      </div>
    </div>
  );
}

export default PremiumCompanies;
