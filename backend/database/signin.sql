USE candidateprofile;
CREATE TABLE signin (
  candidate_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  resume LONGBLOB
);
ALTER TABLE signin ADD COLUMN resume VARCHAR(255) NOT NULL;
ALTER TABLE signin MODIFY resume LONGBLOB;
ALTER TABLE signin CHANGE password hashed_password VARCHAR(255) NOT NULL;
ALTER TABLE signin ADD COLUMN last_login DATETIME DEFAULT NULL;
ALTER TABLE signin ADD COLUMN is_active TINYINT(1) DEFAULT 1;

SELECT * FROM signin; 
DESCRIBE signin;
INSERT INTO signin (name, email, phone, hashed_password, resume, last_login, is_active)
VALUES ('Test2', 'test25@email.com', '1234567890', 'hashed_password', 'resume_data',"2025-01-29 18:13:16",'1');
SHOW CREATE TABLE signin;
DELETE FROM signin WHERE candidate_id = 49;
SHOW COLUMNS FROM signin;
ALTER TABLE signin
DROP COLUMN otp;
ALTER TABLE signin
DROP COLUMN otp_expiry;

SELECT name, email, phone, LENGTH(resume) AS resume_size FROM signin;








