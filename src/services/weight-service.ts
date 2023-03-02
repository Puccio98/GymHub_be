import {WeightDto} from "../dto/weightDto/weight-dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {WeightDao} from "../dao/weight-dao";
import {WeightLib} from "../lib_mapping/weightLib";
import {PlainWeightDto} from "../dto/weightDto/plain-weight-dto";

export class WeightService {
    static async getWeights(userID: number): Promise<ServiceResponse<PlainWeightDto>> {
        try {
            const weights = await WeightDao.findAllWeights(userID);
            if (weights) {
                const today = new Date();
                const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
                const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));

                const lastMonthWeights = weights.filter((w) => {
                    return w.x > lastMonth;
                });

                const lastYearWeights = weights.filter((w) => {
                    return w.x > lastYear;
                });

                const plainWeightsDto = WeightLib.ChartWeightItemToPlainWeightDto(lastMonthWeights, lastYearWeights, weights);

                return {
                    data: plainWeightsDto,
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Data returned'
                }
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'No weights found'
                }
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async postNewWeight(weightDto: WeightDto): Promise<ServiceResponse<any>> {
        try {
            const doesWeightExistAlready = await WeightDao.findExistingWeight(weightDto.date, weightDto.userID);
            if (!doesWeightExistAlready) {
                const result = await WeightDao.createNewWeight(WeightLib.WeightDtoToWeightItem(weightDto));
                if (result) {
                    return {
                        status: ServiceStatusEnum.SUCCESS,
                        message: 'Peso creato!'
                    }
                } else {
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'Peso non creato'
                    }
                }
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Hai già inserito un peso in questa data!'
                }
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Db esplode'
            }
        }
    }
}
