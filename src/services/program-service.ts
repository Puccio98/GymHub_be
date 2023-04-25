import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {ExerciseDto} from "../dto/programDto/exercise-dto";
import {ExerciseItem} from "../models/exercise";
import {ProgramCreateDTO} from "../dto/programDto/program-create-dto";
import {UpdateExerciseDto} from "../dto/programDto/update-exercise.dto";
import {UpdateWorkoutDto} from "../dto/programDto/update-workout.dto";
import {ExerciseWorkoutDto} from "../dto/programDto/exercises_workout-dto";
import {CompleteWorkoutDto} from "../dto/programDto/complete-workout.dto";
import {WorkoutAddDTO} from "../dto/programDto/add-workout.dto";
import {WorkoutDto} from "../dto/programDto/workout-dto";
import {AddExerciseDto} from "../dto/programDto/add-exercise.dto";
import {DeleteExerciseDto} from "../dto/programDto/delete-exercise.dto";
import {DeleteWorkoutResponse} from "../types/delete-workout-response";
import {DeleteExerciseResponse} from "../types/delete-exercise-response";
import {WorkoutDao} from "../dao/workout-dao";
import {ExerciseDao} from "../dao/exercise-dao";
import {Exercise_WorkoutDao} from "../dao/exercise_workout-dao";

export class ProgramService {

    static async getProgramListByUserID(userID: number): Promise<ServiceResponse<ProgramDto[]>> {
        try {
            const programList = await ProgramDao.getPlainList(userID);
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

    static async createProgram(program: ProgramCreateDTO): Promise<ServiceResponse<ProgramDto[]>> {
        try {
            //Per prima cosa, metto StatusID = INCOMPLETE a tutti gli allenamenti ed esercizi della scheda attiva.
            const activeProgramID = await ProgramDao.getActiveProgram(program.userID);
            if (activeProgramID !== -1) {
                await ProgramDao.refresh(activeProgramID);
            }

            // Mette inattivi tutti i programmi
            await ProgramDao.setProgramsInactive(program.userID);
            const programItem = ProgramLib.ProgramCreateDtoToProgramItem(program);
            // Insert del nuovo programma
            const programID = await ProgramDao.create(programItem);
            if (programID) {
                const workoutItemList = ProgramLib.WorkoutCreateDtoListToWorkoutItemList(program.workoutList, programID);
                for (let w = 0; w < program.workoutList.length; w++) {
                    // Insert degli allenamenti uno alla volta
                    const workoutID = await WorkoutDao.create(workoutItemList[w]);
                    if (workoutID) {
                        const exerciseItemList = ProgramLib.ExerciseCreateDtoListToExerciseWorkoutItemList(program.workoutList[w].exerciseList, workoutID);
                        // Insert di tutti gli esercizi di un workout contemporaneamente
                        await Exercise_WorkoutDao.create(exerciseItemList);
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

    static async updateExercise(exercise: UpdateExerciseDto, userID: number): Promise<ServiceResponse<ExerciseWorkoutDto>> {
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

    static async updateWorkout(workoutDto: UpdateWorkoutDto, userID: number): Promise<ServiceResponse<CompleteWorkoutDto>> {
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

    static async addWorkout(workoutDto: WorkoutAddDTO, userID: number): Promise<ServiceResponse<WorkoutDto>> {
        try {
            const maxNumberOfWorkouts = 7;
            if (await WorkoutDao.programWorkoutNumber(workoutDto.programID) >= maxNumberOfWorkouts) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Program has reached maximum number of workouts'
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

    static async addExercise(exerciseDto: AddExerciseDto, userID: number): Promise<ServiceResponse<ExerciseWorkoutDto>> {
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

    static async refreshProgram(userID: number, programID: number): Promise<ServiceResponse<ProgramDto>> {
        try {
            if (!await ProgramDao.belongsToUser(userID, programID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Program does not belong to user'
                };
            }
            if (!await ProgramDao.isComplete(programID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Program is not complete'
                }
            }
            if (!await ProgramDao.refresh(programID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Db esplode'
                }
            }
            const ppList = await ProgramDao.getPlainByProgramID(userID, programID);
            if (!ppList.length) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Impossibile recuperare scheda'
                }
            }
            const refreshedProgram = ProgramLib.PlainProgramItemListToProgramDtoList(ppList);
            if (refreshedProgram.length === 1) {
                return {
                    data: refreshedProgram[0],
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Program completed'
                };
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Multiple programs found'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async deleteWorkout(workoutDto: UpdateWorkoutDto, userID: number): Promise<ServiceResponse<DeleteWorkoutResponse>> {
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
                if (await ProgramDao.delete(workoutDto.programID, userID)) {
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

    static async deleteExercise(deleteExerciseDto: DeleteExerciseDto, userID: number): Promise<ServiceResponse<DeleteExerciseResponse>> {
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
                    if (await ProgramDao.delete(deleteExerciseDto.programID, userID)) {
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
