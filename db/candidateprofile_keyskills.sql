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
-- Table structure for table `keyskills`
--

DROP TABLE IF EXISTS `keyskills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keyskills` (
  `keyskills_id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int NOT NULL,
  `keyskillsname` varchar(255) NOT NULL,
  PRIMARY KEY (`keyskills_id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `keyskills_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profile` (`candidate_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keyskills`
--

LOCK TABLES `keyskills` WRITE;
/*!40000 ALTER TABLE `keyskills` DISABLE KEYS */;
INSERT INTO `keyskills` VALUES (9,2,'CSS'),(10,2,'JavaScript'),(11,3,'HTML'),(12,3,'CSS'),(13,3,'JavaScript'),(14,4,'SQL'),(15,4,'Excel'),(16,6,'Python'),(17,6,'TensorFlow'),(18,7,'ReactJS'),(19,7,'JavaScript'),(20,8,'Docker'),(21,8,'Kubernetes'),(22,9,'SEO'),(23,9,'Google Ads'),(24,10,'Excel'),(25,10,'Tableau'),(26,11,'Python'),(27,11,'R'),(28,12,'Python'),(29,12,'SQL'),(30,13,'React'),(31,13,'Node.js'),(32,14,'Django'),(33,14,'SQL'),(34,15,'Embedded C'),(35,15,'MQTT'),(36,16,'Figma'),(37,16,'Adobe XD'),(38,17,'Excel'),(39,17,'SAS'),(40,18,'Python'),(41,18,'R'),(42,19,'AWS'),(43,19,'Azure'),(44,19,'Kubernetes'),(45,24,'JavaScript'),(46,24,'HTML/CSS'),(47,55,'HRMS'),(48,55,'Payroll'),(51,57,'SQL'),(52,57,'Angular'),(53,57,'AWS'),(54,58,'HTML'),(55,58,'CSS'),(56,58,'REACT'),(57,58,'React.Js'),(58,58,'Python'),(59,58,'AWS'),(60,58,'Angular'),(61,58,'SQL'),(62,58,'Java'),(63,59,'Angular'),(64,59,'testing'),(65,2,'Java'),(66,2,'Angular'),(68,2,'AWS'),(71,2,'REST'),(73,65,'SQL'),(74,65,'JavaScript'),(75,65,'AWS');
/*!40000 ALTER TABLE `keyskills` ENABLE KEYS */;
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
