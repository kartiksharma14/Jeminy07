-- Use the database
USE candidateprofile; 
CREATE TABLE `job_posts` (
  `job_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `jobTitle` varchar(255) NOT NULL,
  `employmentType` varchar(100) NOT NULL,
  `keySkills` text NOT NULL,
  `department` varchar(255) NOT NULL,
  `workMode` varchar(50) NOT NULL,
  `locations` varchar(255) NOT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `diversityHiring` tinyint(1) DEFAULT 0,
  `jobDescription` text NOT NULL,
  `multipleVacancies` tinyint(1) DEFAULT 0,
  `companyName` varchar(255) DEFAULT NULL,
  `companyInfo` text DEFAULT NULL,
  `companyAddress` text DEFAULT NULL,
  `min_salary` decimal(10,2) DEFAULT NULL,
  `max_salary` decimal(10,2) DEFAULT NULL,
  `min_experience` int(11) DEFAULT NULL,
  `max_experience` int(11) DEFAULT NULL,
  `job_creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4,
AUTO_INCREMENT = 1000000000;

ALTER TABLE job_posts ADD COLUMN recruiter_id INT NOT NULL;
ALTER TABLE job_posts
ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
ADD COLUMN approvedBy INT NULL;  -- Stores admin ID who approved it (NULL if pending)
ALTER TABLE job_posts
ADD COLUMN rejectedBy INT NULL AFTER approvedBy,
ADD COLUMN rejection_reason VARCHAR(255) NULL AFTER rejectedBy;
DESCRIBE job_posts;

SELECT * FROM job_posts; 






