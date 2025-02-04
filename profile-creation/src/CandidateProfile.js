// CandidateProfile.js
import React from "react";
import Header from "./Header";
import ProfileDetails from "./ProfileDetails";
import QuickLinks from "./QuickLinks";
import Footer from "./components/Footer";

const CandidateProfile = () => {
  return (
    <>
      <Header />
      <ProfileDetails />
      <QuickLinks />
      <Footer />
    </>
  );
};

export default CandidateProfile;
