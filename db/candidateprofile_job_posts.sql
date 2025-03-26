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
-- Table structure for table `job_posts`
--

DROP TABLE IF EXISTS `job_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_posts` (
  `job_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jobTitle` varchar(255) NOT NULL,
  `employmentType` varchar(100) NOT NULL,
  `keySkills` text NOT NULL,
  `department` varchar(255) NOT NULL,
  `workMode` varchar(50) NOT NULL,
  `locations` varchar(255) NOT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `diversityHiring` tinyint(1) DEFAULT '0',
  `jobDescription` text NOT NULL,
  `multipleVacancies` tinyint(1) DEFAULT '0',
  `companyName` varchar(255) DEFAULT NULL,
  `companyInfo` text,
  `companyAddress` text,
  `min_salary` decimal(10,2) DEFAULT NULL,
  `max_salary` decimal(10,2) DEFAULT NULL,
  `min_experience` int DEFAULT NULL,
  `max_experience` int DEFAULT NULL,
  `job_creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `approvedBy` int DEFAULT NULL,
  `rejectedBy` int DEFAULT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  `recruiter_id` int NOT NULL,
  `end_date` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000000036 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_posts`
--

LOCK TABLES `job_posts` WRITE;
/*!40000 ALTER TABLE `job_posts` DISABLE KEYS */;
INSERT INTO `job_posts` VALUES (1000000027,'Software Developer','Full Time, Permanent','\"python\"','IT - Web Developer','Remote','Delhi','IT',0,'sx',0,'Sterlite Technologies Limited','ds','101 Web Towers, Delhi, India',8.00,10.00,2,4,'2025-03-24 10:26:25',1,'2025-03-24 10:26:25','2025-03-24 10:26:36','approved',27,NULL,NULL,29,NULL),(1000000028,'Frontend Developer','Full Time, Permanent','\"python\"','IT - Mobile App Developer','Remote','Delhi','IT',0,'dsahb',0,'Sterlite Technologies Limited','dsads','101 Web Towers, Delhi, India',8.00,10.00,1,2,'2025-03-24 10:52:27',1,'2025-03-24 10:52:27','2025-03-24 10:52:36','approved',27,NULL,NULL,29,NULL),(1000000029,'Lead Backend Developer MERN','Full-time','\"Node.js, Express, MongoDB, AWS\"','Engineering','Remote','Bangalore','Software Development',1,'We are looking for a skilled Backend Developer to architect, develop, and optimize scalable applications...',1,'InnovateTech Solutions','A forward-thinking software development company specializing in cloud-based solutions','789 Tech Valley, Bangalore, India',10.00,15.00,4,8,'2025-03-24 11:26:57',1,'2025-03-24 11:26:57','2025-03-24 11:26:57','pending',NULL,NULL,NULL,29,NULL),(1000000030,'Lead Backend Developer MERN 2','Full-time','\"Node.js, Express, MongoDB, AWS\"','Engineering','Remote','Bangalore','Software Development',1,'We are looking for a skilled Backend Developer to architect, develop, and optimize scalable applications...',1,'InnovateTech Solutions','A forward-thinking software development company specializing in cloud-based solutions','789 Tech Valley, Bangalore, India',10.00,15.00,4,8,'2025-03-24 11:27:31',1,'2025-03-24 11:27:31','2025-03-24 11:27:31','pending',NULL,NULL,NULL,29,NULL),(1000000031,'Lead Backend Developer MERN 3','Full-time','\"Node.js, Express, MongoDB, AWS\"','Engineering','Remote','Bangalore','Software Development',1,'We are looking for a skilled Backend Developer to architect, develop, and optimize scalable applications...',1,'InnovateTech Solutions','A forward-thinking software development company specializing in cloud-based solutions','789 Tech Valley, Bangalore, India',10.00,15.00,4,8,'2025-03-24 11:27:56',1,'2025-03-24 11:27:56','2025-03-24 11:27:56','pending',NULL,NULL,NULL,29,NULL),(1000000032,'Lead Backend Developer MERN 4','Full-time','\"Node.js, Express, MongoDB, AWS\"','Engineering','Remote','Bangalore','Software Development',1,'We are looking for a skilled Backend Developer to architect, develop, and optimize scalable applications...',1,'InnovateTech Solutions','A forward-thinking software development company specializing in cloud-based solutions','789 Tech Valley, Bangalore, India',10.00,15.00,4,8,'2025-03-24 11:28:12',1,'2025-03-24 11:28:12','2025-03-24 11:28:12','pending',NULL,NULL,NULL,29,NULL),(1000000033,'Lead Backend Developer MERN 5','Full-time','\"Node.js, Express, MongoDB, AWS\"','Engineering','Remote','Bangalore','Software Development',1,'We are looking for a skilled Backend Developer to architect, develop, and optimize scalable applications...',1,'InnovateTech Solutions','A forward-thinking software development company specializing in cloud-based solutions','789 Tech Valley, Bangalore, India',10.00,15.00,4,8,'2025-03-24 11:28:28',1,'2025-03-24 11:28:28','2025-03-24 11:28:28','pending',NULL,NULL,NULL,29,NULL),(1000000034,'Senior Data Engineer - Analytics Platform','Full Time, Permanent','\"Python, Spark, SQL, Airflow, AWS\"','IT - Data Scientist','Hybrid','Mumbai','IT',0,'We are seeking a highly motivated Senior Data Engineer to design and build robust data pipelines that power our analytics and reporting infrastructure. You will work closely with analysts, data scientists, and platform teams to ensure scalable and efficient data solutions.',0,'FinVerse Technologies','An award-winning fintech startup revolutionizing digital payments and lending in emerging markets.','12th Floor, SkyTech Tower, Bandra Kurla Complex, Mumbai, India',18.00,26.00,5,10,'2025-03-25 07:12:30',1,'2025-03-25 07:12:30','2025-03-25 07:17:52','approved',27,NULL,NULL,29,NULL);
/*!40000 ALTER TABLE `job_posts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-26  9:53:14
