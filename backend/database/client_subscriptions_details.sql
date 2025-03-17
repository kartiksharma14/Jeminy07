-- Use the database
USE candidateprofile;
CREATE TABLE client_subscriptions_details (
  subscription_id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  cv_download_quota INT NOT NULL,
  login_allowed INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES master_clients(client_id) ON DELETE CASCADE
);

SELECT * FROM client_subscriptions_details; 
