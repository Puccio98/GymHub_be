import {WeightDto} from "../dto/weightDto/weight-dto";
import {WeightItem} from "../models/weight";
import {PlainWeightDto} from "../dto/weightDto/plain-weight-dto";
import {ChartItem} from "../models/chart-item";

export class WeightLib {
    static WeightItemListToWeightDtoList(weightItems: WeightItem[]): WeightDto[] {
        let weightListDto: WeightDto[] = [];
        for (let weight of weightItems) {
            const newDto: WeightDto = {
                weightID: weight.WeightID,
                userID: weight.UserID,
                weight: weight.Weight,
                date: weight.Date
            } as WeightDto;
            weightListDto.push(newDto);
        }
        return weightListDto;
    }

    static WeightDtoToWeightItem(weightDto: WeightDto): WeightItem {
        return {
            UserID: weightDto.userID,
            Weight: weightDto.weight,
            Date: weightDto.date,
            createdAt: weightDto.createdAt,
            updatedAt: weightDto.updatedAt
        } as WeightItem
    }

    static ChartWeightItemToPlainWeightDto(lastMonthWeights: ChartItem[], lastYearWeights: ChartItem[], allWeights: ChartItem[]): PlainWeightDto {
        return {
            lastMonthWeights: lastMonthWeights,
            lastYearWeights: lastYearWeights,
            allWeights: allWeights
        } as PlainWeightDto
    }
}
