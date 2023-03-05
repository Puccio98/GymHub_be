import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {ExerciseDto} from "../dto/programDto/exercise-dto";
import {ExerciseItem} from "../models/exercise";
import {ProgramCreateDTO} from "../dto/programDto/program-create-dto";

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
        const exerciseList: ExerciseItem[] = await ProgramDao.getStandardExercises();
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
    }

    static async createProgram(program: ProgramCreateDTO): Promise<ServiceResponse<ProgramDto[]>> {
        // Disabilita tutti i programmi
        await ProgramDao.setProgramsInactive(program.userID);
        const programItem = ProgramLib.ProgramCreateDtoToProgramItem(program);
        // Insert del programma
        const programID = await ProgramDao.createProgram(programItem);
        if (programID) {
            const workoutItemList = ProgramLib.WorkoutCreateDtoListToWorkoutItemList(program.workoutList, programID);
            for (let w = 0; w < program.workoutList.length; w++) {
                // Insert di un workout
                const workoutID = await ProgramDao.createWorkout(workoutItemList[w]);
                if (workoutID) {
                    const exerciseItemList = ProgramLib.ExerciseCreateDtoListToExerciseWorkoutItemList(program.workoutList[w].exerciseList, workoutID);
                    // Insert di tutti gli allenamenti di un workout contemporaneamente
                    await ProgramDao.createExerciseWorkout(exerciseItemList);
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////
        return await this.getProgramListByUserID(program.userID);
    }
}
