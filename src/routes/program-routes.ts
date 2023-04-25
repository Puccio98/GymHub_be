import {ProgramController} from "../controllers/program-controller";
import {addWorkoutType} from "../validators/add-workout-validator";
import {addExerciseType} from "../validators/add-exercise-validator";
import {createProgramType} from "../validators/program-create-validator";
import {updateWorkoutType} from "../validators/update-workout-validator";
import {deleteExerciseType} from "../validators/delete-exercise-validator";
import {updateExerciseType} from "../validators/update-exercise-validator";
import {refreshTokenType} from "../validators/refresh-token.validator";
import {validateDto} from "../middlewares/validateDto";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/program_get', ProgramController.getProgramListByUserID);

    router.get('/program_get_exercises', ProgramController.getStandardExercises);

    router.post('/program_create', validateDto(createProgramType), ProgramController.create);

    router.delete('/:program_id', ProgramController.delete);

    router.post('/program_delete_workout', validateDto(updateWorkoutType), ProgramController.deleteWorkout);

    router.post('/program_delete_exercise', validateDto(deleteExerciseType), ProgramController.deleteExercise);

    router.post('/program_update_exercise', validateDto(updateExerciseType), ProgramController.updateExercise);

    router.post('/program_update_workout', validateDto(updateWorkoutType), ProgramController.updateWorkout);

    router.post('/program_add_workout', validateDto(addWorkoutType), ProgramController.addWorkout);

    router.post('/program_add_exercise', validateDto(addExerciseType), ProgramController.addExercise);

    router.post('/program_refresh_program', validateDto(refreshTokenType), ProgramController.refreshProgram);


    app.use('/program', router);
};
