import {ProgramController} from "../controllers/program-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();
    const validateDto = require('../middlewares/validateDto');
    const programCreateValidator = require('../validators/program-create-validator');

    router.get('/program_get/:user_id', ProgramController.getProgramListByUserID);

    router.get('/program_get_exercises', ProgramController.getStandardExercises);

    router.post('/program_create', validateDto(programCreateValidator), ProgramController.create)

    app.use('/program', router);
};
