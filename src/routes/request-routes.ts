import {RequestController} from "../controllers/request-controller";
import {validateDto} from "../middlewares/validateDto";
import {createRequestType} from "../validators/create-request-validator";
import {updateRequestType} from "../validators/update-request-type-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('', RequestController.get);

    router.post('', validateDto(createRequestType), RequestController.create);

    router.patch('', validateDto(updateRequestType), RequestController.update);

    app.use('/request', router);
};
