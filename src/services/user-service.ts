import {UserDao} from "../dao/user-dao";
import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {UserItem} from "../models/user";


const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'
let message: string;

export class UserService {
    static async getAll(): Promise<ServiceResponse<UserItem[]>> {
        try {
            const userList: UserItem[] = await UserDao.getAll();
            return response(ServiceStatusEnum.SUCCESS, 'Lista di utenti', userList);
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

}
