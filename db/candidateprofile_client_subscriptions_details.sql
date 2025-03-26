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
-- Table structure for table `client_subscriptions_details`
--

DROP TABLE IF EXISTS `client_subscriptions_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_subscriptions_details` (
  `subscription_id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `cv_download_quota` int NOT NULL,
  `login_allowed` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`subscription_id`),
  KEY `idx_client_subscriptions_dates` (`start_date`,`end_date`),
  KEY `idx_client_subscriptions_client_id` (`client_id`),
  CONSTRAINT `client_subscriptions_details_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `master_clients` (`client_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_subscriptions_details`
--

LOCK TABLES `client_subscriptions_details` WRITE;
/*!40000 ALTER TABLE `client_subscriptions_details` DISABLE KEYS */;
INSERT INTO `client_subscriptions_details` VALUES (6,6,10,2,'2025-03-21','2025-03-24',0,'2025-03-21 09:44:03','2025-03-24 04:58:59'),(7,6,10,2,'2025-03-24','2025-03-23',0,'2025-03-24 04:58:59','2025-03-24 05:23:38'),(8,6,20000,3,'2025-03-24','2026-03-24',0,'2025-03-24 05:23:38','2025-03-24 05:32:22'),(9,6,10,2,'2025-03-24','2025-03-23',0,'2025-03-24 05:25:10','2025-03-24 05:32:37'),(10,6,20000,3,'2025-03-24','2025-03-24',0,'2025-03-24 05:32:22','2025-03-24 05:33:24'),(11,6,10,2,'2025-03-24','2025-03-23',0,'2025-03-24 05:32:37','2025-03-24 05:33:58'),(12,6,20000,3,'2025-03-24','2025-04-13',0,'2025-03-24 05:32:50','2025-03-24 06:02:52'),(13,6,20000,2,'2025-03-24','2025-03-24',0,'2025-03-24 05:33:24','2025-03-24 06:03:48'),(14,6,10,2,'2025-03-24','2025-03-23',0,'2025-03-24 05:33:58','2025-03-24 06:04:14'),(15,6,10,2,'2025-03-24','2025-03-23',0,'2025-03-24 06:04:14','2025-03-24 06:05:38'),(16,6,10,2,'2025-03-24','2025-03-23',0,'2025-03-24 06:05:38','2025-03-24 06:05:49'),(17,6,10,2,'2025-03-24','2025-03-23',0,'2025-03-24 06:05:49','2025-03-24 06:07:23'),(18,6,10,2,'2025-03-24','2025-04-13',0,'2025-03-24 06:07:23','2025-03-24 08:37:56'),(19,6,10,2,'2025-03-24','2025-03-25',0,'2025-03-24 08:38:23','2025-03-24 10:16:41'),(20,6,20,2,'2025-03-24','2025-03-26',1,'2025-03-24 10:16:41','2025-03-25 10:39:33');
/*!40000 ALTER TABLE `client_subscriptions_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-26  9:53:13
