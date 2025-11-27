/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: jiujitsu
-- ------------------------------------------------------
-- Server version	10.11.10-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Aluno`
--

DROP TABLE IF EXISTS `Aluno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Aluno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `matricula` varchar(191) NOT NULL,
  `nome` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `cpf` varchar(191) DEFAULT NULL,
  `dataNascimento` datetime(3) DEFAULT NULL,
  `telefone` varchar(191) DEFAULT NULL,
  `endereco` varchar(191) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `faixa` varchar(191) DEFAULT NULL,
  `grau` int(11) DEFAULT 0,
  `dataInicio` datetime(3) DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `saude` text DEFAULT NULL,
  `aulasDesdeUltGrad` int(11) NOT NULL DEFAULT 0,
  `planoId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Aluno_matricula_key` (`matricula`),
  UNIQUE KEY `Aluno_email_key` (`email`),
  UNIQUE KEY `Aluno_cpf_key` (`cpf`),
  KEY `Aluno_planoId_fkey` (`planoId`),
  CONSTRAINT `Aluno_planoId_fkey` FOREIGN KEY (`planoId`) REFERENCES `Plano` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Aluno`
--

LOCK TABLES `Aluno` WRITE;
/*!40000 ALTER TABLE `Aluno` DISABLE KEYS */;
INSERT INTO `Aluno` VALUES
(1,'2711202501','João Silva','aluno1@example.com',NULL,'1990-01-15 00:00:00.000','(11) 98765-4321',NULL,1,'Azul',2,'2020-03-10 00:00:00.000',NULL,NULL,0,NULL,'2025-11-27 15:13:03.671','2025-11-27 15:13:03.671'),
(2,'2711202502','Maria Oliveira','aluno2@example.com',NULL,'1995-07-22 00:00:00.000','(11) 91234-5678',NULL,1,'Branca',4,'2022-01-05 00:00:00.000',NULL,NULL,0,NULL,'2025-11-27 15:13:03.695','2025-11-27 15:13:03.695'),
(3,'2711202503','Jean','jean@scsite.com.br','16223687036','1977-10-01 00:00:00.000','48999293009','rrr',1,'Branca',0,'2025-11-27 00:00:00.000','Iniciante','Esclerose Multipla, aluno tem TDHA treina para tirar o estresse',0,NULL,'2025-11-27 15:14:48.591','2025-11-27 15:14:48.591'),
(7,'2711202504','Fabiano Dutra','lfdjesus@gmail.com','028.496.959-12','1979-09-19 00:00:00.000','47984172112','Rua Girassol',1,'Roxa',0,'2020-01-01 00:00:00.000','','',0,NULL,'2025-11-27 18:07:24.840','2025-11-27 18:07:24.840');
/*!40000 ALTER TABLE `Aluno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ArteMarcial`
--

DROP TABLE IF EXISTS `ArteMarcial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ArteMarcial` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(191) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ArteMarcial_nome_key` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ArteMarcial`
--

LOCK TABLES `ArteMarcial` WRITE;
/*!40000 ALTER TABLE `ArteMarcial` DISABLE KEYS */;
INSERT INTO `ArteMarcial` VALUES
(1,'Jiu-Jitsu',1,'2025-11-27 15:49:48.200','2025-11-27 15:49:48.200'),
(2,'Muay Thai',1,'2025-11-27 18:08:11.791','2025-11-27 18:08:11.791'),
(3,'Musculação',1,'2025-11-27 18:08:38.415','2025-11-27 18:08:38.415');
/*!40000 ALTER TABLE `ArteMarcial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Aula`
--

DROP TABLE IF EXISTS `Aula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Aula` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(191) NOT NULL,
  `descricao` varchar(191) DEFAULT NULL,
  `professorId` int(11) DEFAULT NULL,
  `diaSemana` int(11) NOT NULL,
  `horaInicio` varchar(191) NOT NULL,
  `horaFim` varchar(191) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `nivel` varchar(191) NOT NULL,
  `tipo` varchar(191) NOT NULL,
  `vagas` int(11) NOT NULL DEFAULT 20,
  PRIMARY KEY (`id`),
  KEY `Aula_professorId_fkey` (`professorId`),
  CONSTRAINT `Aula_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Aula`
--

LOCK TABLES `Aula` WRITE;
/*!40000 ALTER TABLE `Aula` DISABLE KEYS */;
/*!40000 ALTER TABLE `Aula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HistoricoGraduacao`
--

DROP TABLE IF EXISTS `HistoricoGraduacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `HistoricoGraduacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alunoId` int(11) NOT NULL,
  `faixaAnterior` varchar(191) DEFAULT NULL,
  `grauAnterior` int(11) DEFAULT 0,
  `faixaNova` varchar(191) NOT NULL,
  `grauNovo` int(11) NOT NULL DEFAULT 0,
  `dataGraduacao` datetime(3) NOT NULL,
  `quantidadeAulas` int(11) DEFAULT NULL,
  `professor` varchar(191) DEFAULT NULL,
  `observacoes` varchar(191) DEFAULT NULL,
  `fotos` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `HistoricoGraduacao_alunoId_fkey` (`alunoId`),
  CONSTRAINT `HistoricoGraduacao_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HistoricoGraduacao`
--

LOCK TABLES `HistoricoGraduacao` WRITE;
/*!40000 ALTER TABLE `HistoricoGraduacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `HistoricoGraduacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InscricaoAula`
--

DROP TABLE IF EXISTS `InscricaoAula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `InscricaoAula` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alunoId` int(11) NOT NULL,
  `aulaId` int(11) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `InscricaoAula_alunoId_aulaId_key` (`alunoId`,`aulaId`),
  KEY `InscricaoAula_aulaId_fkey` (`aulaId`),
  CONSTRAINT `InscricaoAula_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `InscricaoAula_aulaId_fkey` FOREIGN KEY (`aulaId`) REFERENCES `Aula` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InscricaoAula`
--

LOCK TABLES `InscricaoAula` WRITE;
/*!40000 ALTER TABLE `InscricaoAula` DISABLE KEYS */;
/*!40000 ALTER TABLE `InscricaoAula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Mensalidade`
--

DROP TABLE IF EXISTS `Mensalidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Mensalidade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alunoId` int(11) NOT NULL,
  `valor` double NOT NULL,
  `dataVencimento` datetime(3) NOT NULL,
  `dataPagamento` datetime(3) DEFAULT NULL,
  `formaPagamento` varchar(191) DEFAULT NULL,
  `metodoPagamento` varchar(191) DEFAULT NULL,
  `comprovante` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pendente',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Mensalidade_alunoId_fkey` (`alunoId`),
  CONSTRAINT `Mensalidade_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mensalidade`
--

LOCK TABLES `Mensalidade` WRITE;
/*!40000 ALTER TABLE `Mensalidade` DISABLE KEYS */;
/*!40000 ALTER TABLE `Mensalidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Perfil`
--

DROP TABLE IF EXISTS `Perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Perfil` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `telefone` varchar(191) DEFAULT NULL,
  `endereco` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Perfil_userId_key` (`userId`),
  CONSTRAINT `Perfil_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Perfil`
--

LOCK TABLES `Perfil` WRITE;
/*!40000 ALTER TABLE `Perfil` DISABLE KEYS */;
/*!40000 ALTER TABLE `Perfil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Plano`
--

DROP TABLE IF EXISTS `Plano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Plano` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(191) NOT NULL,
  `tipo` varchar(191) NOT NULL,
  `valor` double NOT NULL,
  `descricao` varchar(191) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Plano`
--

LOCK TABLES `Plano` WRITE;
/*!40000 ALTER TABLE `Plano` DISABLE KEYS */;
/*!40000 ALTER TABLE `Plano` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Presenca`
--

DROP TABLE IF EXISTS `Presenca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Presenca` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alunoId` int(11) NOT NULL,
  `aulaId` int(11) DEFAULT NULL,
  `data` datetime(3) NOT NULL,
  `presente` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Presenca_alunoId_fkey` (`alunoId`),
  KEY `Presenca_aulaId_fkey` (`aulaId`),
  CONSTRAINT `Presenca_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Presenca_aulaId_fkey` FOREIGN KEY (`aulaId`) REFERENCES `Aula` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Presenca`
--

LOCK TABLES `Presenca` WRITE;
/*!40000 ALTER TABLE `Presenca` DISABLE KEYS */;
/*!40000 ALTER TABLE `Presenca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Professor`
--

DROP TABLE IF EXISTS `Professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Professor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `telefone` varchar(191) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Professor_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Professor`
--

LOCK TABLES `Professor` WRITE;
/*!40000 ALTER TABLE `Professor` DISABLE KEYS */;
INSERT INTO `Professor` VALUES
(1,'Joao Maria','joaomaria@teste.com','48999999',1,'2025-11-27 15:32:59.478','2025-11-27 15:32:59.478'),
(2,'LUIZ FABIANO DUTRA','lfdjesus@gmail.com','47984172112',1,'2025-11-27 18:06:23.994','2025-11-27 18:06:23.994');
/*!40000 ALTER TABLE `Professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RequisitoGraduacao`
--

DROP TABLE IF EXISTS `RequisitoGraduacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RequisitoGraduacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `faixa` varchar(191) NOT NULL,
  `grau` int(11) NOT NULL DEFAULT 0,
  `proximaFaixa` varchar(191) NOT NULL,
  `proximoGrau` int(11) NOT NULL DEFAULT 0,
  `aulasNecessarias` int(11) NOT NULL,
  `tempoMinimo` int(11) DEFAULT NULL,
  `descricao` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RequisitoGraduacao`
--

LOCK TABLES `RequisitoGraduacao` WRITE;
/*!40000 ALTER TABLE `RequisitoGraduacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `RequisitoGraduacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TipoAula`
--

DROP TABLE IF EXISTS `TipoAula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TipoAula` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(191) NOT NULL,
  `cor` varchar(191) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TipoAula_nome_key` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoAula`
--

LOCK TABLES `TipoAula` WRITE;
/*!40000 ALTER TABLE `TipoAula` DISABLE KEYS */;
INSERT INTO `TipoAula` VALUES
(1,'Iniciante','#e9ecf1',1,'2025-11-27 15:49:02.929','2025-11-27 18:10:27.908'),
(2,'Intermediário','#3b82f6',1,'2025-11-27 18:10:43.948','2025-11-27 18:10:43.948'),
(3,'Avançado','#02060d',1,'2025-11-27 18:10:59.617','2025-11-27 18:10:59.617');
/*!40000 ALTER TABLE `TipoAula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'aluno',
  `refreshToken` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES
(1,'Administrador','admin@jiujitsu.com','$2a$08$pPMKECWAU4.ipq3OzcNac.ValdzebfgGiy8TaUo2fFuTqSpHC36SG',NULL,'admin',NULL,'2025-11-27 15:12:35.947','2025-11-27 15:12:35.947'),
(2,'Usuário Teste','usuario@example.com','$2a$08$VTYnJ0DxK86QRWs01zCQx.ZpHqCyrsNHXW1lPIVNdyiaPBsrDE8jq',NULL,'aluno',NULL,'2025-11-27 15:12:36.014','2025-11-27 15:12:36.014');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-27 15:21:01
