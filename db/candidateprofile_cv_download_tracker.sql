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
-- Table structure for table `cv_download_tracker`
--

DROP TABLE IF EXISTS `cv_download_tracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cv_download_tracker` (
  `download_id` int NOT NULL AUTO_INCREMENT,
  `recruiter_id` int NOT NULL,
  `client_id` int NOT NULL,
  `candidate_id` int NOT NULL,
  `download_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`download_id`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_recruiter_id` (`recruiter_id`),
  KEY `idx_download_date` (`download_date`),
  CONSTRAINT `cv_download_tracker_ibfk_1` FOREIGN KEY (`recruiter_id`) REFERENCES `recruiter_signin` (`recruiter_id`),
  CONSTRAINT `cv_download_tracker_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `master_clients` (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cv_download_tracker`
--

LOCK TABLES `cv_download_tracker` WRITE;
/*!40000 ALTER TABLE `cv_download_tracker` DISABLE KEYS */;
INSERT INTO `cv_download_tracker` VALUES (1,29,6,2,'2025-03-25 09:24:32','127.0.0.1'),(2,29,6,3,'2025-03-25 09:35:50','127.0.0.1'),(3,29,6,1,'2025-03-25 09:37:39','127.0.0.1'),(4,29,6,24,'2025-03-25 10:23:15','127.0.0.1'),(5,29,6,18,'2025-03-25 10:23:49','127.0.0.1'),(6,29,6,65,'2025-03-25 10:25:23','127.0.0.1'),(7,29,6,59,'2025-03-25 10:31:44','127.0.0.1'),(8,29,6,12,'2025-03-25 10:34:52','127.0.0.1'),(9,29,6,6,'2025-03-25 10:34:52','127.0.0.1'),(10,29,6,11,'2025-03-25 10:34:52','127.0.0.1'),(11,29,6,7,'2025-03-25 10:46:12','127.0.0.1'),(12,29,6,8,'2025-03-25 10:46:15','127.0.0.1'),(13,29,6,55,'2025-03-25 10:46:20','127.0.0.1'),(14,29,6,9,'2025-03-25 10:46:23','127.0.0.1'),(15,29,6,10,'2025-03-25 10:46:26','127.0.0.1'),(16,29,6,13,'2025-03-25 10:46:37','127.0.0.1'),(17,29,6,14,'2025-03-25 10:46:41','127.0.0.1'),(18,29,6,15,'2025-03-25 10:46:47','127.0.0.1'),(19,29,6,16,'2025-03-25 10:46:52','127.0.0.1'),(20,29,6,17,'2025-03-25 10:46:54','127.0.0.1');
/*!40000 ALTER TABLE `cv_download_tracker` ENABLE KEYS */;
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
