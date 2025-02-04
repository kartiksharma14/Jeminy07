import React from 'react';
import './JeminyServices.css';

const JeminyServices = () => {
  return (
    <div className="ff-services-wdgt">
      <div className="card-container-resume">
        {/* Image Section */}
        <div className="one">
          <img 
            src="https://static.naukimg.com/s/0/0/i/ff-services-ot.png" 
            className="left-image" 
            alt="Fast forward naukri services" 
            height="120" 
            width="132"
          />
        </div>

        {/* Content Section */}
        <div className="two">
          <h3 className="headline">Accelerate your job search with premium services</h3>
          <p className="sub-headline">
            Services to help you get hired, faster: from preparing your CV, getting recruiter attention, finding the right jobs, and more!
          </p>
          <div className="buttons">
            <a 
              href="https://resume.naukri.com/mid-level-experienced-professionals-resume-writing?fftid=LoggedOutHomePage" 
              className="btn"
            >
              <img 
                className="btn-icons" 
                src="https://static.naukimg.com/s/0/0/i/ff-services-icon2-ot.svg" 
                alt="button-icon"
              /> 
              <span className="btn-text">Resume writing</span> 
              <img 
                className="arrow-icon" 
                src="//static.naukimg.com/s/7/0/assets/images/src/widgets/ff-services-wdgt/latest/assets/arrowImg.2a8a6c78.svg" 
                alt="arrow-icon"
              />
            </a>
            <a 
              href="https://resume.naukri.com/priority-job-application?fftid=LoggedOutHomePage" 
              className="btn"
            >
              <img 
                className="btn-icons" 
                src="https://static.naukimg.com/s/0/0/i/ff-services-icon3-ot.svg" 
                alt="button-icon"
              /> 
              <span className="btn-text">Priority applicant</span> 
              <img 
                className="arrow-icon" 
                src="//static.naukimg.com/s/7/0/assets/images/src/widgets/ff-services-wdgt/latest/assets/arrowImg.2a8a6c78.svg" 
                alt="arrow-icon"
              />
            </a>
            <a 
              href="https://resume.naukri.com/resume-display?fftid=LoggedOutHomePage" 
              className="btn"
            >
              <img 
                className="btn-icons" 
                src="https://static.naukimg.com/s/0/0/i/ff-services-icon1-ot.svg" 
                alt="button-icon"
              /> 
              <span className="btn-text">Resume display</span> 
              <img 
                className="arrow-icon" 
                src="//static.naukimg.com/s/7/0/assets/images/src/widgets/ff-services-wdgt/latest/assets/arrowImg.2a8a6c78.svg" 
                alt="arrow-icon"
              />
            </a>
          </div>
        </div>

        {/* Ribbon Section */}
        <div className="three">
          <div className="ribbon">By Jeminy</div>
          <br></br>
          <a 
            className="btn2" 
            href="https://resume.naukri.com/?fftid=LoggedOutHomePage"
          >
            Learn more
          </a>
          <p className="sub-headline">Includes paid services</p>
        </div>
      </div>
    </div>
  );
};

export default JeminyServices; 
