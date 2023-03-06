-- DICHIARARE VARIABILE
SET @userID = (SELECT UserID FROM gymhub_test.User WHERE Email = 'testuser@test.com');
SELECT @userID;

-- ELIMINA ROW
DELETE FROM gymhub_test.User
WHERE UserID = @userID;


 