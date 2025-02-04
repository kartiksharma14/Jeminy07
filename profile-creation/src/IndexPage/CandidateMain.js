import React from 'react';
import CandidateHeader from './CandidateHeader';
import JobSearchBanner from './JobSearchBanner';
import JobSearchForm from './JobSearchForm';
import ResumeHelpBanner from './ResumeHelpBanner';
import TrendingJobs from './TrendingJobs';
import IndustryWidget from './IndustryWidget';
import PremiumCompanies from './PremiumCompanies';
import RoleCollection from './RoleCollection';
import SponsoredCompanies from './SponsoredCompanies';
import Footer from '../components/Footer';
import JeminyServices from './JeminyServices';
const CandidateMain = () => {
  return (
    <div>
      {/* Components will be added later */}
      <CandidateHeader /> 
      <JobSearchBanner/>
      <JobSearchForm/>
      <ResumeHelpBanner/>
      <TrendingJobs />
      <IndustryWidget/>
      <PremiumCompanies/>
      <RoleCollection/>
      <SponsoredCompanies/>
      <JeminyServices/>
      <Footer/>
    </div>
  );
};

export default CandidateMain;
