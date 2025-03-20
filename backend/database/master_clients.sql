-- Use the database
USE candidateprofile;
CREATE TABLE master_clients (
  client_id INT PRIMARY KEY AUTO_INCREMENT,
  client_name VARCHAR(100) NOT NULL,
  address TEXT,
  contact_person VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SELECT * FROM master_clients; 

-- Only add these if you frequently search by these fields
CREATE INDEX idx_master_clients_email ON master_clients(email);
CREATE INDEX idx_master_clients_phone ON master_clients(phone);