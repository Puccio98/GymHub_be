import {ProgramController} from "../controllers/program-controller";
import {createProgramType} from "../validators/program-create-validator";
import {validateDto} from "../middlewares/validateDto";
import {editProgramType} from "../validators/edit-program-validator";
import {shareProgramType} from "../validators/share-program-validator"

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/program_get', ProgramController.getListByUserID);

    router.post('/program_create', validateDto(createProgramType), ProgramController.create);

    router.delete('/:program_id', ProgramController.delete);

    router.patch('/:program_id/reset', ProgramController.reset);

    router.patch('/:program_id', validateDto(editProgramType), ProgramController.edit);

    router.post('/share', validateDto(shareProgramType), ProgramController.share);

    router.get('/shared/user/:user_id', ProgramController.getShared);


    app.use('/program', router);
};
