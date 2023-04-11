import {ProgramController} from "../controllers/program-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();
    const validateDto = require('../middlewares/validateDto');
    const programCreateValidator = require('../validators/program-create-validator');

    router.get('/program_get', ProgramController.getProgramListByUserID);

    router.get('/program_get_exercises', ProgramController.getStandardExercises);

    router.post('/program_create', validateDto(programCreateValidator), ProgramController.create);

    router.delete('/:program_id', ProgramController.delete);

    router.post('/program_complete_exercise', ProgramController.completeExercise);

    router.post('/program_complete_workout', ProgramController.completeWorkout);

    router.post('/program_complete_program', ProgramController.completeProgram);

    app.use('/program', router);
};
