import React from 'react';
import './RecruiterHomeFooter.css';

const RecruiterHomeFooter = () => {
  return (
    <footer className="recruiter-home-footer">
      <div className="recruiter-home-footer-container">
        {/* Left Section: Logo and Social Links */}
        <div className="recruiter-home-footer-left">
          <a href="https://stl.tech" className="recruiter-home-footer-logo">
            <img
              src="https://github.com/kartiksharma14/photos/blob/main/logo%203.png?raw=true"
              alt="STL Logo"
              className="recruiter-home-footer-logo-img"
            />
          </a>
          {/* Connect with us block */}
          <div className="nI-gNb-followus">
            <span className="nI-gNb-heading" title="Connect with us">
              Connect with us
            </span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/Naukri"
              title="Follow Naukri.com on Facebook"
              data-ga-track="Footer Section|Facebook Link"
            >
              <img
                loading="lazy"
                alt="naukri social icons"
                src="https://static.naukimg.com/s/0/0/i/new-homepage/facebook.svg"
                height="18"
                width="18"
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://instagram.com/naukridotcom/"
              title="Follow Naukri.com on Instagram"
              data-ga-track="Footer Section|Instagram Link"
            >
              <img
                loading="lazy"
                alt="naukri social icons"
                src="https://static.naukimg.com/s/0/0/i/new-homepage/instagram.svg"
                height="18"
                width="18"
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/naukri"
              title="Follow Naukri.com on X"
              data-ga-track="Footer Section|Twitter Link"
            >
              <img
                loading="lazy"
                alt="naukri social icons"
                src="https://static.naukimg.com/s/0/0/i/new-homepage/twitter_v1.svg"
                height="18"
                width="18"
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.linkedin.com/company/naukri.com"
              title="Follow Naukri.com on LinkedIn"
              data-ga-track="Footer Section|LinkedIn Link"
            >
              <img
                loading="lazy"
                alt="naukri social icons"
                src="https://static.naukimg.com/s/0/0/i/new-homepage/linkedin.svg"
                height="18"
                width="18"
              />
            </a>
          </div>
        </div>

        {/* Right Section: Navigation Links */}
        <div className="recruiter-home-footer-right">
          <div className="recruiter-home-footer-column">
            <h4>About</h4>
            <ul>
              <li>
                <a
                  href="https://stl.tech/about-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://stl.tech/careers/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="https://stl.tech/sitemap/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
          <div className="recruiter-home-footer-column">
            <h4>Support</h4>
            <ul>
              <li>
                <a
                  href="https://stl.tech/help-center/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="https://stl.tech/grievances/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Grievances
                </a>
              </li>
              <li>
                <a
                  href="https://stl.tech/report-issue/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report Issue
                </a>
              </li>
            </ul>
          </div>
          <div className="recruiter-home-footer-column">
            <h4>Legal</h4>
            <ul>
              <li>
                <a
                  href="https://stl.tech/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://stl.tech/terms-and-conditions/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RecruiterHomeFooter;
