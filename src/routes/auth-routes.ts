import {AuthController} from "../controllers/auth-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.post('/login', AuthController.login);

    router.post('/signup', AuthController.signup);

    app.use('/auth', router);
};
