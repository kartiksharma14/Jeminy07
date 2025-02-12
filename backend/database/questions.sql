-- Use the database
USE candidateprofile;

CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED,
    question_one VARCHAR(255),
    question_two VARCHAR(255),
    question_three VARCHAR(255),
    question_four VARCHAR(255),
    question_five VARCHAR(255),
    FOREIGN KEY (job_id) REFERENCES job_post(job_id) 
    ON DELETE CASCADE
);
SELECT * FROM questions;