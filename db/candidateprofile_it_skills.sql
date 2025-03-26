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
-- Table structure for table `it_skills`
--

DROP TABLE IF EXISTS `it_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `it_skills` (
  `itskills_id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int DEFAULT NULL,
  `itskills_name` varchar(255) DEFAULT NULL,
  `itskills_proficiency` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`itskills_id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `it_skills_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profile` (`candidate_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `it_skills`
--

LOCK TABLES `it_skills` WRITE;
/*!40000 ALTER TABLE `it_skills` DISABLE KEYS */;
INSERT INTO `it_skills` VALUES (2,2,'ReactJs','Expert'),(3,3,'Java','Expert'),(4,3,'Python','Intermediate'),(5,4,'SQL','Expert'),(6,4,'Power BI','Intermediate'),(7,6,'TensorFlow','Advanced'),(8,6,'Python','Advanced'),(9,7,'ReactJS','Beginner'),(10,7,'JavaScript','Intermediate'),(11,8,'Docker','Advanced'),(12,8,'Kubernetes','Intermediate'),(13,9,'SEO','Advanced'),(14,9,'Google Ads','Intermediate'),(15,10,'Excel','Expert'),(16,10,'Tableau','Intermediate'),(17,11,'Python','Advanced'),(18,11,'R','Intermediate'),(19,12,'Python','Advanced'),(20,12,'SQL','Intermediate'),(21,13,'React','Advanced'),(22,13,'Node.js','Intermediate'),(23,14,'Django','Beginner'),(24,14,'SQL','Intermediate'),(25,15,'Embedded C','Advanced'),(26,15,'MQTT','Intermediate'),(27,16,'Figma','Advanced'),(28,16,'Adobe XD','Intermediate'),(29,17,'Excel','Advanced'),(30,17,'SAS','Intermediate'),(31,18,'Python','Advanced'),(32,18,'R','Intermediate'),(33,19,'AWS','Expert'),(34,19,'Azure','Intermediate'),(35,19,'Kubernetes','Advanced'),(36,24,'JavaScript','Intermediate'),(37,24,'HTML/CSS','Advanced'),(38,55,'HRMS','Expert'),(39,55,'Payroll','Intermediate'),(41,58,'ReactJs','Expert'),(42,58,'JavaScript','Expert'),(43,59,'python','Intermediate'),(44,59,'java','Intermediate'),(45,65,'Python','Expert');
/*!40000 ALTER TABLE `it_skills` ENABLE KEYS */;
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
