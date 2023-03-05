import {WeightDto} from "../dto/weightDto/weight-dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {WeightDao} from "../dao/weight-dao";
import {WeightLib} from "../lib_mapping/weightLib";
import {PlainWeightDto} from "../dto/weightDto/plain-weight-dto";

export class WeightService {
    static async getWeights(userID: number): Promise<ServiceResponse<PlainWeightDto>> {
        try {
            const weightList = await WeightDao.findAllWeights(userID);
            if (!weightList) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'No weights found'
                }
            } else {
                const today = new Date();
                const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
                const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));

                const monthIndex = weightList.findIndex((w) => {
                    return w.x > lastMonth;
                });

                const yearIndex = weightList.findIndex((w) => {
                    return w.x > lastYear;
                });

                const plainWeightsDto = WeightLib.PlainWeightItemToPlainWeightDto({
                    WeightList: weightList,
                    MonthIndex: monthIndex,
                    YearIndex: yearIndex
                });

                return {
                    data: plainWeightsDto,
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Data returned'
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
            const doesWeightExistAlready = await WeightDao.findIfWeightExists(weightDto.date, weightDto.userID);
            if (doesWeightExistAlready) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Hai già inserito un peso in questa data!'
                }
            } else {
                const result = await WeightDao.createNewWeight(WeightLib.WeightDtoToWeightItem(weightDto));
                if (result) {
                    return {
                        data: true,
                        status: ServiceStatusEnum.SUCCESS,
                        message: 'Peso creato con successo!'
                    }
                } else {
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'Peso non creato'
                    }
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
