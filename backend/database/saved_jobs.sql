-- Use the database
USE candidateprofile;
CREATE TABLE `saved_jobs` (
  `saved_job_id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` VARCHAR(255) NOT NULL,
  `candidate_id` INT NOT NULL,
  `saved_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM saved_jobs;