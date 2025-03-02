-- Use the database
USE candidateprofile;
CREATE TABLE `temp_job_posts` (
  `temp_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
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
  `created_by` bigint(20) DEFAULT NULL,
  `expiry_time` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`temp_id`),
  INDEX `idx_session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT * FROM temp_job_posts;