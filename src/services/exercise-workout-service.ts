import {UpdateExerciseDto} from "../dto/programDto/update-exercise.dto";
import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/service-return-type.interface";
import {ExerciseWorkoutDto} from "../dto/programDto/exercises_workout.dto";
import {Exercise_workoutDao} from "../dao/exercise_workout.dao";
import {ProgramLib} from "../lib_mapping/program.lib";
import {AddExerciseDto} from "../dto/programDto/add-exercise.dto";
import {WorkoutDao} from "../dao/workout.dao";
import {DeleteExerciseResponseDto} from "../dto/programDto/delete-exercise-response.dto";
import {ProgramDao} from "../dao/program.dao";
import {DeleteExerciseWorkout} from "../interfaces/delete-exercise-workout.interface";
import {StatusEnum} from "../enums/status.enum";

const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'
let message: string; // messaggio specifico

export class ExerciseWorkoutService {
    static async update(exercise: UpdateExerciseDto, userID: number): Promise<ServiceResponse<ExerciseWorkoutDto>> {
        try {
            //Verifico che l'esercizio che deve essere completato appartenga all'utente
            if (!await Exercise_workoutDao.belongsToUser(userID, exercise.programID, exercise.workoutID, exercise.exercise_WorkoutID)) {
                message = 'Exercise does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            const updatedExercise = await Exercise_workoutDao.update(exercise);
            if (updatedExercise) {
                message = 'Exercise completed';
                const data = ProgramLib.ExerciseWorkoutItemToExerciseWorkoutDto(updatedExercise.e_w, updatedExercise.e);
                return response(ServiceStatusEnum.SUCCESS, message, data);
            } else {
                message = 'Internal server error';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async create(exerciseDto: AddExerciseDto, userID: number): Promise<ServiceResponse<ExerciseWorkoutDto>> {
        try {
            if (!await WorkoutDao.belongsToUser(userID, exerciseDto.programID, exerciseDto.workoutID)) {
                message = 'Workout does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            const exerciseItem = ProgramLib.ExerciseCreateDtoToExerciseWorkoutItem(exerciseDto.exercise, exerciseDto.workoutID);
            const exercise_workoutID = await Exercise_workoutDao.create([exerciseItem]);
            if (exercise_workoutID) {
                const exercise = await Exercise_workoutDao.get(exercise_workoutID);
                if (exercise) {
                    message = 'Exercise added';
                    const data = ProgramLib.ExerciseWorkoutItemToExerciseWorkoutDto(exercise.e_w, exercise.e);
                    return response(ServiceStatusEnum.SUCCESS, message, data);
                } else {
                    message = 'Errore durante la creazione dell\'esercizio.';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            } else {
                message = `Impossibile recuperare l\'esercizio.`;
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async delete(deleteExercise: DeleteExerciseWorkout, userID: number): Promise<ServiceResponse<DeleteExerciseResponseDto>> {
        try {
            if (!await Exercise_workoutDao.belongsToUser(userID, deleteExercise.ProgramID, deleteExercise.WorkoutID, deleteExercise.ExerciseID)) {
                message = 'Exercise does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (!await Exercise_workoutDao.isUncompleted(deleteExercise.ExerciseID)) {
                message = 'Exercise is either completed or skipped';
                return response(ServiceStatusEnum.ERROR, message);
            }

            // controllo che l'esercizio non sia l'ultimo dell'allenamento, in caso delete dell'allenamento direttamente
            if (await Exercise_workoutDao.isLast(deleteExercise.WorkoutID)) {
                //controllo che l'allenamento non sia l'ultimo rimasto della scheda, e in caso delete scheda
                if (await WorkoutDao.isLast(deleteExercise.ProgramID)) {
                    if (await ProgramDao.delete(deleteExercise.ProgramID)) {
                        //ELIMINO SCHEDA
                        message = 'Entire program deleted';
                        const data = {
                            exerciseID: deleteExercise.WorkoutID,
                            completedWorkout: false,
                            refreshProgram: false
                        };
                        return response(ServiceStatusEnum.SUCCESS, message, data);
                    } else {
                        message = 'User can\'t delete the requested program';
                        return response(ServiceStatusEnum.ERROR, message);
                    }
                } else {
                    //ELIMINO ALLENAMENTO
                    const deletedWorkout = await WorkoutDao.delete(deleteExercise.WorkoutID);
                    if (deletedWorkout) {
                        //CHECK CHE LA SCHEDA SIA COMPLETATA
                        if (await ProgramDao.isComplete(deleteExercise.ProgramID)) {
                            await ProgramDao.reset(deleteExercise.ProgramID);
                        }
                        message = 'Workout deleted';
                        const data = {exerciseID: deletedWorkout, completedWorkout: false, refreshProgram: true};
                        return response(ServiceStatusEnum.SUCCESS, message, data);
                    } else {
                        message = 'User can\'t delete the requested workout';
                        return response(ServiceStatusEnum.ERROR, message);
                    }
                }
            } else {
                //ELIMINO L'ESERCIZIO
                const deletedExercise = await Exercise_workoutDao.delete(deleteExercise.ExerciseID);
                if (deletedExercise) {
                    let completedWorkout = false;
                    let refreshProgram = false;
                    if (await WorkoutDao.isComplete(deleteExercise.WorkoutID)) {
                        //SE ORA L'ALLENAMENTO E' COMPLETO, LO COMPLETO
                        await WorkoutDao.update({
                            ProgramID: deleteExercise.ProgramID,
                            WorkoutID: deleteExercise.WorkoutID,
                            StatusID: StatusEnum.COMPLETE
                        });
                        completedWorkout = true;
                        if (await ProgramDao.isComplete(deleteExercise.ProgramID)) {
                            //SE ORA LA SCHEDA E' COMPLETA, FACCIO REFRESH DELLA SCHEDA
                            await ProgramDao.reset(deleteExercise.ProgramID);
                            completedWorkout = false;
                            refreshProgram = true;
                        }
                    }
                    message = 'Workout deleted';
                    const data = {
                        exerciseID: deletedExercise,
                        completedWorkout: completedWorkout,
                        refreshProgram: refreshProgram
                    };
                    return response(ServiceStatusEnum.SUCCESS, message, data);
                } else {
                    message = 'User can\'t delete the requested exercise';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }
}
