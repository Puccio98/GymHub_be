import {UpdateWorkoutDto} from "../dto/programDto/update-workout.dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {CompleteWorkoutDto} from "../dto/programDto/complete-workout.dto";
import {WorkoutDao} from "../dao/workout-dao";
import {WorkoutAddDTO} from "../dto/programDto/add-workout.dto";
import {WorkoutDto} from "../dto/programDto/workout-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {Exercise_WorkoutDao} from "../dao/exercise_workout-dao";
import {DeleteWorkoutResponse} from "../dto/delete-workout-response";

export class WorkoutService {
    static async update(workoutDto: UpdateWorkoutDto, userID: number): Promise<ServiceResponse<CompleteWorkoutDto>> {
        try {
            if (!await WorkoutDao.belongsToUser(userID, workoutDto.programID, workoutDto.workoutID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Workout does not belong to user'
                };
            }
            if (!await WorkoutDao.isComplete(workoutDto.workoutID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Workout is not complete'
                }
            }
            const updatedWorkout = await WorkoutDao.update(workoutDto);
            if (updatedWorkout) {
                return {
                    data: updatedWorkout,
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

    static async create(workoutDto: WorkoutAddDTO, userID: number): Promise<ServiceResponse<WorkoutDto>> {
        try {
            const maxNumberOfWorkouts = 7;
            if (await WorkoutDao.programWorkoutNumber(workoutDto.programID) >= maxNumberOfWorkouts) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Program has reached maximum number of workouts'
                }
            }
            if (!await ProgramDao.isActive(userID, workoutDto.programID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Program is not active'
                }
            }
            if (!await ProgramDao.belongsToUser(userID, workoutDto.programID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Program does not belong to user'
                };
            }
            const workoutItem = ProgramLib.WorkoutCreateDtoToWorkoutItem(workoutDto, workoutDto.programID);
            const workoutID = await WorkoutDao.create(workoutItem);
            if (workoutID) {
                const exerciseItemList = ProgramLib.ExerciseCreateDtoListToExerciseWorkoutItemList(workoutDto.exerciseList, workoutID);
                // Insert di tutti gli esercizi di un workout contemporaneamente
                await Exercise_WorkoutDao.create(exerciseItemList);
                const addedWorkout = await WorkoutDao.getPlain(workoutID);
                const wList: WorkoutDto[] = ProgramLib.PlainWorkoutItemToWorkoutDtoList(addedWorkout);
                if (wList.length === 1) {
                    return {
                        data: wList[0],
                        status: ServiceStatusEnum.SUCCESS,
                        message: 'Workout added'
                    };
                } else {
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'Errore durante l\'inserimento degli esercizi nell\'allenamento.'
                    };
                }
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Errore durante l\'inserimento dell\'allenamento.'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async delete(workoutDto: UpdateWorkoutDto, userID: number): Promise<ServiceResponse<DeleteWorkoutResponse>> {
        try {
            if (!await WorkoutDao.belongsToUser(userID, workoutDto.programID, workoutDto.workoutID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Workout does not belong to user'
                };
            }
            if (await WorkoutDao.isComplete(workoutDto.workoutID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Workout is complete'
                }
            }
            // controllo che l'allenamento non sia l'ultimo della scheda, in caso delete della scheda direttamente
            if (await WorkoutDao.isLast(workoutDto.programID)) {
                if (await ProgramDao.delete(workoutDto.programID)) {
                    return {
                        data: {workoutID: workoutDto.workoutID, refreshProgram: false},
                        status: ServiceStatusEnum.SUCCESS,
                        message: 'Entire program deleted'
                    };
                } else {
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'User can\'t delete the requested program'
                    };
                }
            } else {
                const deletedWorkout = await WorkoutDao.delete(workoutDto.workoutID);
                if (deletedWorkout) {
                    //CHECK CHE LA SCHEDA SIA COMPLETATA
                    let refreshProgram = false;
                    if (await ProgramDao.isComplete(workoutDto.programID)) {
                        await ProgramDao.refresh(workoutDto.programID);
                        refreshProgram = true;
                    }
                    const res: DeleteWorkoutResponse = {workoutID: deletedWorkout, refreshProgram: refreshProgram}
                    return {
                        data: res,
                        status: ServiceStatusEnum.SUCCESS,
                        message: 'Workout deleted'
                    };
                } else {
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'User can\'t delete the requested workout'
                    };
                }
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }
}
