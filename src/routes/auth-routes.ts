import {AuthController} from "../controllers/auth-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();
    const validateDto = require('../middlewares/validateDto');
    const loginValidator = require('../validators/login-validator');
    const signupValidator = require('../validators/signup-validator');

    router.post('/login', validateDto(loginValidator), AuthController.login);

    router.post('/signup', validateDto(signupValidator), AuthController.signup);

    router.post('/token', AuthController.token);

    router.delete('/logout', AuthController.logout);

    app.use('/auth', router);
};
