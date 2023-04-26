import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ExerciseDto} from "../dto/programDto/exercise-dto";
import {ExerciseItem} from "../models/exercise";
import {ExerciseDao} from "../dao/exercise-dao";
import {ProgramLib} from "../lib_mapping/programLib";

export class ExerciseService {
    static async getList(): Promise<ServiceResponse<ExerciseDto[]>> {
        try {
            const exerciseList: ExerciseItem[] = await ExerciseDao.getList();
            if (exerciseList.length) {
                return {
                    data: ProgramLib.ExerciseItemListToExerciseDtoList(exerciseList),
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'User found'
                }
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'No exercises found'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }
}
