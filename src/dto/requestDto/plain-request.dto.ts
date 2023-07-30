import {UserDto} from "../authDto/user.dto";
import {RequestDto} from "./request.dto";

export interface PlainRequestDto {
    r: RequestDto,
    u_t: UserDto
}