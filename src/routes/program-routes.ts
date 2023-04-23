import {ProgramController} from "../controllers/program-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();
    const validateDto = require('../middlewares/validateDto');
    const programCreateValidator = require('../validators/program-create-validator');
    const updateExerciseValidator = require('../validators/update-exercise-validator');
    const updateWorkoutValidator = require('../validators/update-workout-validator');
    const addWorkoutValidator = require('../validators/add-workout-validator');
    const addExerciseValidator = require('../validators/add-exercise-validator');
    const refreshProgramValidator = require('../validators/update-program-validator');

    router.get('/program_get', ProgramController.getProgramListByUserID);

    router.get('/program_get_exercises', ProgramController.getStandardExercises);

    router.post('/program_create', validateDto(programCreateValidator), ProgramController.create);

    router.delete('/:program_id', ProgramController.delete);

    router.post('/program_update_exercise', validateDto(updateExerciseValidator), ProgramController.updateExercise);

    router.post('/program_update_workout', validateDto(updateWorkoutValidator), ProgramController.updateWorkout);

    router.post('/program_add_workout', validateDto(addWorkoutValidator), ProgramController.addWorkout);

    router.post('/program_add_exercise', validateDto(addExerciseValidator), ProgramController.addExercise);

    router.post('/program_refresh_program', validateDto(refreshProgramValidator), ProgramController.refreshProgram);

    router.post('/program_delete_workout', validateDto(updateWorkoutValidator), ProgramController.deleteWorkout);

    app.use('/program', router);
};
