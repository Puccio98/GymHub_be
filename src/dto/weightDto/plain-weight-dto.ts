import {WeightItem} from "../../models/weight";

export interface PlainWeightDto {
    currentMonthWeights: WeightItem[];
    currentYearWeights: WeightItem[];
    allWeights: WeightItem[];
}
