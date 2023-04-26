import {ExerciseController} from "../controllers/exercise-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/program_get_exercises', ExerciseController.getList);

    app.use('/exercise', router);
}
