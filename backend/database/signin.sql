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
INSERT INTO signin (name, email, phone, password, resume, otp, otp_expiry)
VALUES ('TestName1', 'test1@email.com', '1234567890', 'hashed_password', 'resume_data', '123456', NOW());
SHOW CREATE TABLE signin;
DELETE FROM signin WHERE candidate_id = 49;
SHOW COLUMNS FROM signin;
ALTER TABLE signin
DROP COLUMN otp;
ALTER TABLE signin
DROP COLUMN otp_expiry;

INSERT INTO signin (name, email, phone, hashed_password, resume, last_login, is_active)
VALUES
  ('John Doe', 'john.doe@example.com', '1234567890', 'hashed_password_1', 'resume_data_1', '2025-01-29 18:13:16', 1),
  ('Jane Smith', 'jane.smith@example.com', '9876543210', 'hashed_password_2', 'resume_data_2', '2025-01-28 15:22:01', 1),
  ('Michael Johnson', 'michael.johnson@example.com', '5551234567', 'hashed_password_3', 'resume_data_3', '2025-01-27 12:10:45', 1),
  ('Emily Davis', 'emily.davis@example.com', '4449876543', 'hashed_password_4', 'resume_data_4', '2025-01-26 08:30:19', 1),
  ('Chris Lee', 'chris.lee@example.com', '3335551234', 'hashed_password_5', 'resume_data_5', '2025-01-25 20:40:02', 1),
  ('Olivia Brown', 'olivia.brown@example.com', '2226667890', 'hashed_password_6', 'resume_data_6', '2025-01-24 14:50:10', 1),
  ('David Wilson', 'david.wilson@example.com', '1117773456', 'hashed_password_7', 'resume_data_7', '2025-01-23 17:20:22', 1),
  ('Sophia White', 'sophia.white@example.com', '9998881234', 'hashed_password_8', 'resume_data_8', '2025-01-22 10:12:30', 1),
  ('William Harris', 'william.harris@example.com', '6664449876', 'hashed_password_9', 'resume_data_9', '2025-01-21 11:45:57', 1),
  ('Charlotte Walker', 'charlotte.walker@example.com', '1234567800', 'hashed_password_10', 'resume_data_10', '2025-01-20 09:30:43', 1),
  ('Alexander Scott', 'alexander.scott@example.com', '1234567801', 'hashed_password_11', 'resume_data_11', '2025-01-19 16:35:55', 1),
  ('Daniel Moore', 'daniel.moore@example.com', '2345678901', 'hashed_password_12', 'resume_data_12', '2025-01-18 13:25:18', 1),
  ('Mia King', 'mia.king@example.com', '3456789012', 'hashed_password_13', 'resume_data_13', '2025-01-17 12:05:44', 1),
  ('James Lee', 'james.lee@example.com', '4567890123', 'hashed_password_14', 'resume_data_14', '2025-01-16 10:15:32', 1),
  ('Isabella Taylor', 'isabella.taylor@example.com', '5678901234', 'hashed_password_15', 'resume_data_15', '2025-01-15 07:20:26', 1),
  ('Lucas Martinez', 'lucas.martinez@example.com', '6789012345', 'hashed_password_16', 'resume_data_16', '2025-01-14 16:32:59', 1),
  ('Amelia Rodriguez', 'amelia.rodriguez@example.com', '7890123456', 'hashed_password_17', 'resume_data_17', '2025-01-13 14:48:11', 1),
  ('Ethan Gonzalez', 'ethan.gonzalez@example.com', '8901234567', 'hashed_password_18', 'resume_data_18', '2025-01-12 13:05:09', 1),
  ('Grace Clark', 'grace.clark@example.com', '9012345678', 'hashed_password_19', 'resume_data_19', '2025-01-11 11:21:50', 1);


SELECT name, email, phone, LENGTH(resume) AS resume_size FROM signin;








