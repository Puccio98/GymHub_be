import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {ExerciseDto} from "../dto/programDto/exercise-dto";

export class ProgramService {

    static async getProgramListByUserID(userID: number): Promise<ServiceResponse<ProgramDto[]>> {
        const programList = await ProgramDao.getProgramListByUserID(userID);
        if (programList.length) {
            return {
                data: ProgramLib.PlainProgramItemListToProgramDtoList(programList),
                status: ServiceStatusEnum.SUCCESS,
                message: 'Program found and returned'
            };
        } else {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Programs not found'
            };
        }
    }

    static async getStandardExercises(): Promise<ServiceResponse<ExerciseDto[]>> {
        const exerciseList: ExerciseDto[] = await ProgramDao.getStandardExercises();
        if (exerciseList.length) {
            return {
                data: exerciseList,
                status: ServiceStatusEnum.SUCCESS,
                message: 'User found'
            }
        } else {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'No exercises found'
            };
        }
    }
}
