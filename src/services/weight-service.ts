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
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();

                const currentMonthWeights = weights.filter((w) => {
                    if (w.Date.getMonth() === currentMonth && w.Date.getFullYear() === currentYear) {
                        return true;
                    }
                });

                const currentYearWeights = weights.filter((w) => {
                    return w.Date.getFullYear() === currentYear;
                })

                const plainWeightsDto = WeightLib.WeightItemToPlainWeightDto(currentMonthWeights, currentYearWeights, weights);

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
                message: 'Data not returned'
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
