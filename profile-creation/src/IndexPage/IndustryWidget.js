// src/components/IndustryWidget/IndustryWidget.js

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Import Autoplay
import "swiper/css";
import "swiper/css/navigation";
import "./IndustryWidget.css"; // Import the corresponding CSS
import { FaArrowDown, FaArrowRight } from 'react-icons/fa';


function IndustryWidget() {
  return (
    <div className="naukri-industry-wdgt">
      <h2 className="headline">Top institutions hiring now</h2>
      <div className="industry-group">
      <Swiper
          modules={[Navigation, Autoplay]}
          loop={true} // Enable infinite looping
          autoplay={{ delay: 2000, disableOnInteraction: false }} // Auto-advance every 3 seconds
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          spaceBetween={16}
          slidesPerView={3}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
          }}
          className="industry-swiper-widget"
        >
          {/* Industry Card 1 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href=""
              title="MNCs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                <span className="industry-name">MNCs</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">2K+ are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4628235.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/178596.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1030122.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4615289.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 2 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href=""
              title="Product"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Product</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">1.1K+ are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1361674.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/2481740.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/5729808.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1526934.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 3 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href=""
              title="Banking & Finance"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Banking & Finance</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">376 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/44512.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/2610004.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4581931.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4587131.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 4 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href=""
              title="Hospitality"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Hospitality</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">91 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4703527.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4657871.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/2792480.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1527486.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 5 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href=""
              title="Fintech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Fintech</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">127 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/2353314.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1140566.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1945138.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4618933.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 6 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href="https://www.naukri.com/fmcg-and-retail-companies-in-india-cat113?title=FMCG+%26+Retail+companies+actively+hiring&src=discovery_orgExploreCompanies_homepage_srch"
              title="FMCG & Retail"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">FMCG & Retail</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">139 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4928699.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4657871.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/2792480.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/10482840.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 7 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href="https://www.naukri.com/startup-companies-in-india-cat103?title=Startups+actively+hiring&src=discovery_orgExploreCompanies_homepage_srch"
              title="Startups"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Startups</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">550 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/3248328.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4625319.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/2732072.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4876277.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 8 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href="https://www.naukri.com/edtech-companies-in-india-cat107?title=Edtech+companies+actively+hiring&src=discovery_orgExploreCompanies_homepage_srch"
              title="Edtech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Edtech</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">149 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4911705.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1329704.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4676811.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4988946.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 9 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href="https://www.naukri.com/healthcare-and-lifesciences-companies-in-india-cat111?title=Healthcare+%26+Lifesciences+companies+actively+hiring&src=discovery_orgExploreCompanies_homepage_srch"
              title="Healthcare"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Healthcare</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">590 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/423840.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1736558.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/492740.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/2454102.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 10 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href="https://www.naukri.com/unicorn-companies-in-india-cat102?title=Unicorns+actively+hiring&src=discovery_orgExploreCompanies_homepage_srch"
              title="Unicorns"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Unicorns</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">94 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1027760.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/2787840.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/509622.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/481500.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 11 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href="https://www.naukri.com/internet-companies-in-india-cat105?title=Internet+companies+actively+hiring&src=discovery_orgExploreCompanies_homepage_srch"
              title="Internet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Internet</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">230 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/884584.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/33324.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/538274.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/3128916.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 12 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href="https://www.naukri.com/manufacturing-companies-in-india-cat112?title=Manufacturing+companies+actively+hiring&src=discovery_orgExploreCompanies_homepage_srch"
              title="Manufacturing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Manufacturing</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">886 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4695323.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4590853.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/331978.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4614965.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 13 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href="https://www.naukri.com/fortune-500-companies-in-india-cat115?title=Fortune+500+actively+hiring&src=discovery_orgExploreCompanies_homepage_srch"
              title="Fortune 500"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">Fortune 500</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">114 are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/679286.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4635291.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/23222.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/30928.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>

          {/* Industry Card 14 */}
          <SwiperSlide className="tupple">
            <a
              className="industry-card"
              href="https://www.naukri.com/b2c-companies-in-india-cat104?title=B2C+companies+actively+hiring&src=discovery_orgExploreCompanies_homepage_srch"
              title="B2C"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="chip-heading-div">
                <span className="industry-name-wrapper">
                  <span className="industry-name">B2C</span>
                  <FaArrowRight class="arrow-icon" size={20} color="gray" />
                </span>
              </div>
              <span className="industry-company">2.3K+ are actively hiring</span>
              <div className="industry_widget_logos">
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4687033.gif"
                    className="companyLogo"
                    alt="Company Logo 1"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/4906855.gif"
                    className="companyLogo"
                    alt="Company Logo 2"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/565454.gif"
                    className="companyLogo"
                    alt="Company Logo 3"
                  />
                </div>
                <div className="chip-image">
                  <img
                    src="https://img.naukimg.com/logo_images/groups/v1/1473538.gif"
                    className="companyLogo"
                    alt="Company Logo 4"
                  />
                </div>
              </div>
            </a>
          </SwiperSlide>
        </Swiper>

        {/* Navigation Buttons */}
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    </div>
  );
}

export default IndustryWidget;
