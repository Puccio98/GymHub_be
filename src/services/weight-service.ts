import {WeightDto} from "../dto/weightDto/weight-dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {WeightDao} from "../dao/weight-dao";
import {WeightLib} from "../lib_mapping/weightLib";

export class WeightService {
    static async getWeights(userID: number): Promise<ServiceResponse<WeightDto[]>> {
        try {
            const weights = await WeightDao.findAllWeights(userID);
            if (weights) {
                return {
                    data: WeightLib.WeightItemListToWeightDtoList(weights),
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
            const doesWeightExistAlready = await WeightDao.findExistingWeight(weightDto.date);
            if (!doesWeightExistAlready) {
                const result = await WeightDao.createNewWeight(WeightLib.WeightDtoToWeightItem(weightDto));
                console.log(result);
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
