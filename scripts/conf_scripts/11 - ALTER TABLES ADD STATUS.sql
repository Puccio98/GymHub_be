ALTER TABLE Exercises_Workout
ADD StatusID int default 1;

ALTER TABLE Workout
ADD StatusID int default 1;

ALTER TABLE Program
ADD StatusID int default 1;