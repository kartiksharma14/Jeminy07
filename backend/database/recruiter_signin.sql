-- Use the database
USE candidateprofile;
CREATE TABLE recruiter_signin (
    recruiter_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    designation VARCHAR(100)
);
SELECT * FROM recruiter_signin; 