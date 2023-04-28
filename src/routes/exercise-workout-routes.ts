import {validateDto} from "../middlewares/validateDto";
import {deleteExerciseType} from "../validators/delete-exercise-validator";
import {ExerciseWorkoutController} from "../controllers/exercise-workout-controller";
import {updateExerciseType} from "../validators/update-exercise-validator";
import {addExerciseType} from "../validators/add-exercise-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.post('/program_delete_exercise', validateDto(deleteExerciseType), ExerciseWorkoutController.delete);

    router.post('/program_update_exercise', validateDto(updateExerciseType), ExerciseWorkoutController.update);

    router.post('/program_add_exercise', validateDto(addExerciseType), ExerciseWorkoutController.create);

    app.use('/exercise-workout', router);
}
