import {ChartItem} from "../../models/chart-item";

export interface PlainWeightDto {
    lastMonthWeights: ChartItem[];
    lastYearWeights: ChartItem[];
    allWeights: ChartItem[];
}
