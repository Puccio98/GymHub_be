import {RequestType} from "../../enums/request-type.enum";
import {RequestState} from "../../enums/request-state.enum";

export interface AddRequestDto {
    toUserID: number;
    requestTypeID: RequestType;
    requestStateID: RequestState;
    createdAt: Date;
    updatedAt: Date;
}