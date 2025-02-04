import React from "react";
import "./CandidateHeader.css";

function CandidateHeader() {
  return (
    <div className="nI-gNb-header">
      {/* Placeholder for sticky effect */}
      <div className="nI-gNb-header__placeholder"></div>

      {/* Main Wrapper */}
      <div className="nI-gNb-header__wrapper">
        
        {/* Logo Section */}
        <a
          className="nI-gNb-header__logo nI-gNb-company-logo"
          href="https://www.naukri.com"
          alt="Naukri Logo"
        >
          <img
            src="https://github.com/kartiksharma14/photos/blob/main/logo%203.PNG?raw=true"
            alt="Naukri Logo"
          />
        </a>

        {/* Navigation Section */}
        <nav>
          <ul className="nI-gNb-menus">
            {/* Jobs Menu */}
            <li className="nI-gNb-menuItems">
              <a
                className="nI-gNb-menuItems__anchorDropdown"
                title="Search Jobs"
                href="#"
              >
                <div>Jobs</div>
              </a>
              <div className="nI-gNb-dropdown nI-gNb-dropdown__c3 nI-gNb-Jobs">
                <ul className="nI-gNb-dropdownMenuGroup">
                  <li>
                    <a className="nI-gNb-header1__headerAnchor">Popular Categories</a>
                  </li>
                  <li className="nI-gNb-menuItems">
                    <a href="https://www.naukri.com/it-jobs" title="IT Jobs">
                      <div>IT Jobs</div>
                    </a>
                  </li>
                  {/* Add other job categories similarly */}
                </ul>

                <ul className="nI-gNb-dropdownMenuGroup">
                  <li>
                    <a className="nI-gNb-header1__headerAnchor">Jobs in Demand</a>
                  </li>
                  <li className="nI-gNb-menuItems">
                    <a href="https://www.naukri.com/fresher-jobs" title="Fresher Jobs">
                      <div>Fresher Jobs</div>
                    </a>
                  </li>
                  {/* Add other jobs in demand similarly */}
                </ul>

                <ul className="nI-gNb-dropdownMenuGroup">
                  <li>
                    <a className="nI-gNb-header1__headerAnchor">Jobs by Location</a>
                  </li>
                  <li className="nI-gNb-menuItems">
                    <a href="https://www.naukri.com/jobs-in-delhi-ncr" title="Jobs in Delhi">
                      <div>Jobs in Delhi</div>
                    </a>
                  </li>
                  {/* Add other jobs by location similarly */}
                </ul>
              </div>
            </li>

            {/* Companies Menu */}
            <li className="nI-gNb-menuItems">
              <a
                className="nI-gNb-menuItems__anchorDropdown"
                title="Explore top companies hiring on Naukri"
                href="#"
              >
                <div>Companies</div>
              </a>
              <div className="nI-gNb-dropdown nI-gNb-dropdown__c3 nI-gNb-Companies">
                <ul className="nI-gNb-dropdownMenuGroup">
                  <li>
                    <a className="nI-gNb-header1__headerAnchor">Explore Categories</a>
                  </li>
                  <li className="nI-gNb-menuItems">
                    <a href="https://www.naukri.com/unicorn-companies-in-india-cat102" title="Unicorn">
                      <div>Unicorn</div>
                    </a>
                  </li>
                  {/* Add other company categories similarly */}
                </ul>

                <ul className="nI-gNb-dropdownMenuGroup">
                  <li>
                    <a className="nI-gNb-header1__headerAnchor">Explore Collections</a>
                  </li>
                  <li className="nI-gNb-menuItems">
                    <a href="https://www.naukri.com/companies-hiring-in-india" title="Top Companies">
                      <div>Top Companies</div>
                    </a>
                  </li>
                  {/* Add other collections similarly */}
                </ul>

                <ul className="nI-gNb-dropdownMenuGroup">
                  <li>
                    <a className="nI-gNb-header1__headerAnchor">
                      Research Companies
                      <span className="ambox-by nI-gNb-dropdown__by"> by</span>
                      <img
                        className="ambox-icon nI-gNb-dropdown__icon"
                        src="https://static.naukimg.com/s/0/0/i/ambitionBoxLogo.png"
                        height="14"
                        width="12"
                        alt="Ambitionbox"
                      />
                      <span className="ambox-text nI-gNb-dropdown__text"> Ambitionbox</span>
                    </a>
                  </li>
                  <li className="nI-gNb-menuItems">
                    <a href="https://www.ambitionbox.com/interviews" target="_blank" rel="noreferrer" title="Interview Questions">
                      <div>Interview Questions</div>
                    </a>
                  </li>
                  {/* Add other research links similarly */}
                </ul>
              </div>
            </li>

            {/* Services Menu */}
            <li className="nI-gNb-menuItems">
              <a
                className="nI-gNb-menuItems__anchorDropdown"
                title="Naukri FastForward- Resume Services"
                href="#"
              >
                <div>Services</div>
              </a>
              <div className="nI-gNb-dropdown nI-gNb-dropdown__c3 nI-gNb-Services">
                <ul className="nI-gNb-dropdownMenuGroup">
                  <li>
                    <a className="nI-gNb-header1__headerAnchor">Resume Writing</a>
                  </li>
                  <li className="nI-gNb-menuItems">
                    <a href="https://resume.naukri.com/resume-writing-services" target="_blank" rel="noreferrer" title="Text Resume">
                      <div>Text Resume</div>
                    </a>
                  </li>
                  {/* Add other resume services similarly */}
                </ul>

                <ul className="nI-gNb-dropdownMenuGroup">
                  <li>
                    <a className="nI-gNb-header1__headerAnchor">Find Jobs</a>
                  </li>
                  <li className="nI-gNb-menuItems">
                    <a href="https://resume.naukri.com/job-alerts-on-mobile-mail#jobmail" target="_blank" rel="noreferrer" title="Jobs4u">
                      <div>Jobs4u</div>
                    </a>
                  </li>
                  {/* Add other find job services similarly */}
                </ul>

                <ul className="nI-gNb-dropdownMenuGroup">
                  <li>
                    <a className="nI-gNb-header1__headerAnchor">Get Recruiter's Attention</a>
                  </li>
                  <li className="nI-gNb-menuItems">
                    <a href="https://resume.naukri.com/resume-display" target="_blank" rel="noreferrer" title="Resume Display">
                      <div>Resume Display</div>
                    </a>
                  </li>
                  {/* Add other recruiter attention services similarly */}
                </ul>
              </div>
            </li>
          </ul>
        </nav>

        {/* Login / Register */}
        <div className="nI-gNb-log-reg">
          <a
            title="Jobseeker Login"
            href="/candidate/login"
            id="login_Layer"
            data-ga-track="Main Navigation Login|Login Icon"
            className="nI-gNb-lg-rg__login"
          >
            Login
          </a>
          <a
            title="Jobseeker Register"
            href="/candidate/signup"
            id="register_Layer"
            data-ga-track="Main Navigation Register|Register Icon"
            className="nI-gNb-lg-rg__register"
          >
            Register
          </a>
        </div>

        {/* For Employers */}
        <li className="nI-gNb-foremp nI-gNb-menuItems">
          <a className="nI-gNb-menuItems__anchorDropdown">
            <div className="for">
              For Employers
              <div className="ni-gnb-icn ni-gnb-icn-expand-more nI-gNb-menuIcon"></div>
            </div>
          </a>
          <div className="nI-gNb-dropdown nI-gNb-For employers">
            <ul className="nI-gNb-dropdownMenuGroup">
              <li className="nI-gNb-menuItems">
                <a href="https://www.naukri.com/recruit/buy-resume-database-access-packages" title="Buy Online">
                  <div>Buy Online</div>
                </a>
              </li>
              <li className="nI-gNb-menuItems">
                <a href="https://www.naukritalentcloud.com?utmSource=jobseekerGNB" title="Hiring Solutions">
                  <div>Naukri Talent Cloud</div>
                </a>
              </li>
              <li className="nI-gNb-menuItems">
                <a href="https://www.naukri.com/recruit/login" title="Employer Login">
                  <div>Employer Login</div>
                </a>
              </li>
            </ul>
          </div>
        </li>
      </div>
    </div>
  );
}

export default CandidateHeader;
