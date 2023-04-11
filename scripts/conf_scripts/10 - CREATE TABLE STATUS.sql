CREATE TABLE Status (
	StatusID int NOT NULL,
    Status varchar(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (StatusID)
);

INSERT INTO Status (StatusID, Status)
VALUES (1, 'Incomplete');

INSERT INTO Status (StatusID, Status)
VALUES (2, 'Complete');
