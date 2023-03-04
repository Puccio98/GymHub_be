CREATE TABLE `Weight` (
  `WeightID` int unsigned NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `Weight` decimal(7,3) NOT NULL,
  `Date` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`WeightID`),
  UNIQUE KEY `WeightID_UNIQUE` (`WeightID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;