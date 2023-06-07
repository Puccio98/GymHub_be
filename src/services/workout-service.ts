import {UpdateWorkoutDto} from "../dto/programDto/update-workout.dto";
import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {CompleteWorkoutDto} from "../dto/programDto/complete-workout.dto";
import {WorkoutDao} from "../dao/workout-dao";
import {WorkoutAddDTO} from "../dto/programDto/add-workout.dto";
import {WorkoutDto} from "../dto/programDto/workout-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {Exercise_WorkoutDao} from "../dao/exercise_workout-dao";
import {DeleteWorkoutResponse} from "../dto/programDto/delete-workout-response";
import {ProgramItem} from "../models/program";
import {ProgramType} from "../enums/program-type.enum";
import {ProgramStateEnum} from "../enums/program-state-enum";

const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'
let message: string; // messaggio specifico

export class WorkoutService {
    static async update(workoutDto: UpdateWorkoutDto, userID: number): Promise<ServiceResponse<CompleteWorkoutDto>> {
        try {
            if (!await WorkoutDao.belongsToUser(userID, workoutDto.programID, workoutDto.workoutID)) {
                message = 'Workout does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (!await WorkoutDao.isComplete(workoutDto.workoutID)) {
                message = 'Workout is not complete';
                return response(ServiceStatusEnum.ERROR, message);
            }
            const updatedWorkout = await WorkoutDao.update(workoutDto);
            if (updatedWorkout) {
                message = 'Workout completed';
                return response(ServiceStatusEnum.SUCCESS, message, updatedWorkout);
            } else {
                message = 'User can\'t update the requested workout';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async create(workoutDto: WorkoutAddDTO, userID: number): Promise<ServiceResponse<WorkoutDto>> {
        try {
            const maxNumberOfWorkouts = 7;
            const programs: ProgramItem[] = await ProgramDao.get(workoutDto.programID);
            if (!programs.length) {
                return response(ServiceStatusEnum.ERROR, 'ProgramID inesistente');
            }
            const programDB: ProgramItem = programs[0];

            if (programDB.ProgramTypeID === ProgramType.BASIC && await WorkoutDao.programWorkoutNumber(workoutDto.programID) > maxNumberOfWorkouts) {
                message = 'Program has reached maximum number of workouts';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (programDB.ProgramStateID === ProgramStateEnum.INACTIVE) {
                message = 'Program is not active';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (programDB.UserID !== userID) {
                message = 'Program does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            const workoutItem = ProgramLib.WorkoutCreateDtoToWorkoutItem(workoutDto, workoutDto.groupID, workoutDto.programID);
            const workoutID = await WorkoutDao.create(workoutItem);
            if (workoutID) {
                const exerciseItemList = ProgramLib.ExerciseCreateDtoListToExerciseWorkoutItemList(workoutDto.exerciseList, workoutID);
                // Insert di tutti gli esercizi di un workout contemporaneamente
                await Exercise_WorkoutDao.create(exerciseItemList);
                const addedWorkout = await WorkoutDao.getPlain(workoutID);
                const wList: WorkoutDto[] = ProgramLib.PlainWorkoutItemToWorkoutDtoList(addedWorkout);
                if (wList.length === 1) {
                    message = 'Workout added';
                    const data = wList[0];
                    return response(ServiceStatusEnum.SUCCESS, message, data);
                } else {
                    message = 'Errore durante l\'inserimento degli esercizi nell\'allenamento.';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            } else {
                message = 'Errore durante l\'inserimento dell\'allenamento.';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async delete(workoutDto: UpdateWorkoutDto, userID: number): Promise<ServiceResponse<DeleteWorkoutResponse>> {
        try {
            if (!await WorkoutDao.belongsToUser(userID, workoutDto.programID, workoutDto.workoutID)) {
                message = 'Workout does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (await WorkoutDao.isComplete(workoutDto.workoutID)) {
                message = 'Workout is complete';
                return response(ServiceStatusEnum.ERROR, message);
            }
            // controllo che l'allenamento non sia l'ultimo della scheda, in caso delete della scheda direttamente
            if (await WorkoutDao.isLast(workoutDto.programID)) {
                if (await ProgramDao.delete(workoutDto.programID)) {
                    message = 'Entire program deleted';
                    const data = {workoutID: workoutDto.workoutID, refreshProgram: false};
                    return response(ServiceStatusEnum.SUCCESS, message, data);
                } else {
                    message = 'User can\'t delete the requested program';
                    return response(ServiceStatusEnum.ERROR, message);
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
                    const deleteWorkoutResponse: DeleteWorkoutResponse = {
                        workoutID: deletedWorkout,
                        refreshProgram: refreshProgram
                    }
                    message = 'Workout deleted';
                    return response(ServiceStatusEnum.SUCCESS, message, deleteWorkoutResponse);
                } else {
                    message = 'User can\'t delete the requested workout';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }
}
