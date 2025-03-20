import React from 'react';
import './Footer.css'; // Make sure to add appropriate CSS for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section: Logo and New Social Links */}
        <div className="footer-left">
          <a href="/homepage" className="footer-logo">
            <img
              src="https://github.com/kartiksharma14/photos/blob/main/logo%203.png?raw=true"
              alt="STL Logo"
              className="footer-logo-img"
            />
          </a>
          {/* New Social Media Block (below the logo) */}
          <div className="nI-gNb-followus">
            <a className="nI-gNb-heading-f" title="Connect with us">
              Connect with us
            </a>
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
        <div className="footer-right">
          <div className="footer-column">
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
          <div className="footer-column">
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
          <div className="footer-column">
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

export default Footer;
