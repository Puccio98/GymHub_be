import {AddRequestDto} from "../dto/requestDto/add-request.dto";
import {RequestItem, UpdateRequestItem} from "../models/request";
import {PlainRequest} from "../interfaces/PlainRequest-interface";
import {PlainRequestDto} from "../dto/requestDto/plain-request.dto";
import {UserLib} from "./userLib";
import {RequestDto} from "../dto/requestDto/request.dto";
import {UpdateRequestDto} from "../dto/requestDto/update-request.dto";

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

    static UpdateRequestDtoToRequestItem(requestDto: UpdateRequestDto): UpdateRequestItem {
        return {
            RequestStateID: requestDto.requestStateID,
        } as UpdateRequestItem
    }

    static PlainRequestListToPlainRequestListDto(plainRequestList: PlainRequest[]): PlainRequestDto[] {
        const res: PlainRequestDto[] = [];
        for (const r of plainRequestList) {
            res.push(this.PlainRequestToPlainRequestDto(r));
        }
        return res;
    }

    static PlainRequestToPlainRequestDto(plainRequest: PlainRequest): PlainRequestDto {
        return {
            u_t: UserLib.UserItemToUserDto(plainRequest.u_t),
            r: this.RequestItemToRequestDto(plainRequest.r)
        } as PlainRequestDto
    }

    static RequestItemToRequestDto(requestItem: RequestItem): RequestDto {
        return {
            fromUser: requestItem.FromUserID,
            toUser: requestItem.ToUserID,
            state: requestItem.RequestStateID,
            type: requestItem.RequestTypeID,
        }

    }
}