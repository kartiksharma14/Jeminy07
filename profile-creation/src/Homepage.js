import React from "react";
import Header from "./Header";
import Footer from "./components/Footer";
import "./HomePage.css";

const HomePage = () => {
  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="user-details-inner fixed" style={{ top: '42px' }}>
          <div className="img-wrapper">
            <svg className="svg">
              <path
                className="bg"
                d="M40,90 A40,40 0 1,1 80,90"
                style={{ stroke: 'rgb(247, 247, 249)' }}
              ></path>
              <path
                className="meter"
                d="M40,90 A40,40 0 1,1 80,90"
                style={{ stroke: 'rgb(240, 65, 65)', strokeDashoffset: '338.4' }}
              ></path>
            </svg>
            <img
              loading="lazy"
              alt="profile"
              className="user-img"
              src="https://static.naukimg.com/s/0/0/i/ni-gnb-revamped/userdp.svg"
            />
          </div>
          <div className="name-wrapper">
            <div title="Kartik Sharma" className="info__heading">
              Kartik Sharma
            </div>
          </div>
          <ul className="tabs-ul">
            <li className="tabs-li highlighted">
              <img src="https://static.naukimg.com/s/9/105/_next/static/assets/home.svg" alt="home" />
              <span>My home</span>
            </li>
            <li className="tabs-li">
              <img src="https://static.naukimg.com/s/9/105/_next/static/assets/jobs.svg" alt="jobs" />
              <span>Jobs</span>
            </li>
          </ul>
          <div data-section="left-bottom" className="left-empty"></div>
        </div>
        <div className="left-section">
          {/* Left Sidebar Section */}
          {/* Additional content can be added here if needed */}
        </div>
        <div className="right-section">
          {/* Right Section */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
