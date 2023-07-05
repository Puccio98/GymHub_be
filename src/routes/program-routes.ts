import {ProgramController} from "../controllers/program-controller";
import {createProgramType} from "../validators/program-create-validator";
import {validateDto} from "../middlewares/validateDto";
import {editProgramType} from "../validators/edit-program-validator";
import {shareProgramType} from "../validators/share-program-validator"
import {WorkoutController} from "../controllers/workout-controller";
import {addWorkoutType} from "../validators/add-workout-validator";
import {updateWorkoutType} from "../validators/update-workout-validator";
import {ExerciseWorkoutController} from "../controllers/exercise-workout-controller";
import {updateExerciseType} from "../validators/update-exercise-validator";
import {addExerciseType} from "../validators/add-exercise-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    // Program
    router.get('', ProgramController.getListByUserID);

    router.post('', validateDto(createProgramType), ProgramController.create);

    router.patch('/:program_id', validateDto(editProgramType), ProgramController.update);

    router.put('/:program_id', validateDto(createProgramType), ProgramController.edit);

    router.delete('/:program_id', ProgramController.delete);

    router.patch('/:program_id/reset', ProgramController.reset);

    // Shared Program
    router.post('/share', validateDto(shareProgramType), ProgramController.share);

    router.get('/share/user/:user_id', ProgramController.getShared);

    // Workout
    router.post('/:program_id/workout', validateDto(addWorkoutType), WorkoutController.create);

    router.patch('/:program_id/workout/:workout_id', validateDto(updateWorkoutType), WorkoutController.update);

    router.delete('/:program_id/workout/:workout_id', WorkoutController.delete);

    // Exercise_Workout
    router.post('/:program_id/workout/:workout_id/exercise', validateDto(addExerciseType), ExerciseWorkoutController.create);

    router.patch('/:program_id/workout/:workout_id/exercise/:exercise_id', validateDto(updateExerciseType), ExerciseWorkoutController.update);

    router.delete('/:program_id/workout/:workout_id/exercise/:exercise_id', ExerciseWorkoutController.delete);

    // Base url
    app.use('/program', router);
};
