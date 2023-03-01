import {ChartItem} from "../../models/chart-item";

export interface PlainWeightDto {
    currentMonthWeights: ChartItem[];
    currentYearWeights: ChartItem[];
    allWeights: ChartItem[];
}
