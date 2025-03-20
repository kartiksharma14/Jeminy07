-- Use the database
USE candidateprofile;

CREATE TABLE client_login_devices (
  device_id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  login_id VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES master_clients(client_id) ON DELETE CASCADE
);
-- Indexes
CREATE INDEX idx_client_login_devices_client_id ON client_login_devices(client_id);
CREATE INDEX idx_client_login_devices_login_id ON client_login_devices(login_id);
CREATE INDEX idx_client_login_devices_active ON client_login_devices(is_active);
CREATE INDEX idx_client_login_devices_last_login ON client_login_devices(last_login);

SELECT * FROM client_login_devices; 
