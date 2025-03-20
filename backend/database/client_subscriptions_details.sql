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

-- Speeds up queries that filter or join based on client_id
CREATE INDEX idx_client_subscriptions_client_id ON client_subscriptions_details(client_id);
-- Speeds up queries that filter for active/inactive subscriptions
CREATE INDEX idx_client_subscriptions_active ON client_subscriptions_details(is_active);
-- Speeds up date range queries for active subscriptions
CREATE INDEX idx_client_subscriptions_dates ON client_subscriptions_details(start_date, end_date);