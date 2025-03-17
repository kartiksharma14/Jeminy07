-- Use the database
USE candidateprofile;
CREATE TABLE client_login_devices (
  device_id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  login_id VARCHAR(50) NOT NULL,
  user_agent TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES master_clients(client_id) ON DELETE CASCADE
);

SELECT * FROM client_login_devices; 