-- Use the database
USE candidateprofile;
CREATE TABLE temporary_users (
    email VARCHAR(255) PRIMARY KEY,         -- Unique email to link with otpstore
    name VARCHAR(255) NOT NULL,     -- Candidate's full name
    phone VARCHAR(15) NOT NULL,   
    hashed_password VARCHAR(255) NOT NULL, -- Hashed password
    resume LONGBLOB,                       -- Optional resume file (binary)
    created_at DATETIME DEFAULT NOW()      -- Record creation time
);
DESCRIBE temporary_users;
SELECT * FROM temporary_users;
