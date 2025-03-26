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
-- Table structure for table `temp_job_posts`
--

DROP TABLE IF EXISTS `temp_job_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temp_job_posts` (
  `temp_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
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
  `created_by` bigint DEFAULT NULL,
  `recruiter_id` int NOT NULL,
  `expiry_time` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end_date` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`temp_id`),
  KEY `idx_session_id` (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_job_posts`
--

LOCK TABLES `temp_job_posts` WRITE;
/*!40000 ALTER TABLE `temp_job_posts` DISABLE KEYS */;
INSERT INTO `temp_job_posts` VALUES (44,'draft_1742815554902_e5hidiwvace','Lead Backend Developer MERN','Full-time','Node.js, Express, MongoDB, AWS','Engineering','Remote','Bangalore','Software Development',1,'We are looking for a skilled Backend Developer to architect, develop, and optimize scalable applications...',1,'InnovateTech Solutions','A forward-thinking software development company specializing in cloud-based solutions','789 Tech Valley, Bangalore, India',10.00,15.00,4,8,8,8,'2025-03-25 11:25:54','2025-03-24 11:25:54','2025-03-24 11:25:54','23/04/25'),(51,'draft_1742893945873_06n576a4tzqv','Lead Backend Developer MERN 5','Full-time','Node.js, Express, MongoDB, AWS','Engineering','Remote','Bangalore','Software Development',1,'We are looking for a skilled Backend Developer to architect, develop, and optimize scalable applications...',1,'InnovateTech Solutions','A forward-thinking software development company specializing in cloud-based solutions','789 Tech Valley, Bangalore, India',10.00,15.00,4,8,29,29,'2025-03-26 09:12:25','2025-03-25 09:12:25','2025-03-25 09:12:25','24/04/25');
/*!40000 ALTER TABLE `temp_job_posts` ENABLE KEYS */;
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
