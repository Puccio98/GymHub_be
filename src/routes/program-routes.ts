import {ProgramController} from "../controllers/program-controller";
import {createProgramType} from "../validators/program-create-validator";
import {refreshTokenType} from "../validators/refresh-token.validator";
import {validateDto} from "../middlewares/validateDto";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/program_get', ProgramController.getListByUserID);

    router.post('/program_create', validateDto(createProgramType), ProgramController.create);

    router.delete('/:program_id', ProgramController.delete);

    router.post('/program_refresh_program', validateDto(refreshTokenType), ProgramController.refresh);


    app.use('/program', router);
};
