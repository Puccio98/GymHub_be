import {Response} from "express";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {AddRequestDto} from "../dto/requestDto/add-request.dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {RequestService} from "../services/request-service";
import {RequestItem} from "../models/request";
import {RequestLib} from "../lib_mapping/requestLib";


export class RequestController {

    static get = async (req: IGetUserAuthInfoRequest, res: Response) => {
    }

    static create = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const addRequestDto: AddRequestDto = req.body;
        const addRequestItem: RequestItem = RequestLib.AddRequestDtoToRequestItem(userJWT.UserID, addRequestDto);

        const addRequestResponse: ServiceResponse<boolean> = await RequestService.create(addRequestItem);
        switch (addRequestResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(addRequestResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: addRequestResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
}
