import {validateDto} from "../middlewares/validateDto";
import {updateWorkoutType} from "../validators/update-workout-validator";
import {WorkoutController} from "../controllers/workout-controller";
import {addWorkoutType} from "../validators/add-workout-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.post('/program_delete_workout', validateDto(updateWorkoutType), WorkoutController.delete);

    router.post('/program_update_workout', validateDto(updateWorkoutType), WorkoutController.update);

    router.post('/program_add_workout', validateDto(addWorkoutType), WorkoutController.create);

    app.use('/workout', router);
}
