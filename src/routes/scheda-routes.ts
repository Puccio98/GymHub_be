import {SchedaController} from "../controllers/scheda-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.post('/fetchExercises', SchedaController.fetchExercises);

    router.post('/postScheda', SchedaController.postNewScheda);

    app.use('/scheda', router);
};