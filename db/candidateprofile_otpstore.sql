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
-- Table structure for table `otpstore`
--

DROP TABLE IF EXISTS `otpstore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otpstore` (
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `otp_expiry` datetime NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otpstore`
--

LOCK TABLES `otpstore` WRITE;
/*!40000 ALTER TABLE `otpstore` DISABLE KEYS */;
INSERT INTO `otpstore` VALUES ('','330249','2025-02-27 08:20:38'),('brijesh.kumar@stl.tech','114878','2025-02-27 08:12:08'),('ct31708@gmail.com','757036','2025-02-14 04:43:54'),('deepak.kumar.11@stl.tech','808922','2025-03-04 10:31:57'),('kartik.sharma1@gmail.com','477540','2025-03-03 08:17:06'),('kartik.sharma1@stltech.in','755251','2025-02-27 08:16:55'),('kartik@example.com','107403','2025-02-27 10:12:48'),('kartik85669@gmail.com','946281','2025-03-05 11:25:53'),('piyushadmin10@gmail.com','930817','2025-03-03 08:07:17'),('piyushadmin1110@gmail.com','265131','2025-03-03 08:15:14'),('piyushpushkar1001@gmail.com','804116','2025-03-24 04:37:05'),('recruiterartik@example.com','374550','2025-02-27 10:07:54'),('recruiterkarik@example.com','645114','2025-02-27 10:08:28'),('recruiterkartik@example.co','735914','2025-02-27 08:33:27'),('recruiterkartik@example.com','916262','2025-02-27 08:28:29'),('recruiterkartik@exmple.co','544347','2025-02-27 08:39:12'),('recrurart@example.com','310448','2025-02-27 10:20:28'),('recrurartik@example.com','686230','2025-02-27 10:11:48'),('rkartik@example.com','792853','2025-02-27 10:14:00');
/*!40000 ALTER TABLE `otpstore` ENABLE KEYS */;
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
