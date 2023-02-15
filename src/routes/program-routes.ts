import {ProgramController} from "../controllers/program-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.post('/program_get', ProgramController.getProgramListByUtente);

    //router.post('/signup', ProgramController.signup);

    app.use('/program', router);
};
