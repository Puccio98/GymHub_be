import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {ProgramCreateDTO} from "../dto/programDto/program-create-dto";
import {WorkoutDao} from "../dao/workout-dao";
import {Exercise_WorkoutDao} from "../dao/exercise_workout-dao";
import {EditProgramDto} from "../dto/programDto/edit-program.dto";

const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'
let message: string; // messaggio specifico

export class ProgramService {

    static async getListByUserID(userID: number): Promise<ServiceResponse<ProgramDto[]>> {
        try {
            const programList = await ProgramDao.getPlainList(userID);
            if (programList.length) {
                message = 'Program found and returned';
                const data = ProgramLib.PlainProgramItemListToProgramDtoList(programList);
                return response(ServiceStatusEnum.SUCCESS, message, data);
            } else {
                message = 'You have 0 programs apparently';
                return response(ServiceStatusEnum.SUCCESS, message, []);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
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
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async delete(programID: number, userID: number): Promise<ServiceResponse<boolean>> {
        try {
            if (!await ProgramDao.belongsToUser(userID, programID)) {
                message = 'Program does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            const isActive = await ProgramDao.isActive(userID, programID);
            if (await ProgramDao.delete(programID)) {
                if (isActive) {
                    await ProgramDao.setActiveProgram(userID);
                }
                message = 'Program deleted';
                return response(ServiceStatusEnum.SUCCESS, message, true);
            } else {
                message = 'User can\'t delete the requested program';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async refresh(userID: number, programID: number): Promise<ServiceResponse<ProgramDto>> {
        try {
            if (!await ProgramDao.belongsToUser(userID, programID)) {
                message = 'Program does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (!await ProgramDao.isComplete(programID)) {
                message = 'Program is not complete';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (!await ProgramDao.refresh(programID)) {
                return response(ServiceStatusEnum.ERROR, defaultMessage);
            }
            const ppList = await ProgramDao.getPlainByProgramID(userID, programID);
            if (!ppList.length) {
                message = 'Impossibile recuperare scheda';
                return response(ServiceStatusEnum.ERROR, message);
            }
            const refreshedProgram = ProgramLib.PlainProgramItemListToProgramDtoList(ppList);
            if (refreshedProgram.length === 1) {
                message = 'Program completed';
                const data = refreshedProgram[0];
                return response(ServiceStatusEnum.SUCCESS, message, data);
            } else {
                message = 'Multiple programs found';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async edit(userID: number, editProgramDto: EditProgramDto):Promise<ServiceResponse<EditProgramDto>> {
        try {
            //controllo che la scheda appartenga all'utente
            if(!await ProgramDao.belongsToUser(userID, editProgramDto.programID)) {
                message = 'Program does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            //controllo se la scheda è attiva
            if(await ProgramDao.isActive(userID, editProgramDto.programID)) {
                //se la scheda è attiva e io voglio renderla inattiva --> errore
                if (!editProgramDto.programState) {
                    message = 'You need at least one active program';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            } else {
                //se la scheda è inattiva e io voglio renderla attiva, prima rendo inattive quelle altre (così da averne
                //solo una attiva per volta
                if (editProgramDto.programState) {
                    await ProgramDao.setProgramsInactive(userID);
                }
            }
            //edit
            if (await ProgramDao.edit(ProgramLib.editProgramDtoToEditProgramItem(editProgramDto))) {
                message = 'Progam edited';
                return response(ServiceStatusEnum.SUCCESS, message, editProgramDto);
            } else {
                message = 'Edit failed';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }
}
