-- Use the database
USE candidateprofile;

-- Create the candidate_profile table
CREATE TABLE candidate_profile (
    candidate_id INT, -- Unique identifier for the candidate (no longer a primary key)
    full_name VARCHAR(255) NOT NULL, -- Candidate's full name
    photo BLOB, -- Candidate's photo
    profile_last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Auto-updated on changes
    location VARCHAR(255), -- Candidate's location
    fresher_experience ENUM('Fresher', 'Experience') NOT NULL, -- Fresher or Experienced
    availability_to_join DATE, -- Joining date availability
    phone_no VARCHAR(15), -- Phone number
    email VARCHAR(255) UNIQUE NOT NULL, -- Candidate's unique email
    gender ENUM('Male', 'Female', 'Other'), -- Gender
    marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed'), -- Marital status
    dob DATE, -- Date of Birth
    category VARCHAR(255), -- Category (e.g., General, OBC, SC/ST)
    differently_abled ENUM('Yes', 'No'), -- Differently-abled status
    career_break TEXT, -- Career break details
    work_permit_to_usa ENUM('Yes', 'No'), -- Work permit for USA
    work_permit_to_country VARCHAR(255), -- Work permit for other countries
    permanent_address TEXT, -- Permanent address
    home_town VARCHAR(255), -- Home town
    pin_code VARCHAR(15), -- Pin code of address
    language_proficiency TEXT, -- Languages the candidate is proficient in
    current_industry VARCHAR(255), -- Current industry
    department VARCHAR(255), -- Department
    desired_job_type VARCHAR(255), -- Desired job type (e.g., IT, HR, etc.)
    desired_employment_type VARCHAR(255), -- Desired employment type (e.g., Full-time, Freelance)
    preferred_shift VARCHAR(255), -- Preferred shift (e.g., Day, Night)
    preferred_work_location VARCHAR(255), -- Preferred location for work
    expected_salary VARCHAR(50), -- Expected salary
    current_employment ENUM('Employed', 'Unemployed'), -- Employment status
    employment_type ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'), -- Employment type
    current_company_name VARCHAR(255), -- Current company
    current_job_title VARCHAR(255), -- Current job title
    joining_date DATE, -- Joining date
    current_salary VARCHAR(50), -- Current salary
    skill_used TEXT, -- Skills used in the current job
    job_profile TEXT, -- Job profile description
    notice_period VARCHAR(50), -- Notice period duration
    resume_headline TEXT, -- Resume headline
    resume_file BLOB, -- Resume file (in binary format)
    summary TEXT, -- Candidate's profile summary
    project_title VARCHAR(255), -- Project title
    client VARCHAR(255), -- Client details
    project_status ENUM('Ongoing', 'Completed', 'On Hold'), -- Project status
    start_date DATE, -- Project start date
    end_date DATE, -- Project end date
    work_duration VARCHAR(50), -- Duration of work on a project
    details_of_project TEXT, -- Details about the project
    software_name VARCHAR(255), -- Software name
    software_version VARCHAR(50), -- Software version
    certification_name VARCHAR(255), -- Certification name
    certification_url VARCHAR(2083), -- Certification URL
    work_title VARCHAR(255), -- Work sample title
    work_sample_url VARCHAR(2083), -- Work sample URL
    work_sample_description TEXT, -- Work sample description
    FOREIGN KEY (candidate_id) REFERENCES signin(candidate_id) -- Adding foreign key constraint
);
ALTER TABLE candidate_profile CHANGE full_name name VARCHAR(255) NOT NULL;
ALTER TABLE candidate_profile CHANGE phone_no phone VARCHAR(255) NOT NULL;
ALTER TABLE candidate_profile CHANGE resume_file resume VARCHAR(255) NOT NULL;
ALTER TABLE candidate_profile MODIFY COLUMN resume BLOB;

ALTER TABLE candidate_profile
MODIFY name VARCHAR(255) DEFAULT '';
ALTER TABLE candidate_profile
MODIFY email VARCHAR(255) DEFAULT '';
ALTER TABLE candidate_profile
MODIFY email VARCHAR(255);
ALTER TABLE candidate_profile MODIFY availability_to_join INT;
ALTER TABLE candidate_profile MODIFY availability_to_join varchar(255);
ALTER TABLE candidate_profile
ADD COLUMN key_skills VARCHAR(255),
ADD COLUMN experience_in_year INT,
ADD COLUMN experience_in_months INT,
ADD COLUMN education_level VARCHAR(255),
ADD COLUMN university VARCHAR(255),
ADD COLUMN course VARCHAR(255),
ADD COLUMN specialization VARCHAR(255),
ADD COLUMN coursestart_year INT,
ADD COLUMN courseend_year INT,
ADD COLUMN it_skills VARCHAR(255),
ADD COLUMN it_skills_proficiency VARCHAR(255),
ADD COLUMN project_titles VARCHAR(255),
ADD COLUMN technology_used VARCHAR(255),
ADD COLUMN project_start_date DATE,
ADD COLUMN project_end_date DATE,
ADD COLUMN profile_summary TEXT;

ALTER TABLE candidate_profile
ADD COLUMN online_profile TEXT,
ADD COLUMN work_sample TEXT,
ADD COLUMN white_paper TEXT,
ADD COLUMN presentation TEXT,
ADD COLUMN patent TEXT,
ADD COLUMN certification TEXT;

ALTER TABLE candidate_profile
DROP COLUMN education_level,
DROP COLUMN university,
DROP COLUMN course,
DROP COLUMN specialization,
DROP COLUMN coursestart_year,
DROP COLUMN courseend_year,
DROP COLUMN current_employment,
DROP COLUMN employment_type,
DROP COLUMN current_company_name,
DROP COLUMN current_job_title,
DROP COLUMN joining_date,
DROP COLUMN current_salary,
DROP COLUMN skill_used,
DROP COLUMN job_profile,
DROP COLUMN notice_period,
DROP COLUMN project_title,
DROP COLUMN client,
DROP COLUMN project_status,
DROP COLUMN start_date,
DROP COLUMN end_date,
DROP COLUMN work_duration,
DROP COLUMN details_of_project,
DROP COLUMN project_titles ,
DROP COLUMN experience_in_year,
DROP COLUMN experience_in_months,
DROP COLUMN technology_used,
DROP COLUMN project_start_date,
DROP COLUMN project_end_date;
ALTER TABLE candidate_profile 
DROP COLUMN key_skills,
DROP COLUMN it_skills, 
DROP COLUMN it_skills_proficiency;


SELECT * FROM candidate_profile;
SHOW CREATE TABLE candidate_profile;
DESCRIBE candidate_profile;
