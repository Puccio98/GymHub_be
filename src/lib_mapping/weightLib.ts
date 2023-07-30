import {WeightDto} from "../dto/weightDto/weight.dto";
import {WeightItem} from "../models/weight";
import {PlainWeightDto} from "../dto/weightDto/plain-weight.dto";
import {PlainWeightItem} from "../interfaces/plainWeightItem-interface";
import {ChartItem} from "../models/chart-item";

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

    static ChartItemListToPlainWeightDto(weightList: ChartItem[]): PlainWeightDto {
        const today = new Date();
        const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
        const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));

        const monthIndex = weightList.findIndex((w) => {
            return w.x > lastMonth;
        });

        const yearIndex = weightList.findIndex((w) => {
            return w.x > lastYear;
        });

        return WeightLib.PlainWeightItemToPlainWeightDto({
            WeightList: weightList,
            MonthIndex: monthIndex,
            YearIndex: yearIndex
        });

    }
}
