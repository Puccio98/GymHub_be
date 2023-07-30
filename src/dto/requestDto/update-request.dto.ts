import {RequestState} from "../../enums/request-state.enum";

export interface UpdateRequestDto {
    requestID: number,
    requestStateID: RequestState
}