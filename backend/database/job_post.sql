-- Use the database
USE candidateprofile;
CREATE TABLE job_post (
    job_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(255),
    location VARCHAR(255),
    job_highlights VARCHAR(255),
    employment_type VARCHAR(100),
    key_skills TEXT,
    it_skills TEXT,
    education_level TEXT,
    department TEXT,
    role_category TEXT,
    work_mode VARCHAR(50),
    min_salary DECIMAL(10, 2),
    max_salary DECIMAL(10, 2),
    min_experience INT,
    max_experience INT,
    candidate_industry VARCHAR(255),
    diversity_hiring BOOLEAN,
    job_description TEXT,
    no_of_vacancy INT UNSIGNED,
    company_name VARCHAR(255),
    company_address TEXT,
    company_website VARCHAR(255),
    about_company TEXT,
    schedule_job_refresh DATETIME,
    job_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
	expiry_in_days INT,
	is_active BOOLEAN
) AUTO_INCREMENT = 1000000000;
 
SELECT * FROM job_post; 
