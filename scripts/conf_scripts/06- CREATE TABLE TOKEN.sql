CREATE TABLE `Token` (
  `TokenID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `TokenTypeID` int NOT NULL,
  `Token`  varchar(512) NOT NULL,
  `issuedAt`  varchar(64) NOT NULL,
  `expiresAt` varchar(64) NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`TokenID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
