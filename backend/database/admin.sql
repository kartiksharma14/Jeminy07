-- Use the database
USE candidateprofile;
CREATE TABLE admin (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) ,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

DESCRIBE admin;

SELECT * FROM admin;
INSERT INTO `admin` (`email`, `password`, `name`) VALUES ('admin2@example.com', 'admin123', 'Piyush');
