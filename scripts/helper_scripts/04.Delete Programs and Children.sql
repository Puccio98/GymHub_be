SET @userID = (SELECT UserID FROM gymhub_test.User WHERE Email = 'testuser@test.com');

DELETE 
FROM Exercises_Workout AS ew
WHERE ew.WorkoutID IN (
	SELECT WorkoutID 
	FROM Program AS p
	JOIN Workout AS w ON p.ProgramID = w.ProgramID
	WHERE p.UserID = @userID
);

DELETE
FROM Workout AS w
WHERE w.ProgramID IN (
	SELECT ProgramID
    FROM Program AS p
    WHERE p.UserID = @userID
);

DELETE
FROM Program AS p
WHERE p.UserID = @userID;
