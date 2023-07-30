import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/service-return-type.interface";
import {ExerciseDto} from "../dto/programDto/exercise.dto";
import {ExerciseItem} from "../models/exercise";
import {ExerciseDao} from "../dao/exercise.dao";
import {ProgramLib} from "../lib_mapping/program.lib";

const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'
let message: string; // messaggio specifico

export class ExerciseService {
    static async getList(): Promise<ServiceResponse<ExerciseDto[]>> {
        try {
            const exerciseList: ExerciseItem[] = await ExerciseDao.getList();
            if (exerciseList.length) {
                message = 'User found';
                const data = ProgramLib.ExerciseItemListToExerciseDtoList(exerciseList);
                return response(ServiceStatusEnum.SUCCESS, message, data);
            } else {
                message = 'No exercises found';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }
}
