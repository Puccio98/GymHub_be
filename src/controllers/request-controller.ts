import {Response} from "express";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {AddRequestDto} from "../dto/requestDto/add-request.dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {RequestService} from "../services/request-service";
import {RequestItem} from "../models/request";
import {RequestLib} from "../lib_mapping/requestLib";
import {RequestState} from "../enums/request-state.enum";
import {RequestType} from "../enums/request-type.enum";
import {RequestHelper} from "../helpers/RequestHelper";
import {RequestOptions} from "../interfaces/requestOptions-interface";
import {PlainRequest} from "../interfaces/PlainRequest-interface";


export class RequestController {

    static get = async (req: IGetUserAuthInfoRequest, res: Response) => {
        // Retrieve query string
        const userJWT = req.AccessPayloadJWT;
        const requestState: any = req.query.requestState;
        const requestType: any = req.query.requestType;
        const toUser: any = req.query.toUser;
        let requestStateParsed: RequestState | null = null;
        let requestTypeParsed: RequestType | null = null;
        let toUserParsed: number | null = null;
        try {
            requestStateParsed = Number(requestState) ? Number(requestState) : null;
            requestTypeParsed = Number(requestType) ? Number(requestType) : null;
            toUserParsed = Number(toUser) ? Number(toUser) : null;

            if (requestStateParsed && !RequestHelper.isRequestStateValid(requestState)) {
                return res.status(400).send({error: 'Invalid request state'});
            }
            if (requestTypeParsed && !RequestHelper.isRequestTypeValid(requestType)) {
                return res.status(400).send({error: 'Invalid request type'});
            }
            
        } catch (e) {
            return res.status(500).send({error: 'Errore durante  la deserializzazione'});
        }
        const requestOptions: RequestOptions = {
            FromUserID: userJWT.UserID,
            ToUserID: toUserParsed,
            RequestType: requestTypeParsed,
            RequestState: requestStateParsed
        }

        const requestResponse: ServiceResponse<PlainRequest[]> = await RequestService.get(requestOptions);
        switch (requestResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(RequestLib.PlainRequestListToPlainRequestListDto(requestResponse.data ?? []));
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: requestResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }

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
