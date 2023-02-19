import {ProgramController} from "../controllers/program-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/program_get/:user_id', ProgramController.getProgramListByUserID);

    app.use('/program', router);
};
