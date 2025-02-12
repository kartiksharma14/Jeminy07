-- Use the database
USE candidateprofile;
CREATE TABLE keyskills (
    keyskills_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    keyskillsname VARCHAR(255) NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidate_profile(candidate_id)
        ON DELETE CASCADE
);
SELECT * FROM keyskills;