import {RequestState} from "../enums/request-state.enum";
import {RequestType} from "../enums/request-type.enum";

export interface RequestItem {
    RequestID?: number;
    FromUserID: number;
    ToUserID: number;
    RequestStateID: RequestState;
    RequestTypeID: RequestType;
    createdAt: Date;
    updatedAt: Date;
}

export {}
