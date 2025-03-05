-- Use the database
USE candidateprofile;

CREATE TABLE temporary_recruiter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);
SELECT * FROM temporary_recruiter; 