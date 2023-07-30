import {ChartInterface} from "../../interfaces/chart.interface";

export interface PlainWeightDto {
    monthIndex: number;
    yearIndex: number;
    weightList: ChartInterface[];
}
