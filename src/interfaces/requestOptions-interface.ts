import {RequestState} from "../enums/request-state.enum";
import {RequestType} from "../enums/request-type.enum";

export interface RequestOptions {
    FromUserID: number | null;
    ToUserID: number | null;
    RequestState: RequestState | null;
    RequestType: RequestType | null;
}