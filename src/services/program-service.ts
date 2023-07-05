import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";
import {ProgramCreateDTO} from "../dto/programDto/program-create-dto";
import {WorkoutDao} from "../dao/workout-dao";
import {Exercise_WorkoutDao} from "../dao/exercise_workout-dao";
import {UpdateProgramDto} from "../dto/programDto/update-program.dto";
import {ProgramStateEnum} from "../enums/program-state-enum";
import {ShareProgramDto} from "../dto/programDto/share-program.dto";
import {ShareProgramDao} from "../dao/share-program-dao";
import {ShareProgram} from "../models/shareProgram";
import {PayloadJWT} from "../interfaces/payloadJWT-interface";
import {UserType} from "../enums/user-type.enum";

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

    static async getSharedListByUserID(fromUserID: number, toUserID: number): Promise<ServiceResponse<ProgramDto[]>> {
        try {
            const programList = await ProgramDao.getSharedPlainList(fromUserID, toUserID);

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
                await ProgramDao.reset(activeProgramID);
            }

            // Mette inattivi tutti i programmi
            await ProgramDao.setProgramsInactive(program.userID);

            // Creo Programma
            await this._create(program);

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

    static async reset(userID: number, programID: number): Promise<ServiceResponse<ProgramDto>> {
        try {
            if (!await ProgramDao.belongsToUser(userID, programID)) {
                message = 'Program does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (!await ProgramDao.isComplete(programID)) {
                message = 'Program is not complete';
                return response(ServiceStatusEnum.ERROR, message);
            }
            if (!await ProgramDao.reset(programID)) {
                return response(ServiceStatusEnum.ERROR, 'Non è stato possibile resettare la scheda');
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

    static async update(userID: number, editProgramDto: UpdateProgramDto): Promise<ServiceResponse<UpdateProgramDto>> {
        try {
            //controllo che la scheda appartenga all'utente
            if (!await ProgramDao.belongsToUser(userID, editProgramDto.programID)) {
                message = 'Program does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }
            //controllo se la scheda è attiva
            if (await ProgramDao.isActive(userID, editProgramDto.programID)) {
                //se la scheda è attiva e io voglio renderla inattiva --> errore
                if (editProgramDto.programState === ProgramStateEnum.INACTIVE) {
                    message = 'You need at least one active program';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            } else {
                //se la scheda è inattiva e io voglio renderla attiva, prima rendo inattive quelle altre (così da averne
                //solo una attiva per volta
                if (editProgramDto.programState === ProgramStateEnum.ACTIVE) {
                    await ProgramDao.setProgramsInactive(userID);
                }
            }
            //edit
            if (await ProgramDao.update(ProgramLib.editProgramDtoToEditProgramItem(editProgramDto))) {
                message = 'Program edited';
                return response(ServiceStatusEnum.SUCCESS, message, editProgramDto);
            } else {
                message = 'Edit failed';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async edit(userID: number, programID: number, program: ProgramCreateDTO): Promise<ServiceResponse<boolean>> {
        try {
            //controllo che la scheda appartenga all'utente
            if (!await ProgramDao.belongsToUser(userID, programID)) {
                message = 'Program does not belong to user';
                return response(ServiceStatusEnum.ERROR, message);
            }

            // Controllare che il programma sia attivo o meno non serve a niente, tanto quando andiamo a creare quello nuovo si attiva di default

            // Elimino scheda corrente
            if (!await ProgramDao.delete(programID)) {
                return response(ServiceStatusEnum.ERROR, 'Errore causato durante l\'eliminazione della scheda da modificare.');
            }
            // Creo scheda modificata
            // Mette inattivi tutti i programmi
            await ProgramDao.setProgramsInactive(program.userID);

            // Creo Programma
            if (!await this._create(program)) {
                return response(ServiceStatusEnum.ERROR, 'Errore causato durante la creazione della scheda modificata.');
            }
            return response(ServiceStatusEnum.SUCCESS, 'Scheda modificata correttamente', true);

        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async share(user: PayloadJWT, shareProgramDto: ShareProgramDto): Promise<ServiceResponse<UpdateProgramDto>> {
        try {

            // Solo utenti manager e sadmin possono condividere schede
            if (user.UserTypeID !== UserType.MANAGER && user.UserTypeID !== UserType.SADMIN) {
                message = 'Utente non abilitato alla condivisione di schede';
                return response(ServiceStatusEnum.ERROR, message);
            }


            // Recupero scheda da clonare
            const ppList = await ProgramDao.getPlainByProgramID(user.UserID, shareProgramDto.originalProgramID);
            if (!ppList.length) {
                message = 'Impossibile recuperare scheda';
                return response(ServiceStatusEnum.ERROR, message);
            }

            // Creo Dto per inserire il programma clonato
            const cloneProgram: ProgramCreateDTO = ProgramLib.PlainProgramItemListToProgramCreateDtoList(ppList, shareProgramDto.toUserID)[0];
            if (!cloneProgram) {
                message = 'Impossibile recuperare scheda';
                return response(ServiceStatusEnum.ERROR, message);
            }

            // Mette inattivi tutti i programmi
            await ProgramDao.setProgramsInactive(shareProgramDto.toUserID);

            // Creo Programma (attivo)
            let clonedProgramID: number = await this._create(cloneProgram);
            if (!clonedProgramID) {
                message = 'Errore durante la creazione della scheda clonata';
                return response(ServiceStatusEnum.ERROR, message);
            }

            // Creo record da salvare inserire
            let shareProgramItem: ShareProgram = ProgramLib.shareProgramDtoToShareProgramItem(user.UserID, clonedProgramID, shareProgramDto)
            // Inserisco record del programma condiviso
            let shareProgramID: number = await ShareProgramDao.create(shareProgramItem)
            if (!shareProgramID) {
                message = 'Errore durante la condivisione della scheda clonata';
                return response(ServiceStatusEnum.ERROR, message);
            }

            return response(ServiceStatusEnum.SUCCESS, 'Programma condiviso');
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    private static async _create(program: ProgramCreateDTO): Promise<number> {
        const programItem = ProgramLib.ProgramCreateDtoToProgramItem(program);

        // Insert del nuovo programma
        const programID = await ProgramDao.create(programItem);
        if (programID) {
            for (let [i, workoutGroup] of program.workoutGroupList.entries()) {
                const workoutItemList = ProgramLib.WorkoutCreateDtoListToWorkoutItemList(workoutGroup.workoutList, i, programID);
                for (let w = 0; w < workoutGroup.workoutList.length; w++) {
                    // Insert degli allenamenti uno alla volta
                    const workoutID = await WorkoutDao.create(workoutItemList[w]);
                    if (workoutID) {
                        const exerciseItemList = ProgramLib.ExerciseCreateDtoListToExerciseWorkoutItemList(workoutGroup.workoutList[w].exerciseList, workoutID);
                        // Insert di tutti gli esercizi di un workout contemporaneamente
                        await Exercise_WorkoutDao.create(exerciseItemList);
                    }
                }
            }
        }
        return programID;
    }

}
