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
DELETE FROM temporary_users WHERE  email = 'piyushpushkar1001@gmail.com'; 
INSERT INTO temporary_users (`email`, `name`, `phone`, `hashed_password`, `resume`)
VALUES ('test@exawewle.com', 'John Doe', '1234567890', 'password123', '100');
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
INSERT INTO temporary_users (`email`, `name`, `phone`, `hashed_password`, `resume`)
VALUES ('test@exawewle.com', 'John Doe', '1234567890', 'password123', '0x25, 0x50, 0x44');
