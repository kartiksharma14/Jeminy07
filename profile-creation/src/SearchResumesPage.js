import React from "react";
import SearchResumes from "./components/SearchResumes"; // Updated import
import RecruiterHeader from "./components/RecruiterHeader";
import RecruiterFooter from "./components/RecruiterFooter";
const SearchResumesPage = () => {
  return (
    <>
      <RecruiterHeader />
      <div className="search-resumes-page">
        <SearchResumes />
      </div>
      <RecruiterFooter />
    </>
  );
};

export default SearchResumesPage;
