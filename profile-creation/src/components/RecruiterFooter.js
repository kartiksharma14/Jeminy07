import React from "react";
import "./RecruiterFooter.css";

const RecruiterFooter = () => {
    return (
        <footer className="recruiter-footer">
            <div className="footer-container">
                {/* Left Section */}
                <div className="footer-left">
                    <a href="https://stl.tech" className="footer-logo">
                        <img
                            alt="STL Logo"
                            className="footer-logo-img"
                            src="https://github.com/kartiksharma14/photos/blob/main/logo%203.png?raw=true"
                        />
                    </a>
                    <div className="footer-social-links">
                        <a
                            href="https://www.facebook.com/STL-Sterlite-Technologies-Limited-105715490969006/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a
                            href="https://www.instagram.com/stl.tech/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a
                            href="https://twitter.com/STL_tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a
                            href="https://www.linkedin.com/company/sterlite-technologies-ltd-/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>

                {/* Right Section */}
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
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Legal</h4>
                        <ul>
                            <li>
                                <a
                                    href="https://stl.tech/terms-and-conditions/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Terms & Conditions
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default RecruiterFooter;
