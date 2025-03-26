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
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int DEFAULT NULL,
  `project_title` varchar(255) DEFAULT NULL,
  `client` varchar(255) DEFAULT NULL,
  `project_status` varchar(50) DEFAULT NULL,
  `project_start_date` date DEFAULT NULL,
  `project_end_date` date DEFAULT NULL,
  `work_duration` varchar(100) DEFAULT NULL,
  `technology_used` varchar(255) DEFAULT NULL,
  `details_of_project` text,
  PRIMARY KEY (`project_id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profile` (`candidate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,2,'E-commerce Website','ABC Corp','Completed','2019-01-01','2021-06-30','6 months','React, Node.js','Developed a full-stack e-commerce website.'),(2,9,'Social Media Marketing Campaign','Fashion Hub','Completed','2020-01-15','2020-12-15','1 year','Facebook Ads, Google Ads','Managed a comprehensive social media campaign that increased brand engagement by 30%.'),(3,10,'Stock Market Analysis Tool','InvestCo','Completed','2018-09-01','2019-08-31','1 year','Python, Pandas','Developed a robust tool for analyzing stock market trends and forecasting future prices.'),(4,11,'E-Learning Platform Development','EduLearn','Ongoing','2021-01-01','2022-12-31','2 years','Python, Django','Creating a scalable e-learning platform with interactive modules and assessments.'),(5,12,'Healthcare Data Integration','HealthPlus','Completed','2019-03-01','2020-02-28','1 year','SQL, Python','Integrated diverse healthcare data sources into a single unified system for improved reporting.'),(6,13,'E-Commerce Website','ShopNow','Completed','2018-01-01','2019-06-30','1.5 years','React, Node.js','Developed a secure and scalable e-commerce website with integrated payment gateways.'),(7,14,'API Development for Mobile App','Tech Solutions','Completed','2020-04-01','2021-03-31','1 year','Django, REST','Built a set of RESTful APIs to support a cross-platform mobile application.'),(8,15,'IoT Home Automation System','Smart Homes Ltd','Ongoing','2021-01-01','2022-06-30','1.5 years','Embedded C, MQTT','Developing a home automation system to control smart devices and improve energy efficiency.'),(9,16,'Mobile App UI/UX Design','AppWorks','Completed','2020-05-01','2021-04-30','1 year','Figma, Adobe XD','Designed an intuitive and engaging user interface for a customer-facing mobile app.'),(10,17,'Risk Management System Development','FinanceTech','Ongoing','2019-07-01','2021-12-31','2.5 years','Excel, SAS','Developing predictive models and implementing a system to manage financial risks effectively.'),(11,18,'Genomic Data Analytics Platform','BioHealth','Ongoing','2020-08-01','2022-07-31','2 years','Python, R','Analyzing genomic data to generate insights for personalized healthcare and treatment strategies.'),(12,19,'Cloud Infrastructure Optimization','CloudTech','Completed','2018-03-01','2019-08-31','1.5 years','AWS, Azure, Kubernetes','Optimized cloud infrastructure to enhance performance and reduce costs for enterprise applications.'),(13,58,'E-commerce Website','ABC Corp','Completed','2019-01-01','2021-06-30','6 months','React, Node.js','Very fantastic'),(14,59,'Nimbus','Xpresbees','Completed','2024-01-02','2024-01-30','6','test','test'),(16,1,'E-commerce Platform','Retail Corp','Completed','2022-01-01','2022-12-31','11 months','Node js, React, MySql','Developed full-stack e-commerce solution');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-26  9:53:15
