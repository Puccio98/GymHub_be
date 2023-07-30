import {UserDao} from "../dao/user-dao";
import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {UserItem} from "../models/user";
import {UserLib} from "../lib_mapping/userLib";
import {UserDto, UserInfoDto} from "../dto/authDto/user-dto";
import {UserType} from "../enums/user-type.enum";


const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'

export class UserService {
    static async get(userTypeID: UserType | null, userDescription: string | null): Promise<ServiceResponse<UserDto[]>> {
        try {
            const userList: UserItem[] = await UserDao.get(userTypeID, userDescription);
            return response(ServiceStatusEnum.SUCCESS, 'Lista di utenti', UserLib.UserItemListToUserDtoList(userList));
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async getByUserID(userID: number): Promise<ServiceResponse<UserInfoDto>> {
        try {
            const userList: UserItem[] = await UserDao.getByID(userID);
            if (userList.length !== 1) {
                return response(ServiceStatusEnum.ERROR, 'Non è stato possibile recuperare l\'utente tramite ID');
            }

            return response(ServiceStatusEnum.SUCCESS, 'Informazioni utente', UserLib.UserItemToUserInfoDto(userList[0]));
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

}
