import {ChartItem} from "../../models/chart-item";

export interface PlainWeightDto {
    monthIndex: number;
    yearIndex: number;
    weightList: ChartItem[];
}
