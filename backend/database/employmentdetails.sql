-- Use the database
USE candidateprofile;
 
 CREATE TABLE employmentdetails (
    employment_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    current_employment VARCHAR(255),
    employment_type VARCHAR(255),
    current_company_name VARCHAR(255),
    current_job_title VARCHAR(255),
    joining_date DATE,
    end_date DATE ,
    currently_working TINYINT(1) DEFAULT 0,
    current_salary DECIMAL(10, 2),
    skill_used TEXT,
    job_profile TEXT,
    notice_period VARCHAR(255),
    experience_in_year INT,
	experience_in_months INT,
    FOREIGN KEY (candidate_id) REFERENCES candidate_profile(candidate_id)
);

SELECT * FROM employmentdetails; 

ALTER TABLE employmentdetails
ADD COLUMN end_date DATE ,
ADD COLUMN currently_working TINYINT(1) DEFAULT 0;

ALTER TABLE employmentdetails
ADD COLUMN location VARCHAR(100) NULL,
ADD COLUMN department VARCHAR(100) NULL,
ADD COLUMN monthly_stipend DECIMAL(10, 2) NULL,
ADD COLUMN worked_till DATE NULL;

ALTER TABLE employmentdetails
ADD COLUMN previous_company_name VARCHAR(255) NULL,
ADD COLUMN previous_job_title VARCHAR(255) NULL;


ALTER TABLE employmentdetails 
DROP COLUMN joining_date,
DROP COLUMN end_date,
ADD COLUMN joining_year INT NULL,
ADD COLUMN joining_month INT NULL, 
ADD COLUMN worked_till_year INT NULL,
ADD COLUMN worked_till_month INT NULL;

alter table employmentdetails
drop COLUMN worked_till_year,
drop COLUMN worked_till_month ;

alter table employmentdetails
add column total_experiecne_in_months int null,
add column total_experiecne_in_years int null;


-- First, let's drop the misspelled columns
ALTER TABLE employmentdetails
DROP COLUMN total_experiecne_in_months,
DROP COLUMN total_experiecne_in_years;

-- Then add the correctly spelled columns
ALTER TABLE employmentdetails
ADD COLUMN total_experience_in_months INT NULL,
ADD COLUMN total_experience_in_years INT NULL;

alter table employmentdetails
drop column worked_till,
ADD COLUMN worked_till_year INT NULL,
ADD COLUMN worked_till_month INT NULL;