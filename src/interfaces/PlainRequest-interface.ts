import {RequestItem} from "../models/request";
import {UserItem} from "../models/user";

export interface PlainRequest {
    r: RequestItem,
    u_t: UserItem
}