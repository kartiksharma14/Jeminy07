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
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (2,NULL,'piyushadmin10@gmail.com','$2a$10$FhjIQE7JhY.xUseFdXI3zuVW47eYbZar0PQaqzT2noSvAe4AbJx8S'),(5,NULL,'kartik.sharma1@stltech.in','$2a$10$TJDVI2LxvODyp4eO6K7/fOb8IgJ0kPXiL/BCxL5w1n2xdS7H4Z3xW'),(10,NULL,'piyushadmin1110@gmail.com','$2a$10$39uPlcG9BrCJy89hbXnVj.B15BIS11WOKVLrrAckxOjhCkhHqyrtG'),(13,NULL,'kartik.sharma1@gmail.com','$2a$10$KuQRrGdrDu6IEHXhGW5Fx.VfVQpHH4oswuoOn2nUUOPASbl0yHSAC'),(22,NULL,'kartik8569@gmail.com','$2a$10$LPU/kjbnMlxIK.VN3n7ANukgI40LK3.oPPPQ2zXFWuQx1D9V0Va4i'),(25,NULL,'Kartik.8569@gmail.com','$2a$10$JdRMkygk7.vWNJYtb.x3VeiEpJAWDF6Tp81bV2xvDW8Bq9XWhuFge'),(26,NULL,'Kartik856.9@gmail.com','$2a$10$KZWcPFnpW8Dfj.xWemedzOGpbprkMGuFBN/RRBtqa4VeZPQz4yW8G'),(27,NULL,'k.artik8569@gmail.com','$2a$10$BOQBz621tlCqn/A.WiYfQeBkB/sSsjg5rTT8K2Sv/1/RsWu4jhRjW'),(28,NULL,'Kartik.sharma1@stl.tech','$2a$10$QxiluCDG5mHoviiErOIloOx8VDqA.FVOSfPDrRsxrXpgjNAcH8bbC'),(31,NULL,'kartik85669@gmail.com','$2a$10$rRSj5hYI02wdv7STP8b3H.Q7/N9QCtKxG6IzYKSaJWyw0fsT1aJb.');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
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
