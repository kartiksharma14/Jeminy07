-- Use the database
USE candidateprofile;
CREATE TABLE cv_download_tracker (
    download_id INT PRIMARY KEY AUTO_INCREMENT,
    recruiter_id INT NOT NULL,
    client_id INT NOT NULL,
    candidate_id INT NOT NULL,
    download_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES recruiter_signin(recruiter_id),
    FOREIGN KEY (client_id) REFERENCES master_clients(client_id),
    INDEX idx_client_id (client_id),
    INDEX idx_recruiter_id (recruiter_id),
    INDEX idx_download_date (download_date)
);
SELECT * FROM cv_download_tracker; 

ALTER TABLE cv_download_tracker ADD COLUMN ip_address VARCHAR(45);