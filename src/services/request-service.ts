import {RequestItem} from "../models/request";
import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {RequestDao} from "../dao/request-dao";
import {RequestOptions} from "../interfaces/requestOptions-interface";
import {PlainRequest} from "../interfaces/PlainRequest-interface";

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

    static async get(requestOptions: RequestOptions): Promise<ServiceResponse<PlainRequest[]>> {
        try {
            const requestList: PlainRequest[] = await RequestDao.get(requestOptions);
            return response(ServiceStatusEnum.SUCCESS, 'Lista di richieste', requestList);
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

}
