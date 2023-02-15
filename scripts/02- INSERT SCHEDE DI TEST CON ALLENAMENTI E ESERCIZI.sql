SET @userID = (Select UserID from User where Email = 'test@test.com');
SET @activeID = (Select ProgramStateID from ProgramState as p where p.State = 'Active');
SET @inactiveID = (Select ProgramStateID from ProgramState as p where p.State = 'Inactive');

-- -- Inserimento delle prime schede di test
-- INSERT INTO `gymhub_test`.`Program`
-- (`UserID`,`Title`,`Description`,`ProgramStateID`,`NumberOfWorkout`,`createdAt`,`updatedAt`)
-- VALUES
-- (@userID, 'Volume', 'Scheda di volume russo', @activeID, 8,now(),now()),
-- (@userID, 'Intensità', 'Scheda di intensità bulgara', @inactiveID, 4,now(),now()),
-- (@userID, 'Peaking', 'Scheda di Lorenzo', @inactiveID, 3,now(),now());

-- -- Inserimento dei primi esercizi
-- INSERT INTO `gymhub_test`.`Exercise`
-- (`Title`,`Subtitle`,`Description`,`createdAt`,`updatedAt`)
-- VALUES
-- ('Squat','Back Squat','Il grande classico', now(), now()),
-- ('Squat','Front Squat','Il grande classico bulgaro', now(), now()),
-- ('Squat','Sumo Squat','Quello Strano',now(), now()),
-- ('Bench','Bench Press', null, now(), now()),
-- ('Bench','Incline Bench Press', null, now(), now()),
-- ('Bench','Larsen Press', null, now(), now()),
-- ('Bench','SpotoPress', null, now(), now()),
-- ('Deadlift','Conventional', null, now(), now()),
-- ('Deadlift','Sumo', null, now(), now()),
-- ('Deadlift','Trap Bar', null, now(), now());

-- -- Inserimento delle sedute di allenamento di una scheda 
-- INSERT INTO `gymhub_test`.`Workout`
-- (`ProgramID`, `IsDone`, `createdAt`, `updatedAt`)
-- VALUES
-- -- Prima scheda
-- (1, false, now(), now()), (1, false, now(), now()), (1, false, now(), now()), (1, false, now(), now()),
-- (1, false, now(), now()),(1, false, now(), now()),(1, false, now(), now()),(1, false, now(), now()),
-- -- Seconda Scheda
-- (2, false, now(), now()), (2, false, now(), now()), (2, false, now(), now()), (2, false, now(), now()),
-- -- Terza Scheda
-- (3, false, now(), now()), (3, false, now(), now()), (3, false, now(), now());



-- -- Inserimento di esercizi nelle sedute di allenamento di una sched
-- INSERT INTO `gymhub_test`.`Exercises_Workout`
-- (`WorkoutID`, `ExerciseID`, `Set`, `Weight`, `Rep`, `RPE`, `RM`, `Percentage`, `createdAt`, `updatedAt`)
-- Select
-- 	w.WorkoutID ,  FLOOR(RAND()*(10-1+1))+1, FLOOR(RAND()*(12-2+1))+2, FLOOR(RAND()*(150-80+1))+80, 
-- 	 FLOOR(RAND()*(15-2+1))+2, FLOOR(RAND()*(10-5+1))+5, FLOOR(RAND()*(200-50+1))+50,
-- 	 FLOOR(RAND()*(100-50+1))+50, NOW(),NOW()
-- from Workout as w
-- where w.WorkoutID = 15;

