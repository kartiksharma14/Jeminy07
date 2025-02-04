import React, { useState } from "react";
import "./RecruiterHeader.css";

const RecruiterHeader = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleMouseEnter = (menu) => {
        setOpenDropdown(menu); // Open the specific dropdown
    };

    const handleMouseLeave = (menu) => {
        if (openDropdown === menu) {
            setTimeout(() => {
                setOpenDropdown(null); // Close the dropdown after leaving
            }, 100); // Add a small delay for smoother interaction
        }
    };

    return (
        <header className="recruiter-header">
            {/* 1. Logo Section */}
            <div className="recruiter-header-left">
                <a href="/">
                    <img
                        src="https://github.com/kartiksharma14/photos/blob/main/STL_GSB_Blue.png?raw=true"
                        alt="Recruiter Logo"
                        className="recruiter-logo"
                    />
                </a>
            </div>

            {/* 2. Recruiter Header Center */}
            <nav className="recruiter-header-center">
                <div
                    className="nav-item-container"
                    onMouseEnter={() => handleMouseEnter("jobs")}
                    onMouseLeave={() => handleMouseLeave("jobs")}
                >
                    <div className="nav-title">Jobs & Responses</div>
                    {openDropdown === "jobs" && (
                        <div className="dropdown">
                            <a href="/post-job">Post a Hot Vacancy</a>
                            <a href="/post-internship">Post an Internship</a>
                            <a href="/post-classified">Post a Classified</a>
                            <a href="/manage-jobs">Manage Jobs & Responses</a>
                        </div>
                    )}
                </div>

                <div
                    className="nav-item-container"
                    onMouseEnter={() => handleMouseEnter("resdex")}
                    onMouseLeave={() => handleMouseLeave("resdex")}
                >
                    <div className="nav-title">Resdex</div>
                    {openDropdown === "resdex" && (
                        <div className="dropdown">
                            <a href="/search-resumes">Search Resumes</a>
                            <a href="/send-invite">Send Invite</a>
                            <a href="/manage-searches">Manage Searches</a>
                            <a href="/folders">Folders</a>
                            <a href="/requirements">Resdex Requirements</a>
                            <a href="/mail-center">Mail Center</a>
                            <a href="/email-templates">Email Templates</a>
                        </div>
                    )}
                </div>

                <div
                    className="nav-item-container"
                    onMouseEnter={() => handleMouseEnter("analytics")}
                    onMouseLeave={() => handleMouseLeave("analytics")}
                >
                    <div className="nav-title">Analytics</div>
                    {openDropdown === "analytics" && (
                        <div className="dropdown">
                            <a href="/job-posting">Job Posting</a>
                            <a href="/usage-reports">Usage Reports</a>
                            <a href="/nfl-report">NFL Report</a>
                            <a href="/mobile-solutions">Mobile Solutions</a>
                        </div>
                    )}
                </div>
            </nav>

            {/* 3. Search Bar */}
            <div class="search-bar-container">
                <div class="search-wrapper">
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Search for jobs, candidates, etc..."
                    />
                    <button class="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M11 4a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1116.32 5.91l4.4 4.4-1.42 1.42-4.4-4.4A9 9 0 012 11z"
                            />
                        </svg>
                    </button>
                </div>
            </div>


            {/* 4. Profile Section */}
            <div
                className="profile-container"
                onMouseEnter={() => handleMouseEnter("profile")}
                onMouseLeave={() => handleMouseLeave("profile")}
            >
                <div className="profile-trigger">
                    <img
                        src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                        alt="Recruiter Profile"
                        className="profile-image"
                    />
                    <span className="profile-name">Kartik</span>
                </div>
                {openDropdown === "profile" && (
                    <div className="dropdown profile-dropdown">
                        <a href="/product-settings">Product Settings</a>
                        <a href="/change-password">Change Password</a>
                        <a href="/faqs">FAQs</a>
                        <a href="/usage-guidelines">Usage Guidelines</a>
                        <a href="/logout">Logout</a>
                    </div>
                )}
            </div>
        </header>
    );
};

export default RecruiterHeader;
