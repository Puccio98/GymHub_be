import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {ExerciseDto} from "../dto/programDto/exercise-dto";
import {ExerciseItem} from "../models/exercise";
import {ProgramCreateDTO} from "../dto/programDto/program-create-dto";
import {UpdateExerciseDto} from "../dto/programDto/update-exercise.dto";
import {UpdateWorkoutDto} from "../dto/programDto/update-workout.dto";

export class ProgramService {

    static async getProgramListByUserID(userID: number): Promise<ServiceResponse<ProgramDto[]>> {
        try {
            const programList = await ProgramDao.getProgramListByUserID(userID);
            if (programList.length) {
                return {
                    data: ProgramLib.PlainProgramItemListToProgramDtoList(programList),
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Program found and returned'
                };
            } else {
                return {
                    data: [],
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'You have 0 programs apparently'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async getStandardExercises(): Promise<ServiceResponse<ExerciseDto[]>> {
        try {
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
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async createProgram(program: ProgramCreateDTO): Promise<ServiceResponse<ProgramDto[]>> {
        try {
            // Mette inattivi tutti i programmi
            await ProgramDao.setProgramsInactive(program.userID);
            const programItem = ProgramLib.ProgramCreateDtoToProgramItem(program);
            // Insert del nuovo programma
            const programID = await ProgramDao.createProgram(programItem);
            if (programID) {
                const workoutItemList = ProgramLib.WorkoutCreateDtoListToWorkoutItemList(program.workoutList, programID);
                for (let w = 0; w < program.workoutList.length; w++) {
                    // Insert degli allenamenti uno alla volta
                    const workoutID = await ProgramDao.createWorkout(workoutItemList[w]);
                    if (workoutID) {
                        const exerciseItemList = ProgramLib.ExerciseCreateDtoListToExerciseWorkoutItemList(program.workoutList[w].exerciseList, workoutID);
                        // Insert di tutti gli esercizi di un workout contemporaneamente
                        await ProgramDao.createExerciseWorkout(exerciseItemList);
                    }
                }
            }
            // Recupero la lista di tutti i programmi dell'utente
            return await this.getProgramListByUserID(program.userID);
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async delete(programID: number, userID: number): Promise<ServiceResponse<boolean>> {
        try {
            if (await ProgramDao.delete(programID, userID)) {
                return {
                    data: true,
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Program deleted'
                };
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'User can\'t delete the requested program'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async completeExercise(exercise: UpdateExerciseDto, userID: number): Promise<ServiceResponse<boolean>> {
        try {
            if (await ProgramDao.completeExercise(exercise, userID)) {
                return {
                    data: true,
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Exercise completed'
                };
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'User can\'t update the requested exercise'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async completeWorkout(workoutDto: UpdateWorkoutDto, userID: number): Promise<ServiceResponse<boolean>> {
        try {
            if (await ProgramDao.completeWorkout(workoutDto, userID)) {
                return {
                    data: true,
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Workout completed'
                };
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'User can\'t update the requested workout'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async completeProgram(programID: number, userID: number): Promise<ServiceResponse<boolean>> {
        try {
            if (await ProgramDao.completeProgram(programID, userID)) {
                return {
                    data: true,
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Program completed'
                };
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'User can\'t update the requested program'
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
