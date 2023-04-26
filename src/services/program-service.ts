import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {ProgramCreateDTO} from "../dto/programDto/program-create-dto";
import {WorkoutDao} from "../dao/workout-dao";
import {Exercise_WorkoutDao} from "../dao/exercise_workout-dao";

export class ProgramService {

    static async getListByUserID(userID: number): Promise<ServiceResponse<ProgramDto[]>> {
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

    static async create(program: ProgramCreateDTO): Promise<ServiceResponse<ProgramDto[]>> {
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
            return await this.getListByUserID(program.userID);
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Something went wrong'
            }
        }
    }

    static async delete(programID: number, userID: number): Promise<ServiceResponse<boolean>> {
        try {
            if (!await ProgramDao.belongsToUser(userID, programID)) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Program does not belong to user'
                };
            }
            const isActive = await ProgramDao.isActive(userID, programID);
            if (await ProgramDao.delete(programID)) {
                if (isActive) {
                    await ProgramDao.setActiveProgram(userID);
                }
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

    static async refresh(userID: number, programID: number): Promise<ServiceResponse<ProgramDto>> {
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
}
