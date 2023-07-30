import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/service-return-type.interface";
import {CompleteWorkoutDto} from "../dto/programDto/complete-workout.dto";
import {WorkoutDao} from "../dao/workout.dao";
import {WorkoutAddDTO} from "../dto/programDto/add-workout.dto";
import {WorkoutDto} from "../dto/programDto/workout-dto";
import {ProgramDao} from "../dao/program.dao";
import {ProgramLib} from "../lib_mapping/program.lib";
import {Exercise_workoutDao} from "../dao/exercise_workout.dao";
import {DeleteWorkoutResponseDto} from "../dto/programDto/delete-workout-response.dto";
import {ProgramItem} from "../models/program";
import {ProgramTypeEnum} from "../enums/program-type.enum";
import {ProgramStateEnum} from "../enums/program-state.enum";
import {UpdateWorkout} from "../interfaces/update-workout.interface";
import {DeleteWorkout} from "../interfaces/delete-workout.interface";

const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'
let message: string; // messaggio specifico

export class WorkoutService {
    static async update(workout: UpdateWorkout, userID: number): Promise<ServiceResponse<CompleteWorkoutDto>> {
        try {
            if (!await WorkoutDao.belongsToUser(userID, workout.ProgramID, workout.WorkoutID)) {
                message = 'Workout does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (!await WorkoutDao.isComplete(workout.WorkoutID)) {
                message = 'Workout is not complete';
                return response(ServiceStatusEnum.ERROR, message);
            }
            const updatedWorkout = await WorkoutDao.update(workout);
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

            if (programDB.ProgramTypeID === ProgramTypeEnum.BASIC && await WorkoutDao.programWorkoutNumber(workoutDto.programID) > maxNumberOfWorkouts) {
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
                await Exercise_workoutDao.create(exerciseItemList);
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

    static async delete(workout: DeleteWorkout, userID: number): Promise<ServiceResponse<DeleteWorkoutResponseDto>> {
        try {
            if (!await WorkoutDao.belongsToUser(userID, workout.ProgramID, workout.WorkoutID)) {
                message = 'Workout does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (await WorkoutDao.isComplete(workout.WorkoutID)) {
                message = 'Workout is complete';
                return response(ServiceStatusEnum.ERROR, message);
            }
            // controllo che l'allenamento non sia l'ultimo della scheda, in caso delete della scheda direttamente
            if (await WorkoutDao.isLast(workout.ProgramID)) {
                if (await ProgramDao.delete(workout.ProgramID)) {
                    message = 'Entire program deleted';
                    const data = {workoutID: workout.WorkoutID, refreshProgram: false};
                    return response(ServiceStatusEnum.SUCCESS, message, data);
                } else {
                    message = 'User can\'t delete the requested program';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            } else {
                const deletedWorkout = await WorkoutDao.delete(workout.WorkoutID);
                if (deletedWorkout) {
                    //CHECK CHE LA SCHEDA SIA COMPLETATA
                    let refreshProgram = false;
                    if (await ProgramDao.isComplete(workout.ProgramID)) {
                        await ProgramDao.reset(workout.ProgramID);
                        refreshProgram = true;
                    }
                    const deleteWorkoutResponse: DeleteWorkoutResponseDto = {
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
