import {RequestStateEnum} from "../../enums/request-state.enum";

export interface UpdateRequestDto {
    requestID: number,
    requestStateID: RequestStateEnum
}