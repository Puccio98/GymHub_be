UPDATE Workout 
SET StatusID = 1
WHERE ProgramID = 3;

UPDATE Exercises_Workout 
SET StatusID = 1
WHERE WorkoutID in (13, 14, 15);
