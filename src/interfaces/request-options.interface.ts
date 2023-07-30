import {RequestStateEnum} from "../enums/request-state.enum";
import {RequestType} from "../enums/request-type.enum";

export interface RequestOptions {
    FromUserID: number | null;
    ToUserID: number | null;
    RequestState: RequestStateEnum | null;
    RequestType: RequestType | null;
}