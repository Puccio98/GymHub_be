import {AuthController} from "../controllers/auth.controller";
import {validateDtoMiddleware} from "../middlewares/validate-dto.middleware";
import {loginType} from "../validators/login-validator";
import {signupType} from "../validators/signup-validator";
import {refreshTokenType} from "../validators/refresh-token.validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.post('/login', validateDtoMiddleware(loginType), AuthController.login);

    router.post('/signup', validateDtoMiddleware(signupType), AuthController.signup);

    router.post('/refresh', validateDtoMiddleware(refreshTokenType), AuthController.refreshToken);

    router.get('/logout', AuthController.logout);

    app.use('/auth', router);
};
