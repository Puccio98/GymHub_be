SET @userID = (SELECT UserID FROM gymhub_test.User WHERE Email = 'testuser@test.com');

DELETE FROM gymhub_test.Program 
WHERE UserID = @UserID;