SELECT p.*, w.*, e_w.*, e.*
FROM User as u 
JOIN Program as p ON u.UserID = p.UserID AND u.UserID = 2  
JOIN Workout as w ON p.ProgramID = w.ProgramID      
JOIN Exercises_Workout e_w ON w.WorkoutID = e_w.WorkoutID      
JOIN Exercise e ON  e_w.ExerciseID = e.ExerciseID  
ORDER BY p.ProgramID AND w.WorkoutID AND e_w.Exercise_WorkoutID
