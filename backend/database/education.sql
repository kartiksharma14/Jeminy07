-- Use the database
USE candidateprofile;
CREATE TABLE education (
    education_id INT AUTO_INCREMENT PRIMARY KEY, -- Primary key for unique identification
    candidate_id INT,                            -- Foreign key to reference the candidate
    education_level VARCHAR(255),               -- Level of education (e.g., Bachelor's, Master's)
    university VARCHAR(255),                    -- Name of the university
    course VARCHAR(255),                        -- Name of the course
    specialization VARCHAR(255),                -- Specialization (optional)
    coursestart_year YEAR,                      -- Start year of the course
    courseend_year YEAR,                        -- End year of the course
    FOREIGN KEY (candidate_id) REFERENCES candidate_profile(candidate_id)
	ON DELETE CASCADE                       -- Delete education records if the candidate is deleted
);
SELECT * FROM education; 
