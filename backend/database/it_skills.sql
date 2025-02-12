-- Use the database
USE candidateprofile;
CREATE TABLE it_skills (
    itskills_id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT ,
    itskills_name VARCHAR(255) ,
    itskills_proficiency VARCHAR(255),
    FOREIGN KEY (candidate_id) REFERENCES candidate_profile(candidate_id)
        ON DELETE CASCADE
);

SELECT * FROM it_skills;

SELECT COUNT(*) FROM candidate_profile;
SELECT COUNT(*) FROM it_skills;
SELECT COUNT(*) FROM keyskills;


SELECT DISTINCT cp.candidate_id 
FROM candidate_profile cp
LEFT JOIN it_skills it ON cp.candidate_id = it.candidate_id
WHERE LOWER(it.itskills_name) NOT LIKE '%python%';