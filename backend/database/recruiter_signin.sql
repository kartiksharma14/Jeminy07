-- Use the database
USE candidateprofile;
CREATE TABLE recruiter_signin (
    recruiter_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) 
);
SELECT * FROM recruiter_signin; 
SELECT password FROM recruiter_signin WHERE email = 'recruiter@example.com';
DELETE FROM recruiter_signin WHERE email = 'piyushrecruiter50@example.com';

