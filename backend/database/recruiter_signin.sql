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
DELETE FROM recruiter_signin WHERE email = 'pushkarpiyush464@gmail.com' limit 1;
ALTER TABLE recruiter_signin
ADD COLUMN company_name VARCHAR(255);

ALTER TABLE recruiter_signin
ADD COLUMN client_id INT,
ADD COLUMN is_active BOOLEAN DEFAULT true,
ADD FOREIGN KEY (client_id) REFERENCES master_clients(client_id);

ALTER TABLE recruiter_signin
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

alter table recruiter_signin
drop column created_at

