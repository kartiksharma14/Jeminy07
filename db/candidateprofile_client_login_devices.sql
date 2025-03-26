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
-- Table structure for table `client_login_devices`
--

DROP TABLE IF EXISTS `client_login_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_login_devices` (
  `device_id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `login_id` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `last_login` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`device_id`),
  KEY `client_id` (`client_id`),
  KEY `idx_client_login_devices_last_login` (`last_login`),
  CONSTRAINT `client_login_devices_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `master_clients` (`client_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_login_devices`
--

LOCK TABLES `client_login_devices` WRITE;
/*!40000 ALTER TABLE `client_login_devices` DISABLE KEYS */;
INSERT INTO `client_login_devices` VALUES (4,6,'login_1742811011364_dou87xno','2025-03-24','2025-03-24','2025-03-24 10:10:11',0,'2025-03-24 10:10:11','2025-03-24 10:12:42'),(5,6,'login_1742811213053_pp17i0tl','2025-03-24','2025-03-24','2025-03-24 10:13:33',0,'2025-03-24 10:13:33','2025-03-24 10:13:38'),(6,6,'login_1742811247079_zy6au3q7','2025-03-24','2025-03-24','2025-03-24 10:14:07',0,'2025-03-24 10:14:07','2025-03-24 10:23:26'),(7,6,'login_1742811851729_pbjyf6dy','2025-03-24','2025-03-26','2025-03-24 10:24:11',1,'2025-03-24 10:24:11','2025-03-24 10:24:11'),(8,6,'login_1742811940545_aww2ht7r','2025-03-24','2025-03-24','2025-03-24 10:25:40',0,'2025-03-24 10:25:40','2025-03-24 11:37:13'),(9,6,'login_1742883578528_dx9rmd1q','2025-03-25','2025-03-25','2025-03-25 06:19:38',0,'2025-03-25 06:19:38','2025-03-25 08:04:48'),(10,6,'login_1742891468954_mhz32622','2025-03-25','2025-03-25','2025-03-25 08:31:08',0,'2025-03-25 08:31:08','2025-03-25 08:32:58'),(11,6,'login_1742891605538_joeacx2j','2025-03-25','2025-03-25','2025-03-25 08:33:25',0,'2025-03-25 08:33:25','2025-03-25 09:37:54'),(12,6,'login_1742895556662_mg80ucoy','2025-03-25','2025-03-25','2025-03-25 09:39:16',0,'2025-03-25 09:39:16','2025-03-25 11:06:20');
/*!40000 ALTER TABLE `client_login_devices` ENABLE KEYS */;
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
