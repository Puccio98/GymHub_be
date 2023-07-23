import {RequestController} from "../controllers/request-controller";
import {validateDto} from "../middlewares/validateDto";
import {createRequestType} from "../validators/create-request-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('', RequestController.get);

    router.post('', validateDto(createRequestType), RequestController.create);

    app.use('/request', router);
};
