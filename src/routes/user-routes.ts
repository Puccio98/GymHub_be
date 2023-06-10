import {UserController} from "../controllers/user-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('', UserController.getAll);

    app.use('/user', router);
};
