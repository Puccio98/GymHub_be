import {RequestStateEnum} from "../enums/request-state.enum";
import {RequestType} from "../enums/request-type.enum";

export interface UpdateRequestItem {
    RequestID: number;
    RequestStateID: RequestStateEnum;
}

export interface RequestItem {
    RequestID?: number;
    FromUserID: number;
    ToUserID: number;
    RequestStateID: RequestStateEnum;
    RequestTypeID: RequestType;
    createdAt: Date;
    updatedAt: Date;
}

export {}
