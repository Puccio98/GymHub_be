import {WeightDto} from "../dto/weightDto/weight.dto";
import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {WeightDao} from "../dao/weight.dao";
import {WeightLib} from "../lib_mapping/weightLib";
import {PlainWeightDto} from "../dto/weightDto/plain-weight.dto";

const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'
let message: string; // messaggio specifico

export class WeightService {
    static async getWeights(userID: number): Promise<ServiceResponse<PlainWeightDto>> {
        try {
            const weightList = await WeightDao.findAllWeights(userID);
            if (!weightList) {
                message = 'No weights found';
                return response(ServiceStatusEnum.ERROR, message);
            } else {
                message = 'Weights returned';
                const data = WeightLib.ChartItemListToPlainWeightDto(weightList);
                return response(ServiceStatusEnum.SUCCESS, message, data);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async postNewWeight(weightDto: WeightDto): Promise<ServiceResponse<PlainWeightDto>> {
        try {
            const existingWeight = await WeightDao.findIfWeightExists(weightDto.date, weightDto.userID);
            if (existingWeight) {
                const result = await WeightDao.updateWeight(existingWeight, weightDto.weight);
                if (result) {
                    const d = await WeightDao.findAllWeights(weightDto.userID);
                    message = 'Peso aggiornato con successo!';
                    const data = WeightLib.ChartItemListToPlainWeightDto(d);
                    return response(ServiceStatusEnum.SUCCESS, message, data);
                } else {
                    message = 'Peso non creato';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            } else {
                const result = await WeightDao.createNewWeight(WeightLib.WeightDtoToWeightItem(weightDto));
                if (result) {
                    const d = await WeightDao.findAllWeights(weightDto.userID);
                    message = 'Peso creato con successo!';
                    const data = WeightLib.ChartItemListToPlainWeightDto(d);
                    return response(ServiceStatusEnum.SUCCESS, message, data);
                } else {
                    message = 'Peso non creato';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }
}
