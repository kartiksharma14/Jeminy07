-- Use the database
USE candidateprofile;

CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    project_title VARCHAR(255),
    client VARCHAR(255),
    project_status VARCHAR(50),
    project_start_date DATE,
    project_end_date DATE,
    work_duration VARCHAR(100),
    technology_used VARCHAR(255),
    details_of_project TEXT,
    FOREIGN KEY (candidate_id) REFERENCES candidate_profile(candidate_id)
);
SELECT * FROM projects; 
