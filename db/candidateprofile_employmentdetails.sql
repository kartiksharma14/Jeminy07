-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: candidateprofile
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employmentdetails`
--

DROP TABLE IF EXISTS `employmentdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employmentdetails` (
  `employment_id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int DEFAULT NULL,
  `current_employment` varchar(255) DEFAULT NULL,
  `employment_type` varchar(255) DEFAULT NULL,
  `current_company_name` varchar(255) DEFAULT NULL,
  `current_job_title` varchar(255) DEFAULT NULL,
  `current_salary` decimal(10,2) DEFAULT NULL,
  `skill_used` text,
  `job_profile` text,
  `notice_period` varchar(255) DEFAULT NULL,
  `experience_in_year` int DEFAULT NULL,
  `experience_in_months` int DEFAULT NULL,
  `currently_working` tinyint(1) DEFAULT '0',
  `department` varchar(100) DEFAULT NULL,
  `monthly_stipend` decimal(10,2) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `previous_company_name` varchar(255) DEFAULT NULL,
  `previous_job_title` varchar(255) DEFAULT NULL,
  `joining_year` int DEFAULT NULL,
  `joining_month` int DEFAULT NULL,
  `total_experiecne_in_months` int DEFAULT NULL,
  `total_experiecne_in_years` int DEFAULT NULL,
  `total_experience_in_months` int DEFAULT NULL,
  `total_experience_in_years` int DEFAULT NULL,
  `worked_till_year` int DEFAULT NULL,
  `worked_till_month` int DEFAULT NULL,
  PRIMARY KEY (`employment_id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `employmentdetails_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profile` (`candidate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employmentdetails`
--

LOCK TABLES `employmentdetails` WRITE;
/*!40000 ALTER TABLE `employmentdetails` DISABLE KEYS */;
INSERT INTO `employmentdetails` VALUES (2,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,3,'Yes','Full-time','Innovative Tech Solutions','Software Developer',800000.00,'Java, Python','Backend Development','30',2,3,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,4,'Yes','Full-time','Financial Solutions Inc','Data Analyst',750000.00,'SQL, Power BI','Data Analysis','15',3,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,6,'Yes','Full-time','HealthTech Inc','ML Engineer',900000.00,'Python, TensorFlow','Machine Learning','20',2,6,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,7,'No','Internship','EduTech Solutions','Frontend Developer Intern',300000.00,'React, JavaScript','Frontend Development','0',0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,8,'Yes','Full-time','E-Commerce World','DevOps Engineer',950000.00,'Docker, Kubernetes','DevOps','30',4,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,9,'Yes','Full-time','Digital Marketers Pvt Ltd','Digital Marketing Manager',850000.00,'SEO, Google Ads','Marketing','15',3,2,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,10,'Yes','Full-time','Investment Bankers Inc','Financial Analyst',800000.00,'Excel, Tableau','Financial Analysis','30',4,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,11,'Yes','Full-time','Tech Research Labs','Academic Researcher',700000.00,'Python, R','Research','45',2,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,12,'Yes','Full-time','Healthcare Analytics','Healthcare Data Analyst',850000.00,'Python, SQL','Data Analysis','30',3,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,13,'Yes','Full-time','Startup Ventures','Full Stack Developer',950000.00,'React, Node.js','Software Development','30',2,6,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,14,'No','Internship','Digital Solutions','Backend Developer Intern',350000.00,'Django, SQL','Backend Development','0',0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,15,'Yes','Full-time','Manufacturing Corp','IoT Engineer',1000000.00,'Embedded C, MQTT','IoT Solutions','60',3,4,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,16,'No','Internship','Creative Designs','UI/UX Designer Intern',400000.00,'Figma, Adobe XD','UI/UX Design','0',0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,17,'Yes','Full-time','Risk Management Co','Risk Analyst',800000.00,'Excel, SAS','Risk Analysis','30',3,3,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,18,'Yes','Full-time','Healthcare Analytics Ltd','Bioinformatics Scientist',900000.00,'Python, R','Research','45',4,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,19,'Yes','Full-time','Cloud Innovations','Cloud Architect',1200000.00,'AWS, Azure, Kubernetes','Cloud Solutions','30',5,6,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,24,'No','Internship','Academic Innovations','Research Intern',250000.00,'Excel, SPSS','Research','0',0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,55,'Yes','Full-time','Global HR Solutions','HR Manager',850000.00,'HRMS, Payroll','HR Management','30',4,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,58,'Yes','Full-time','Google','Software Developer',1000000.00,'React,NodeJs,MySql','Full Developing','15',3,3,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,59,'Yes','Full-time','STL','Business Analyst',100000.00,'IT','Analyze','111',2,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,59,'No','Full-time','Relaince','ManagerIT',100000.00,'IT','IT','15',1,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(48,2,'Yes','Full-Time','Sterlite Technolgies Limited','Software Developer',500000.00,'React','APP DEV','3 months',0,4,1,NULL,NULL,NULL,NULL,NULL,2025,NULL,NULL,NULL,0,0,NULL,NULL),(53,1,'1','Full-time','First Company','Software Engineer',75000.00,'JavaScript, React','Full Stack Development','2 months',6,3,0,NULL,NULL,NULL,NULL,NULL,2023,1,NULL,NULL,NULL,NULL,NULL,NULL),(54,65,'Yes','Full-Time','Sterlite Technolgies Limited','Application Developer',500000.00,'React',NULL,'15 days or less',1,0,1,NULL,NULL,NULL,NULL,NULL,2024,NULL,NULL,NULL,0,0,NULL,NULL);
/*!40000 ALTER TABLE `employmentdetails` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-26  9:53:12
