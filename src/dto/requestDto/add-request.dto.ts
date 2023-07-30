import {RequestType} from "../../enums/request-type.enum";
import {RequestStateEnum} from "../../enums/request-state.enum";

export interface AddRequestDto {
    toUserID: number;
    requestTypeID: RequestType;
    requestStateID: RequestStateEnum;
    createdAt: Date;
    updatedAt: Date;
}