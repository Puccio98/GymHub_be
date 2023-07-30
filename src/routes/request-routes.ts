import {RequestController} from "../controllers/request.controller";
import {validateDtoMiddleware} from "../middlewares/validate-dto.middleware";
import {createRequestType} from "../validators/create-request-validator";
import {updateRequestType} from "../validators/update-request-type-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('', RequestController.get);

    router.post('', validateDtoMiddleware(createRequestType), RequestController.create);

    router.patch('', validateDtoMiddleware(updateRequestType), RequestController.update);

    app.use('/request', router);
};
