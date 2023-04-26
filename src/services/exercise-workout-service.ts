import {UpdateExerciseDto} from "../dto/programDto/update-exercise.dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ExerciseWorkoutDto} from "../dto/programDto/exercises_workout-dto";
import {Exercise_WorkoutDao} from "../dao/exercise_workout-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {AddExerciseDto} from "../dto/programDto/add-exercise.dto";
import {WorkoutDao} from "../dao/workout-dao";
import {DeleteExerciseDto} from "../dto/programDto/delete-exercise.dto";
import {DeleteExerciseResponse} from "../dto/delete-exercise-response";
import {ProgramDao} from "../dao/program-dao";

export class ExerciseWorkoutService {
    static async update(exercise: UpdateExerciseDto, userID: number): Promise<ServiceResponse<ExerciseWorkoutDto>> {
        try {
            //Verifico che l'esercizio che deve essere completato appartenga all'utente
            if (!await Exercise_WorkoutDao.belongsToUser(userID, exercise.programID, exercise.workoutID, exercise.exercise_WorkoutID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Exercise does not belong to user'
                };
            }
            const updatedExercise = await Exercise_WorkoutDao.update(exercise);
            if (updatedExercise) {
                return {
                    data: ProgramLib.ExerciseWorkoutItemToExerciseWorkoutDto(updatedExercise.e_w, updatedExercise.e),
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Exercise completed'
                };
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Internal server error'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async create(exerciseDto: AddExerciseDto, userID: number): Promise<ServiceResponse<ExerciseWorkoutDto>> {
        try {
            if (!await WorkoutDao.belongsToUser(userID, exerciseDto.programID, exerciseDto.workoutID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Workout does not belong to user'
                };
            }
            const exerciseItem = ProgramLib.ExerciseCreateDtoToExerciseWorkoutItem(exerciseDto.exercise, exerciseDto.workoutID);
            const exercise_workoutID = await Exercise_WorkoutDao.create([exerciseItem]);
            if (exercise_workoutID) {
                const exercise = await Exercise_WorkoutDao.get(exercise_workoutID);
                if (exercise) {
                    return {
                        data: ProgramLib.ExerciseWorkoutItemToExerciseWorkoutDto(exercise.e_w, exercise.e),
                        status: ServiceStatusEnum.SUCCESS,
                        message: 'Exercise added'
                    };
                } else {
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'Errore durante la creazione dell\'esercizio.'
                    };
                }
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: `Impossibile recuperare l\'esercizio.`
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async delete(deleteExerciseDto: DeleteExerciseDto, userID: number): Promise<ServiceResponse<DeleteExerciseResponse>> {
        try {
            if (!await Exercise_WorkoutDao.belongsToUser(userID, deleteExerciseDto.programID, deleteExerciseDto.workoutID, deleteExerciseDto.exerciseID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Exercise does not belong to user'
                };
            }
            if (!await Exercise_WorkoutDao.isUncompleted(deleteExerciseDto.exerciseID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Exercise is either completed or skipped'
                }
            }

            // controllo che l'esercizio non sia l'ultimo dell'allenamento, in caso delete dell'allenamento direttamente
            if (await Exercise_WorkoutDao.isLast(deleteExerciseDto.workoutID)) {
                //controllo che l'allenamento non sia l'ultimo rimasto della scheda, e in caso delete scheda
                if (await WorkoutDao.isLast(deleteExerciseDto.programID)) {
                    if (await ProgramDao.delete(deleteExerciseDto.programID)) {
                        //ELIMINO SCHEDA
                        return {
                            data: {
                                exerciseID: deleteExerciseDto.workoutID,
                                completedWorkout: false,
                                refreshProgram: false
                            },
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
                    //ELIMINO ALLENAMENTO
                    const deletedWorkout = await WorkoutDao.delete(deleteExerciseDto.workoutID);
                    if (deletedWorkout) {
                        //CHECK CHE LA SCHEDA SIA COMPLETATA
                        if (await ProgramDao.isComplete(deleteExerciseDto.programID)) {
                            await ProgramDao.refresh(deleteExerciseDto.programID);
                        }
                        return {
                            data: {exerciseID: deletedWorkout, completedWorkout: false, refreshProgram: true},
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
            } else {
                //ELIMINO L'ESERCIZIO
                const deletedExercise = await Exercise_WorkoutDao.delete(deleteExerciseDto.exerciseID);
                if (deletedExercise) {
                    let completedWorkout = false;
                    let refreshProgram = false;
                    if (await WorkoutDao.isComplete(deleteExerciseDto.workoutID)) {
                        //SE ORA L'ALLENAMENTO E' COMPLETO, LO COMPLETO
                        await WorkoutDao.update({
                            programID: deleteExerciseDto.programID,
                            workoutID: deleteExerciseDto.workoutID
                        });
                        completedWorkout = true;
                        if (await ProgramDao.isComplete(deleteExerciseDto.programID)) {
                            //SE ORA LA SCHEDA E' COMPLETA, FACCIO REFRESH DELLA SCHEDA
                            await ProgramDao.refresh(deleteExerciseDto.programID);
                            completedWorkout = false;
                            refreshProgram = true;
                        }
                    }
                    return {
                        data: {
                            exerciseID: deletedExercise,
                            completedWorkout: completedWorkout,
                            refreshProgram: refreshProgram
                        },
                        status: ServiceStatusEnum.SUCCESS,
                        message: 'Workout deleted'
                    };
                } else {
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'User can\'t delete the requested exercise'
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
