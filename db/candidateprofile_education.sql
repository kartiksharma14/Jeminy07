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
-- Table structure for table `education`
--

DROP TABLE IF EXISTS `education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education` (
  `education_id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int DEFAULT NULL,
  `education_level` varchar(255) DEFAULT NULL,
  `university` varchar(255) DEFAULT NULL,
  `course` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `coursestart_year` year DEFAULT NULL,
  `courseend_year` year DEFAULT NULL,
  PRIMARY KEY (`education_id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `education_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profile` (`candidate_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education`
--

LOCK TABLES `education` WRITE;
/*!40000 ALTER TABLE `education` DISABLE KEYS */;
INSERT INTO `education` VALUES (1,3,'PHD','ABC University',NULL,NULL,2025,2029),(2,2,'Masters','DCA University','Computer Science','Software Engineering',2009,2010),(6,3,'Bachelor\'s','IIT Delhi','Computer Science','Artificial Intelligence',2008,2012),(7,4,'Bachelor\'s','University of Mumbai','Business Administration','Finance',2006,2009),(8,6,'Master\'s','Anna University','Computer Science','Machine Learning',2011,2013),(9,7,'Bachelor\'s','Osmania University','Information Technology','Web Development',2014,2017),(10,8,'Master\'s','IISc Bangalore','Computer Science','Cloud Computing',2009,2011),(11,9,'MBA','IIM Ahmedabad','Marketing','Digital Marketing',2012,2014),(12,10,'Bachelor\'s','Savitribai Phule Pune Univ','Finance','Investment Analysis',2007,2011),(13,11,'PhD','IIT Madras','Artificial Intelligence','Educational Technology',2015,2019),(14,12,'Master\'s','University of Mumbai','Data Science','Healthcare Analytics',2012,2014),(15,13,'Bachelor\'s','Delhi University','Computer Science','Full Stack Development',2014,2018),(16,14,'Bachelor\'s','VIT University','Computer Science','Backend Development',2017,2021),(17,15,'Master\'s','NIT Warangal','Electronics','IoT Systems',2010,2012),(18,16,'Bachelor\'s','Lucknow University','Design','UI/UX Design',2018,2022),(19,17,'Bachelor\'s','IIT Bombay','Software Engineering','Cloud Computing',2012,2016),(20,18,'Master\'s','Banaras Hindu University','Computer Science','Cybersecurity',2014,2016),(21,19,'MBA','IIM Bangalore','Marketing','Brand Management',2011,2013),(22,24,'Bachelor\'s','University of Calcutta','Economics','Financial Economics',2005,2008),(23,55,'Master\'s','IIM Calcutta','Human Resource Management','Talent Acquisition',2010,2012),(24,2,'Class XII','SIS','Class 12th','Science',2004,2005),(25,2,'Graduation','IIIT','B.Tech',' Computer Science',2005,2009),(27,58,'masters/post-graduation','University of California','MS','Computer Science',2016,2020),(28,58,'graduation/diploma','University of California','BTECH','CS',2012,2016),(29,59,'class X','Chitkara University','B.Tech',' Computer Science',2019,2020),(30,59,'class XII','Arizona State Univeristy','B.Tech',' Computer Science',2019,2022),(32,1,'Bachelor\'s','Sample University','Computer Science','Software Engineering',2019,2023),(33,65,'graduation/diploma','Chitkara University','B.Tech',' Computer Science',2020,2024);
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-26  9:53:16
