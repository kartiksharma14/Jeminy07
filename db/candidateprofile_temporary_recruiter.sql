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
-- Table structure for table `temporary_recruiter`
--

DROP TABLE IF EXISTS `temporary_recruiter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temporary_recruiter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temporary_recruiter`
--

LOCK TABLES `temporary_recruiter` WRITE;
/*!40000 ALTER TABLE `temporary_recruiter` DISABLE KEYS */;
INSERT INTO `temporary_recruiter` VALUES (5,'brijesh.kumar@stl.tech','Kartik@12','2025-02-27 08:02:08','2025-02-27 08:02:08'),(6,'Kartik8569@gmail.com','Kartik@123','2025-02-27 08:02:26','2025-02-27 08:02:26'),(9,'kartik.sharma1@stltech.in','Kartik@123','2025-02-27 08:06:55','2025-02-27 08:06:55'),(11,'','','2025-02-27 08:10:38','2025-02-27 08:10:38'),(12,'recruiterkartik@example.com','password123','2025-02-27 08:18:29','2025-02-27 08:18:29'),(13,'recruiterkartik@example.co','password123','2025-02-27 08:23:27','2025-02-27 08:23:27'),(14,'recruiterkartik@exmple.co','password123','2025-02-27 08:29:12','2025-02-27 08:29:12'),(15,'recruiterartik@example.com','password123','2025-02-27 09:57:54','2025-02-27 09:57:54'),(16,'recruiterkarik@example.com','password123','2025-02-27 09:58:28','2025-02-27 09:58:28'),(17,'recrurartik@example.com','password123','2025-02-27 10:01:48','2025-02-27 10:01:48'),(18,'kartik@example.com','password123','2025-02-27 10:02:48','2025-02-27 10:02:48'),(19,'rkartik@example.com','password123','2025-02-27 10:04:00','2025-02-27 10:04:00'),(21,'recrurart@example.com','password123','2025-02-27 10:10:28','2025-02-27 10:10:28');
/*!40000 ALTER TABLE `temporary_recruiter` ENABLE KEYS */;
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
