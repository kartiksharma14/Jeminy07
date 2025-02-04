
-- Use the database
USE candidateprofile;
CREATE TABLE otpstore (
    email VARCHAR(255) PRIMARY KEY, -- Use email as the unique identifier
    otp VARCHAR(6) NOT NULL,
    otp_expiry DATETIME NOT NULL
);
DESCRIBE otpstore;
SELECT * FROM otpstore;
DELETE FROM otpstore WHERE  email = 'medhashrivastava9@gmail.com'; 
