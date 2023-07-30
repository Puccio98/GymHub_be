import {RequestState} from "../../enums/request-state.enum";
import {RequestType} from "../../enums/request-type.enum";

export interface RequestDto {
    requestID: number,
    fromUser: number,
    toUser: number,
    state: RequestState,
    type: RequestType
}