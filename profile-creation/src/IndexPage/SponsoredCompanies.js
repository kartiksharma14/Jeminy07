// src/components/SponsoredCompanies/SponsoredCompanies.js

import React, { useState } from 'react';
import './SponsoredCompanies.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function SponsoredCompanies() {
  // State for selected filter
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Filter categories
  const filters = [
    { label: 'All', id: -1 },
    { label: 'IT Services', id: 11 },
    { label: 'Technology', id: 12 },
    { label: 'Manufacturing & Production', id: 7 },
    { label: 'Healthcare & Life Sciences', id: 4 },
    { label: 'BFSI', id: 2 },
    { label: 'Infrastructure, Transport & Real Estate', id: 8 },
    { label: 'Consumer, Retail & Hospitality', id: 6 },
    { label: 'BPM', id: 1 },
    { label: 'Professional Services', id: 3 },
    { label: 'Media, Entertainment & Telecom', id: 9 },
    // Add more filters if needed
  ];

  // Sample data for sponsored companies (Ensure all companies up to id: 23 are included)
// src/components/SponsoredCompanies/SponsoredCompanies.js

const companies = [
    {
      id: 1,
      name: 'Perforce',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/5206384.gif',
      rating: 3.8,
      reviews: '12 reviews',
      tags: ['Software Product', 'Foreign MNC'],
      link: 'https://www.naukri.com/perforce-overview-5206384?src=standardLogo',
    },
    {
      id: 2,
      name: 'Cyient',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/1030122.gif',
      rating: 3.7,
      reviews: '4.3K+ reviews',
      tags: ['Manufacturing', 'Fortune500', 'Indian MNC', 'B2B'],
      link: 'https://www.naukri.com/cyient-overview-1030122?src=standardLogo',
    },
    {
      id: 3,
      name: 'FactSet',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/4595261.gif',
      rating: 3.9,
      reviews: '1.4K+ reviews',
      tags: ['B2B', 'Internet', 'Software Product', 'Financial Services', 'Analytics / KPO / Research'],
      link: 'https://www.naukri.com/factset-overview-4595261?src=standardLogo',
    },
    {
      id: 4,
      name: 'DLF Services',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/4665617.gif',
      rating: null, // No rating available
      reviews: '21 reviews',
      tags: ['Real Estate'],
      link: 'https://www.naukri.com/dlf-services-overview-4665617?src=standardLogo',
    },
    {
      id: 5,
      name: 'Cardinal Health',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/4673837.gif',
      rating: 4.0,
      reviews: '145 reviews',
      tags: ['Fortune Global 500', 'Pharmaceutical & Life Sciences', 'Work-Life Balance'],
      link: 'https://www.naukri.com/cardinal-health-overview-4673837?src=standardLogo',
    },
    {
      id: 6,
      name: 'BOMAG India Private Limited',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/6965063.gif',
      rating: null,
      reviews: '6 reviews',
      tags: ['B2B', 'Foreign MNC', 'Industrial Equipment / Machinery'],
      link: 'https://www.naukri.com/bomag-india-private-limited-overview-6965063?src=standardLogo',
    },
    {
      id: 7,
      name: 'Spark Minda',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/3891958.gif',
      rating: 3.9,
      reviews: '1.6K+ reviews',
      tags: ['B2C', 'Public', 'Corporate', 'Automobile', 'Fortune India 500'],
      link: 'https://www.naukri.com/spark-minda-overview-3891958?src=standardLogo',
    },
    {
      id: 8,
      name: 'Lloyds Technology Centre',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/4702913.gif',
      rating: 3.5,
      reviews: '60 reviews',
      tags: ['Financial Services'],
      link: 'https://www.naukri.com/lloyds-technology-centre-overview-4702913?src=standardLogo',
    },
    {
      id: 9,
      name: 'Infosys',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/13832.gif',
      rating: 3.7,
      reviews: '37.6K+ reviews',
      tags: ['Fortune500', 'Forbes Global 2000', 'Indian MNC', 'IT Services & Consulting'],
      link: 'https://www.naukri.com/infosys-overview-13832?src=standardLogo',
    },
    {
      id: 10,
      name: 'Infosys BPM',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/191386.gif',
      rating: 3.7,
      reviews: '9.4K+ reviews',
      tags: ['BPM / BPO', 'TOP', 'B2B', 'Indian MNC'],
      link: 'https://www.naukri.com/infosys-bpm-overview-191386?src=standardLogo',
    },
    {
      id: 11,
      name: 'Encora',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/49980.gif',
      rating: 3.8,
      reviews: '692 reviews',
      tags: ['B2B', 'Private', 'Service', 'Foreign MNC', 'IT Services & Consulting'],
      link: 'https://www.naukri.com/encora-overview-49980?src=standardLogo',
    },
    {
      id: 12,
      name: 'Sopra Steria',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/1931748.gif',
      rating: 3.9,
      reviews: '1.7K+ reviews',
      tags: ['IT Services & Consulting', 'Foreign MNC', 'Conglomerate', 'Highly Rated by Women', 'B2B'],
      link: 'https://www.naukri.com/sopra-steria-overview-1931748?src=standardLogo',
    },
    {
      id: 13,
      name: 'Innova Solutions',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/778182.gif',
      rating: 3.4,
      reviews: '818 reviews',
      tags: ['IT Services & Consulting', 'Engineering & Construction', 'Private', 'B2B'],
      link: 'https://www.naukri.com/innova-solutions-overview-778182?src=standardLogo',
    },
    {
      id: 14,
      name: 'ALLIANZ SERVICES PRIVATE LIMITED',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/3595564.gif',
      rating: 4.3,
      reviews: '414 reviews',
      tags: ['Insurance', 'Indian MNC', 'Job Security', 'Work-Life Balance'],
      link: 'https://www.naukri.com/allianz-services-private-limited-overview-3595564?src=standardLogo',
    },
    {
      id: 15,
      name: 'R Systems International',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/3832032.gif',
      rating: 3.3,
      reviews: '988 reviews',
      tags: ['Analytics / KPO / Research', 'Foreign MNC', 'B2B'],
      link: 'https://www.naukri.com/r-systems-international-overview-3832032?src=standardLogo',
    },
    {
      id: 16,
      name: 'Opentext',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/4656015.gif',
      rating: 3.7,
      reviews: '992 reviews',
      tags: ['Software Product', 'Analytics / KPO / Research', 'Foreign MNC'],
      link: 'https://www.naukri.com/opentext-overview-4656015?src=standardLogo',
    },
    {
      id: 17,
      name: 'ABB',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/9400.gif',
      rating: 4.1,
      reviews: '2.6K+ reviews',
      tags: ['B2B', 'Public', 'Foreign MNC', 'Electrical Equipment'],
      link: 'https://www.naukri.com/abb-overview-9400?src=standardLogo',
    },
    {
      id: 18,
      name: 'Thermo Fisher Scientific',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/526200.gif',
      rating: 3.9,
      reviews: '802 reviews',
      tags: ['Foreign MNC', 'Biotech & Life sciences', 'Clinical Research / Contract Research'],
      link: 'https://www.naukri.com/thermo-fisher-scientific-overview-526200?src=standardLogo',
    },
    {
      id: 19,
      name: 'Lionbridge',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/121138.gif',
      rating: 3.7,
      reviews: '528 reviews',
      tags: ['Software Product', 'Content Development / Language', 'Foreign MNC'],
      link: 'https://www.naukri.com/lionbridge-overview-121138?src=standardLogo',
    },
    {
      id: 20,
      name: 'Altimetrik',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/2978732.gif',
      rating: 3.8,
      reviews: '1K+ reviews',
      tags: ['IT Services & Consulting', 'Service', 'Foreign MNC', 'B2B', 'TOP'],
      link: 'https://www.naukri.com/altimetrik-overview-2978732?src=standardLogo',
    },
    {
      id: 21,
      name: 'EPAM Systems',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/4592441.gif',
      rating: 3.8,
      reviews: '1.3K+ reviews',
      tags: ['IT Services & Consulting'],
      link: 'https://www.naukri.com/epam-systems-overview-4592441?src=standardLogo',
    },
    {
      id: 22,
      name: 'Backbase',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/5059810.gif',
      rating: null,
      reviews: '29 reviews',
      tags: ['Software Product', 'Foreign MNC'],
      link: 'https://www.naukri.com/backbase-overview-5059810?src=standardLogo',
    },
    {
      id: 23,
      name: 'Tesco',
      logo: 'https://img.naukimg.com/logo_images/groups/v1/24010.gif',
      rating: 3.9,
      reviews: '1.3K+ reviews',
      tags: ['B2B', 'Fortune Global 500', 'Textile & Apparel', 'Retail', 'Highly Rated by Women'],
      link: 'https://www.naukri.com/tesco-overview-24010?src=standardLogo',
    },
  ];
  

  // Function to handle filter selection
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter.label);
  };

  // Function to toggle showing all filters
  const toggleShowAllFilters = () => {
    setShowAllFilters((prev) => !prev);
  };

  // Filter companies based on selected filter
  const filteredCompanies =
    selectedFilter === 'All'
      ? companies
      : companies.filter((company) => company.tags.includes(selectedFilter));

  // Function to chunk companies array into groups of 6 (2 columns x 3 rows)
  const chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };

  const companyChunks = chunkArray(filteredCompanies, 6); // 6 companies per slide

  // Determine how many filters to show before collapsing
  const visibleFilterCount = 10;
  const visibleFilters = showAllFilters ? filters : filters.slice(0, visibleFilterCount);
  const hiddenFilterCount = filters.length - visibleFilterCount;

  return (
    <div id="standard-collection-wdgt" className="sponsored-companies-section">
      <div className="standard-collection-main">
        <h2 className="standard-collection-title">Sponsored companies</h2>

        {/* Filter Chips */}
        <div className="filter-sec">
          <div className={`filter-chips-wrap fold-fil ${showAllFilters ? 'expanded' : ''}`}>
            {visibleFilters.map((filter) => (
              <span
                key={filter.id}
                className={`filter-chips ${selectedFilter === filter.label ? 'sel-filter' : ''}`}
                filter-label={filter.label}
                filter-id={filter.id}
                onClick={() => handleFilterClick(filter)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleFilterClick(filter);
                }}
                aria-pressed={selectedFilter === filter.label}
              >
                {filter.label}
              </span>
            ))}
            {hiddenFilterCount > 0 && (
              <span
                className="filter-chips x-more"
                onClick={toggleShowAllFilters}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') toggleShowAllFilters();
                }}
                aria-expanded={showAllFilters}
              >
                {showAllFilters ? 'Show Less' : `+${hiddenFilterCount} more`}
              </span>
            )}
          </div>
        </div>

        {/* Swiper Slider */}
        <div className="standard-swiper-wrap">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            a11y={{
              prevSlideMessage: 'Previous slide',
              nextSlideMessage: 'Next slide',
              firstSlideMessage: 'This is the first slide',
              lastSlideMessage: 'This is the last slide',
            }}
          >
            {companyChunks.map((chunk, slideIndex) => (
              <SwiperSlide key={slideIndex}>
                <div className="standard-collection swiper-wrapper">
                  {chunk.map((company, index) => (
                    <div
                      className={`tuple standard ${index % 2 === 1 ? 'row-2' : ''}`}
                      data-href={company.link}
                      data-name={company.name}
                      data-val={company.id}
                      tabIndex={0}
                      id={company.id}
                      key={company.id}
                      onClick={() => window.open(company.link, '_blank')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') window.open(company.link, '_blank');
                      }}
                    >
                      <div className="imagewrap">
                        <img
                          src={company.logo}
                          alt={`${company.name} Logo`}
                          className="logoImage"
                          loading="lazy"
                        />
                      </div>
                      <div className="contentwrap">
                        <h3 className="main-4 title">
                          <a
                            className="compName ellipsis right-arrow"
                            href={company.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {company.name}
                          </a>
                        </h3>
                        <div className="additionalDetails">
                          {/* Render rating only if available */}
                          {company.rating !== null && (
                            <>
                              <span className="star">
                                <img
                                  src="//static.naukimg.com/s/7/0/assets/images/node_modules/@naukri-ui-dev/premiumstandardads/component/assets/star.0f830ab5.svg"
                                  alt="rating"
                                  className="starImage"
                                />
                              </span>
                              <span className="rating">{company.rating}</span>
                            </>
                          )}
                          {/* Render reviews only if available */}
                          {company.reviews && (
                            <span className="reviews">{company.reviews}</span>
                          )}
                        </div>
                        <div className="tagswrap">
                          {company.tags.map((tag, idx) => (
                            <span className="cardtag" key={idx}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View All Companies Link */}
        <a
          className="view-all-comp"
          href="https://www.naukri.com/allcompanies?searchType=standardLogo&title=Sponsored+companies&branding=%257B%2522pagename%2522%253A%2522ni-desktop-standard-viewAll%2522%257D&pageNo=1&qcount=47"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all companies
        </a>
      </div>
    </div>
  );
}

export default SponsoredCompanies;
