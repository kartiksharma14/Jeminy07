-- Use the database
USE candidateprofile;
CREATE TABLE job_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    candidate_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'selected', 'rejected') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (job_id) REFERENCES job_posts(job_id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidate_profile(candidate_id) ON DELETE CASCADE
);

SELECT * FROM job_applications;