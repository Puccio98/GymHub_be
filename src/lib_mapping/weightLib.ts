import {WeightDto} from "../dto/weightDto/weight-dto";
import {WeightItem} from "../models/weight";
import {PlainWeightDto} from "../dto/weightDto/plain-weight-dto";
import {PlainWeightItem} from "../interfaces/plainWeightItem-interface";

export class WeightLib {
    static WeightDtoToWeightItem(weightDto: WeightDto): WeightItem {
        return {
            UserID: weightDto.userID,
            Weight: weightDto.weight,
            Date: weightDto.date,
            createdAt: weightDto.createdAt,
            updatedAt: weightDto.updatedAt
        } as WeightItem
    }

    static PlainWeightItemToPlainWeightDto(plainWeightItem: PlainWeightItem): PlainWeightDto {
        return {
            monthIndex: plainWeightItem.MonthIndex,
            yearIndex: plainWeightItem.YearIndex,
            weightList: plainWeightItem.WeightList
        } as PlainWeightDto
    }
}
