import {Response} from "express";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/service-return-type.interface";
import {IGetUserAuthInfoRequest} from "../helpers/auth.helper";
import {UserService} from "../services/user-service";
import {UserDto, UserInfoDto} from "../dto/authDto/user.dto";
import {UserHelper} from "../helpers/user.helper";
import {UserTypeEnum} from "../enums/user-type.enum";


export class UserController {

    static get = async (req: IGetUserAuthInfoRequest, res: Response) => {
        // Retrieve query string
        const userType: any = req.query.userType;
        const userDescription: any = req.query.userDescription;
        let userTypeParsed: UserTypeEnum | null = null;
        let userDescriptionParsed: string | null = null;
        try {
            userTypeParsed = Number(userType) ? Number(userType) : null;
            userDescriptionParsed = userDescription ? userDescription.toString().trim() : null;

            if (userTypeParsed && !UserHelper.isUserTypeValid(userTypeParsed)) {
                return res.status(400).send({error: 'Invalid user type'});
            }
        } catch (e) {
            return res.status(500).send({error: 'Errore durante  la deserializzazione'});
        }


        const response: ServiceResponse<UserDto[]> = await UserService.get(userTypeParsed, userDescriptionParsed);

        switch (response.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(response.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: response.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static getUserInfo = async (req: IGetUserAuthInfoRequest, res: Response) => {
        // Retrieve query string
        const userID: number = Number(req.params['user_id']);
        if (userID) {
            return res.status(500).send({error: 'Errore durante  la deserializzazione'});
        }

        const response: ServiceResponse<UserInfoDto> = await UserService.getByUserID(userID);

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
