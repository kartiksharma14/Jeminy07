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
ALTER TABLE candidate_profile
MODIFY name VARCHAR(255) DEFAULT '';
ALTER TABLE candidate_profile
MODIFY email VARCHAR(255) DEFAULT '';
ALTER TABLE candidate_profile
MODIFY email VARCHAR(255);
ALTER TABLE candidate_profile MODIFY availability_to_join INT;
ALTER TABLE candidate_profile MODIFY availability_to_join VARCHAR(255);

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

INSERT INTO candidate_profile (
    candidate_id, name, photo, location, fresher_experience, availability_to_join, phone, email, gender, marital_status, dob, category, differently_abled, career_break, work_permit_to_usa, work_permit_to_country, permanent_address, home_town, pin_code, language_proficiency, current_industry, department, desired_job_type, desired_employment_type, preferred_shift, preferred_work_location, expected_salary, current_employment, employment_type, current_company_name, current_job_title, joining_date, current_salary, skill_used, job_profile, notice_period, resume_headline, resume, summary, project_title, client, project_status, start_date, end_date, work_duration, details_of_project, software_name, software_version, certification_name, certification_url, work_title, work_sample_url, work_sample_description
) VALUES
(1, 'John Doe', NULL, 'New York', 'Experience', '2025-06-01', '1234567890', 'john.doe@example.com', 'Male', 'Single', '1990-01-15', 'General', 'No', NULL, 'Yes', 'USA', '123 Elm St, New York, NY', 'New York', '10001', 'English, Spanish', 'IT', 'Software', 'Software Developer', 'Full-time', 'Day', 'New York', '100000', 'Employed', 'Full-time', 'ABC Corp', 'Software Engineer', '2021-01-01', '90000', 'Java, Python', 'Developing software applications', '30 days', 'Java Developer with expertise in backend systems', NULL, 'Summary of experience', 'Project A', 'Client A', 'Completed', '2023-01-01', '2023-12-31', '12 months', 'Developed backend for an e-commerce platform', 'Java', '11', 'Oracle Certified Java Developer', 'https://www.oracle.com', 'E-commerce Backend', 'https://www.example.com/sample', 'Worked on payment gateway integration'),
(2, 'Jane Smith', NULL, 'Los Angeles', 'Fresher', '2025-07-01', '1234567891', 'jane.smith@example.com', 'Female', 'Married', '1995-05-20', 'OBC', 'No', 'Personal growth', 'No', 'Canada', '456 Oak St, Los Angeles, CA', 'Los Angeles', '90001', 'English, French', 'Education', 'HR', 'HR Executive', 'Part-time', 'Night', 'Los Angeles', '60000', 'Unemployed', 'Part-time', 'XYZ Inc.', 'HR Coordinator', '2022-07-01', '50000', 'MS Office, HRMS', 'Managing HR records and recruitment', '15 days', 'Fresh graduate seeking HR opportunities', NULL, 'Profile picture and resume available', 'Project B', 'Client B', 'Ongoing', '2023-03-01', '2024-03-01', '12 months', 'Assisted in recruitment drives', 'MS Office', '365', 'HR Certification', 'https://www.hr.com', 'HR Development', 'https://www.example.com/sample', 'Worked on employee training programs'),
(3, 'Michael Johnson', NULL, 'Chicago', 'Experience', '2025-05-01', '1234567892', 'michael.johnson@example.com', 'Male', 'Single', '1992-08-30', 'General', 'No', 'Returned after break', 'Yes', 'UK', '789 Pine St, Chicago, IL', 'Chicago', '60001', 'English, German', 'Finance', 'Accounting', 'Financial Analyst', 'Full-time', 'Day', 'Chicago', '120000', 'Employed', 'Full-time', 'FinanceCo', 'Financial Analyst', '2019-05-01', '110000', 'Excel, QuickBooks', 'Analyzing financial data for investment decisions', '45 days', 'Financial analysis and market research', NULL, 'Looking for career growth', 'Project C', 'Client C', 'Completed', '2020-02-01', '2020-12-31', '10 months', 'Worked on financial analysis reports for clients', 'QuickBooks', '2019', 'Certified Financial Analyst', 'https://www.financial.com', 'Investment Report', 'https://www.example.com/sample', 'Performed financial analysis for clients'),
(4, 'Sarah Lee', NULL, 'San Francisco', 'Experience', '2025-08-01', '1234567893', 'sarah.lee@example.com', 'Female', 'Single', '1994-11-11', 'General', 'No', NULL, 'Yes', 'Australia', '101 Maple St, San Francisco, CA', 'San Francisco', '94016', 'English, Mandarin', 'Engineering', 'Software', 'Software Developer', 'Full-time', 'Day', 'San Francisco', '105000', 'Employed', 'Full-time', 'TechCorp', 'Software Developer', '2020-02-01', '95000', 'C++, Python', 'Developing and maintaining web applications', '30 days', 'Backend Developer with experience in Python', NULL, 'Passionate about software development', 'Project D', 'Client D', 'Ongoing', '2023-04-01', '2024-04-01', '12 months', 'Developed features for a cloud-based system', 'Python', '3.9', 'Certified Python Developer', 'https://www.python.org', 'Cloud Feature Development', 'https://www.example.com/sample', 'Worked on developing scalable cloud solutions'),
(5, 'Emily Davis', NULL, 'Miami', 'Fresher', '2025-09-01', '1234567894', 'emily.davis@example.com', 'Female', 'Single', '1997-07-15', 'SC', 'No', NULL, 'No', 'USA', '567 Cedar St, Miami, FL', 'Miami', '33101', 'English', 'Marketing', 'Advertising', 'Marketing Specialist', 'Full-time', 'Day', 'Miami', '70000', 'Unemployed', 'Full-time', 'Marketing Solutions', 'Marketing Coordinator', '2022-08-01', '60000', 'Digital marketing, SEO', 'Creating digital marketing strategies', '30 days', 'Looking for marketing growth opportunities', NULL, 'Certified Digital Marketer', 'Project E', 'Client E', 'Completed', '2022-01-01', '2022-12-31', '12 months', 'Worked on an SEO campaign for a retail client', 'Google Ads', '2022', 'Google Digital Marketing Certification', 'https://www.google.com', 'Marketing Strategy', 'https://www.example.com/sample', 'Managed paid ad campaigns'),
(6, 'David Miller', NULL, 'Dallas', 'Experience', '2025-06-01', '1234567895', 'david.miller@example.com', 'Male', 'Married', '1990-09-18', 'General', 'No', NULL, 'Yes', 'Canada', '678 Birch St, Dallas, TX', 'Dallas', '75201', 'English, French', 'Healthcare', 'Clinical', 'Clinical Researcher', 'Full-time', 'Day', 'Dallas', '90000', 'Employed', 'Full-time', 'HealthTech', 'Clinical Researcher', '2020-01-01', '85000', 'Research, Data Analysis', 'Conducting clinical research trials', '30 days', 'Research and analysis in clinical trials', NULL, 'Worked on clinical trials for pharmaceutical products', 'Project F', 'Client F', 'Ongoing', '2023-05-01', '2024-05-01', '12 months', 'Analyzed data for new clinical treatments', 'SPSS', '2021', 'Certified Clinical Research Professional', 'https://www.clinical.com', 'Clinical Trial Analysis', 'https://www.example.com/sample', 'Worked on clinical trials for a new drug'),
(7, 'Sophia Adams', NULL, 'Boston', 'Experience', '2025-05-15', '1234567896', 'sophia.adams@example.com', 'Female', 'Divorced', '1993-12-05', 'General', 'No', 'Career break', 'Yes', 'UK', '123 Oak St, Boston, MA', 'Boston', '02101', 'English', 'Sales', 'Retail', 'Sales Executive', 'Full-time', 'Day', 'Boston', '80000', 'Employed', 'Full-time', 'RetailCo', 'Sales Executive', '2020-06-01', '75000', 'Sales Management, Negotiation', 'Leading sales teams and negotiations', '45 days', 'Leadership in sales and business development', NULL, 'Increased sales for a retail company', 'Project G', 'Client G', 'Completed', '2021-03-01', '2021-12-31', '9 months', 'Developed a new sales strategy for retail products', 'Salesforce', '2020', 'Certified Sales Executive', 'https://www.sales.com', 'Retail Sales', 'https://www.example.com/sample', 'Worked on increasing retail sales'),
(8, 'Lucas Robinson', NULL, 'Seattle', 'Fresher', '2025-11-01', '1234567897', 'lucas.robinson@example.com', 'Male', 'Single', '1996-04-10', 'General', 'No', NULL, 'No', 'Australia', '890 Pine St, Seattle, WA', 'Seattle', '98101', 'English, Mandarin', 'Design', 'Graphic', 'Graphic Designer', 'Freelance', 'Night', 'Remote', '50000', 'Unemployed', 'Freelance', 'DesignPro', 'Freelance Graphic Designer', '2022-09-01', '45000', 'Photoshop, Illustrator', 'Creating visual concepts and designs', '30 days', 'Looking for freelance design opportunities', NULL, 'Online portfolio available', 'Project H', 'Client H', 'Ongoing', '2023-07-01', '2024-07-01', '12 months', 'Designed marketing materials for clients', 'Adobe', '2020', 'Adobe Certified Expert', 'https://www.adobe.com', 'Graphic Design', 'https://www.example.com/sample', 'Worked on digital artwork for campaigns'),
(9, 'Olivia Martinez', NULL, 'Atlanta', 'Experience', '2025-03-01', '1234567898', 'olivia.martinez@example.com', 'Female', 'Single', '1991-03-25', 'General', 'No', NULL, 'Yes', 'Germany', '345 Cedar St, Atlanta, GA', 'Atlanta', '30301', 'English, Spanish', 'Retail', 'Management', 'Retail Manager', 'Full-time', 'Day', 'Atlanta', '95000', 'Employed', 'Full-time', 'SuperMart', 'Retail Manager', '2019-08-01', '88000', 'Inventory Management, Sales', 'Managing store operations and sales', '30 days', 'Management and customer service experience', NULL, 'Increased sales and customer satisfaction', 'Project I', 'Client I', 'Completed', '2021-01-01', '2021-12-31', '12 months', 'Handled store operations for a retail chain', 'SAP', '2020', 'Retail Management Certification', 'https://www.retail.com', 'Store Operations', 'https://www.example.com/sample', 'Managed store and customer relations'),
(10, 'William Harris', NULL, 'San Diego', 'Experience', '2025-06-10', '1234567899', 'william.harris@example.com', 'Male', 'Married', '1987-07-30', 'OBC', 'No', 'Career transition', 'Yes', 'Canada', '890 Cedar St, San Diego, CA', 'San Diego', '92101', 'English, French', 'IT', 'Development', 'Java Developer', 'Full-time', 'Day', 'San Diego', '110000', 'Employed', 'Full-time', 'DevTech', 'Java Developer', '2021-02-01', '100000', 'Java, Spring Boot', 'Building backend services and APIs', '30 days', 'Experience in backend development', NULL, 'Developed microservices for clients', 'Project J', 'Client J', 'Completed', '2020-05-01', '2020-12-31', '7 months', 'Worked on Java-based backend services', 'Spring Boot', '2021', 'Spring Framework Certification', 'https://www.spring.io', 'Java Development', 'https://www.example.com/sample', 'Worked on microservices development'),
(11, 'Charlotte Walker', NULL, 'Phoenix', 'Fresher', '2025-07-10', '1234567800', 'charlotte.walker@example.com', 'Female', 'Single', '1999-01-21', 'SC', 'No', NULL, 'No', 'USA', '123 Birch St, Phoenix, AZ', 'Phoenix', '85001', 'English, Spanish', 'Education', 'Teaching', 'English Teacher', 'Full-time', 'Day', 'Phoenix', '48000', 'Unemployed', 'Full-time', 'EduCorp', 'English Teacher', '2023-08-01', '45000', 'English, Education', 'Teaching English as a second language', '15 days', 'Teaching English to non-native speakers', NULL, 'Worked with ESL students', 'Project K', 'Client K', 'Completed', '2024-01-01', '2024-12-31', '12 months', 'Taught English to students in Spain', 'Microsoft Word', '2022', 'TEFL Certification', 'https://www.tefl.com', 'Teaching English', 'https://www.example.com/sample', 'Taught English in an international school');
(12, 'Alexander Scott', NULL, 'Denver', 'Experience', '2025-10-01', '1234567801', 'alexander.scott@example.com', 'Male', 'Single', '1992-10-22', 'General', 'No', 'Returned from abroad', 'Yes', 'India', '890 Maple St, Denver, CO', 'Denver', '80201', 'English, Hindi', 'Engineering', 'Mechanical', 'Mechanical Engineer', 'Full-time', 'Day', 'Denver', '95000', 'Employed', 'Full-time', 'TechSolutions', 'Mechanical Engineer', '2019-02-01', '90000', 'AutoCAD, MATLAB', 'Designing mechanical components', '30 days', 'Seeking career advancement in engineering', NULL, 'Designed parts for new machinery', 'Project L', 'Client L', 'Completed', '2021-06-01', '2021-12-31', '6 months', 'Designed mechanical parts for manufacturing', 'AutoCAD', '2020', 'Mechanical Engineering Certification', 'https://www.autodesk.com', 'Mechanical Design', 'https://www.example.com/sample', 'Worked on CAD designs for machines');


-- After this, you can fetch candidate details based on candidate_id from the signin table.
SELECT * FROM candidate_profile;
SHOW CREATE TABLE candidate_profile;
