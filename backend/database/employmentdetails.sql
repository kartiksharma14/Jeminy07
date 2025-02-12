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
    current_salary DECIMAL(10, 2),
    skill_used TEXT,
    job_profile TEXT,
    notice_period VARCHAR(255),
    experience_in_year INT,
	experience_in_months INT,
    FOREIGN KEY (candidate_id) REFERENCES candidate_profile(candidate_id)
);
SELECT * FROM employmentdetails; 
