import {AddRequestDto} from "../dto/requestDto/add-request.dto";
import {RequestItem} from "../models/request";

export class RequestLib {
    static AddRequestDtoToRequestItem(fromUserID: number, requestDto: AddRequestDto): RequestItem {
        return {
            FromUserID: fromUserID,
            ToUserID: requestDto.toUserID,
            RequestTypeID: requestDto.requestTypeID,
            RequestStateID: requestDto.requestStateID,
            createdAt: requestDto.createdAt,
            updatedAt: requestDto.updatedAt
        } as RequestItem
    }
}