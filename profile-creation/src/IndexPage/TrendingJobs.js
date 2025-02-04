// src/components/TrendingJobs/TrendingJobs.js

import React from "react";
import "./TrendingJobs.css"; // Import the corresponding CSS

function TrendingJobs() {
  return (
    <div className="naukri-trending-container">
      <div className="ntc__chips-row">
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/remote-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="Remote"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/remoteonetheme.svg"
            alt="Remote-img"
          />
          <span className="ntc__chip-label" title="Remote">
            Remote
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
        {/* Repeat similar structure for other chips */}
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/mnc-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="MNC"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/mnconetheme.svg"
            alt="MNC-img"
          />
          <span className="ntc__chip-label" title="MNC">
            MNC
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/fresher-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="Fresher"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/freshersonetheme.svg"
            alt="Fresher-img"
          />
          <span className="ntc__chip-label" title="Fresher">
            Fresher
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/jobs-in-india?qctopCompany=247&clusters=qctopCompany&src=discovery_trendingWdgt_homepage_srch"
          title="Fortune 500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/fortune-500onetheme.svg"
            alt="Fortune 500-img"
          />
          <span className="ntc__chip-label" title="Fortune 500">
            Fortune 500
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/supply-chain-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="Supply Chain"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/supplychainonetheme.svg"
            alt="Supply Chain-img"
          />
          <span className="ntc__chip-label" title="Supply Chain">
            Supply Chain
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/internship-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="Internship"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/internshiponetheme.svg"
            alt="Internship-img"
          />
          <span className="ntc__chip-label" title="Internship">
            Internship
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
      </div>
      <div className="ntc__chips-row">
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/marketing-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="Marketing"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/marketingonetheme.svg"
            alt="Marketing-img"
          />
          <span className="ntc__chip-label" title="Marketing">
            Marketing
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/startup-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="Startup"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/startuponetheme.svg"
            alt="Startup-img"
          />
          <span className="ntc__chip-label" title="Startup">
            Startup
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/it-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="Software & IT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/softwareonetheme.svg"
            alt="Software & IT-img"
          />
          <span className="ntc__chip-label" title="Software & IT">
            Software & IT
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/analytics-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="Analytics"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/analyticsonetheme.svg"
            alt="Analytics-img"
          />
          <span className="ntc__chip-label" title="Analytics">
            Analytics
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
        <a
          className="ntc__chip-wrapper"
          href="https://www.naukri.com/engineering-jobs?src=discovery_trendingWdgt_homepage_srch"
          title="Engineering"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="ntc__chip-logo"
            src="https://static.naukimg.com/s/0/0/i/trending-naukri/engineeringonetheme.svg"
            alt="Engineering-img"
          />
          <span className="ntc__chip-label" title="Engineering">
            Engineering
          </span>
          <img
            className="ntc__chip-arrow"
            src="//static.naukimg.com/s/7/0/assets/images/src/widgets/trending-naukri-wdgt/latest/assets/arrow.2b55815e.svg"
            alt="arrow-icon"
          />
        </a>
      </div>
    </div>
  );
}

export default TrendingJobs;
