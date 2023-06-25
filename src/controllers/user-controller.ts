import {Response} from "express";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {UserService} from "../services/user-service";
import {UserDto} from "../dto/authDto/user-dto";


export class UserController {

    static getAll = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const response: ServiceResponse<UserDto[]> = await UserService.getAll();

        switch (response.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(response.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: response.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
}
