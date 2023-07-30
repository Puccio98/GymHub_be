import {ProgramController} from "../controllers/program.controller";
import {createProgramType} from "../validators/program-create-validator";
import {validateDtoMiddleware} from "../middlewares/validate-dto.middleware";
import {editProgramType} from "../validators/edit-program-validator";
import {shareProgramType} from "../validators/share-program-validator"
import {WorkoutController} from "../controllers/workout.controller";
import {addWorkoutType} from "../validators/add-workout-validator";
import {updateWorkoutType} from "../validators/update-workout-validator";
import {ExerciseWorkoutController} from "../controllers/exercise-workout.controller";
import {updateExerciseType} from "../validators/update-exercise-validator";
import {addExerciseType} from "../validators/add-exercise-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    // Program
    router.get('', ProgramController.getListByUserID);

    router.post('', validateDtoMiddleware(createProgramType), ProgramController.create);

    router.patch('/:program_id', validateDtoMiddleware(editProgramType), ProgramController.update);

    router.put('/:program_id', validateDtoMiddleware(createProgramType), ProgramController.edit);

    router.delete('/:program_id', ProgramController.delete);

    router.patch('/:program_id/reset', ProgramController.reset);

    // Shared Program
    router.post('/share', validateDtoMiddleware(shareProgramType), ProgramController.share);

    router.get('/share/user/:user_id', ProgramController.getShared);

    // Workout
    router.post('/:program_id/workout', validateDtoMiddleware(addWorkoutType), WorkoutController.create);

    router.patch('/:program_id/workout/:workout_id', validateDtoMiddleware(updateWorkoutType), WorkoutController.update);

    router.delete('/:program_id/workout/:workout_id', WorkoutController.delete);

    // Exercise_Workout
    router.post('/:program_id/workout/:workout_id/exercise', validateDtoMiddleware(addExerciseType), ExerciseWorkoutController.create);

    router.patch('/:program_id/workout/:workout_id/exercise/:exercise_id', validateDtoMiddleware(updateExerciseType), ExerciseWorkoutController.update);

    router.delete('/:program_id/workout/:workout_id/exercise/:exercise_id', ExerciseWorkoutController.delete);

    // Base url
    app.use('/program', router);
};
