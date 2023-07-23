import {RequestItem} from "../models/request";
import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {RequestDao} from "../dao/request-dao";

const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'
let message: string;

export class RequestService {

    static async create(requestItem: RequestItem): Promise<ServiceResponse<boolean>> {
        try {
            const requestID: number = await RequestDao.create(requestItem);
            if (!requestID)
                return response(ServiceStatusEnum.ERROR, 'Non è stato possibile creare la richiesta');

            return response(ServiceStatusEnum.SUCCESS, 'Richiesta creata con successo', true);
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

}
