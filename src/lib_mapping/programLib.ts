import {PlainProgramItem} from "../dto/programDto/plainProgram";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramItem} from "../models/program";
import {WorkoutDto} from "../dto/programDto/workout-dto";
import {WorkoutItem} from "../models/workout";
import {ExerciseWorkoutItem} from "../models/exercise_workout";
import {ExerciseItem} from "../models/exercise";
import {ExerciseWorkoutDto} from "../dto/programDto/exercises_workout-dto";
import {ExerciseDto} from "../dto/programDto/exercise-dto";
import {
    ExerciseCreateDTO,
    ProgramCreateDTO,
    WorkoutCreateDTO,
    WorkoutGroupCreateDto
} from "../dto/programDto/program-create-dto";
import {ProgramStateEnum} from "../enums/program-state-enum";
import {PlainWorkoutItem} from "../dto/programDto/plainWorkout";
import {EditProgramDto} from "../dto/programDto/edit-program.dto";
import {EditProgramItem} from "../models/edit-program-item";
import {ShareProgramDto} from "../dto/programDto/share-program.dto";
import {ShareProgram} from "../models/shareProgram";
import {DateDB} from "../interfaces/dateDB";
import {WorkoutGroupDto} from "../dto/programDto/workoutGroupDto";
import {Status} from "../enums/status.enum";

export class ProgramLib {
    static ProgramItemToProgramDto(programItem: ProgramItem): ProgramDto {
        return {
            programID: programItem.ProgramID,
            programTypeID: programItem.ProgramTypeID,
            userID: programItem.UserID,
            title: programItem.Title,
            description: programItem.Description,
            programStateID: programItem.ProgramStateID,
            statusID: programItem.StatusID,
            workoutGroupList: [],
        } as ProgramDto
    }

    static ProgramItemToProgramCreateDto(programItem: ProgramItem, userID: number = 0, dateDB: DateDB | null = null): ProgramCreateDTO {
        let _dateDB: DateDB = dateDB ?? {createdAt: new Date(), updatedAt: new Date()};

        return {
            programTypeID: programItem.ProgramTypeID,
            userID: userID ? userID : programItem.UserID,
            title: programItem.Title,
            workoutGroupList: [],
            createdAt: _dateDB.createdAt,
            updatedAt: _dateDB.updatedAt
        }
    }

    // region From ProgramDto to ProgramCreateDto
    /**
     * A partire da un ProgramDto restituisce un ProgramCreateDto necessario a creare una nuova scheda.
     * Questo metodo è utile per clonare una scheda già esistente.
     * @param programDto
     * @param userID
     * @param dateDB
     * @constructor
     */
    static ProgramDtoToProgramCreateDto(programDto: ProgramDto, userID: number = 0, dateDB: DateDB | null = null): ProgramCreateDTO {
        let _dateDB: DateDB = dateDB ?? {createdAt: new Date(), updatedAt: new Date()};

        return {
            userID: userID ? userID : programDto.userID,
            title: programDto.title,
            programTypeID: programDto.programTypeID,
            workoutGroupList: this.WorkoutGroupListDtoToWorkoutGroupCreateDto(programDto.workoutGroupList, _dateDB),
            createdAt: _dateDB.createdAt,
            updatedAt: _dateDB.updatedAt
        } as ProgramCreateDTO;
    }

    static WorkoutGroupListDtoToWorkoutGroupCreateDto(wgList: WorkoutGroupDto[], dateDB: DateDB): WorkoutGroupCreateDto[] {
        let res: WorkoutGroupCreateDto[] = [];
        for (const w of wgList) {
            res.push(this.WorkoutGroupDtoToWorkoutGroupCreateDto(w, dateDB));
        }
        return res;
    }

    static WorkoutGroupDtoToWorkoutGroupCreateDto(wgDto: WorkoutGroupDto, dateDB: DateDB): WorkoutGroupCreateDto {
        return {
            workoutList: this.WorkoutDtoListToWorkoutCreateDtoList(wgDto.workoutList, dateDB)
        } as WorkoutGroupCreateDto;
    }

    static WorkoutDtoListToWorkoutCreateDtoList(wList: WorkoutDto[], dateDB: DateDB): WorkoutCreateDTO[] {
        let res: WorkoutCreateDTO[] = [];
        for (const w of wList) {
            res.push(this.WorkoutDtoToWorkoutCreateDto(w, dateDB));
        }
        return res;
    }

    static WorkoutDtoToWorkoutCreateDto(w: WorkoutDto, dateDB: DateDB): WorkoutCreateDTO {
        return {
            exerciseList: this.ExerciseWorkoutDtoListToExerciseWorkoutCreateDtoList(w.exerciseList, dateDB),
            createdAt: dateDB.createdAt,
            updatedAt: dateDB.updatedAt,
        } as WorkoutCreateDTO
    }

    static ExerciseWorkoutDtoListToExerciseWorkoutCreateDtoList(eList: ExerciseWorkoutDto[], dateDB: DateDB): ExerciseCreateDTO[] {
        let res: ExerciseCreateDTO[] = [];
        for (const e of eList) {
            res.push(this.ExerciseWorkoutDtoToExerciseCreateDto(e, dateDB))
        }
        return res;
    }

    static ExerciseWorkoutDtoToExerciseCreateDto(e: ExerciseWorkoutDto, dateDB: DateDB): ExerciseCreateDTO {
        return {
            exerciseID: e.exerciseID,
            description: e.description,
            set: e.set,
            rep: e.rep,
            weight: e.weight,
            RPE: e.RPE,
            createdAt: dateDB.createdAt,
            updatedAt: dateDB.updatedAt,
        } as ExerciseCreateDTO
    }

    // endregion

    static ProgramCreateDtoToProgramItem(p: ProgramCreateDTO): ProgramItem {
        return {
            UserID: p.userID,
            ProgramTypeID: p.programTypeID,
            Title: p.title,
            ProgramStateID: ProgramStateEnum.ACTIVE,
            StatusID: Status.INCOMPLETE,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }
    }

    static WorkoutItemToWorkoutDto(workoutItem: WorkoutItem): WorkoutDto {
        return {
            workoutID: workoutItem.WorkoutID,
            programID: workoutItem.ProgramID,
            exerciseList: [],
            statusID: workoutItem.StatusID
        } as WorkoutDto
    }

    static WorkoutItemToWorkoutCreateDto(workoutItem: WorkoutItem, dateDB: DateDB | null = null): WorkoutCreateDTO {
        let _dateDB: DateDB = dateDB ?? {createdAt: new Date(), updatedAt: new Date()};

        return {
            exerciseList: [],
            createdAt: _dateDB.createdAt,
            updatedAt: _dateDB.updatedAt
        }
    }

    static WorkoutCreateDtoListToWorkoutItemList(wList: WorkoutCreateDTO[], groupID: number, programID: number): WorkoutItem[] {
        let workoutItemList: WorkoutItem[] = [];
        for (let w of wList) {
            workoutItemList.push(ProgramLib.WorkoutCreateDtoToWorkoutItem(w, groupID, programID));
        }
        return workoutItemList;

    }

    static ExerciseCreateDtoListToExerciseWorkoutItemList(eList: ExerciseCreateDTO[], workoutID: number): ExerciseWorkoutItem[] {
        let exerciseWorkoutList: ExerciseWorkoutItem[] = [];
        for (let e of eList) {
            exerciseWorkoutList.push(ProgramLib.ExerciseCreateDtoToExerciseWorkoutItem(e, workoutID));
        }
        return exerciseWorkoutList;
    }

    static WorkoutCreateDtoToWorkoutItem(w: WorkoutCreateDTO, groupID: number, programID: number): WorkoutItem {
        return {
            ProgramID: programID,
            GroupID: groupID,
            createdAt: w.createdAt,
            updatedAt: w.updatedAt,
        }
    }

    static ExerciseCreateDtoToExerciseWorkoutItem(e: ExerciseCreateDTO, workoutID: number): ExerciseWorkoutItem {
        return {
            WorkoutID: workoutID,
            ExerciseID: e.exerciseID,
            Description: e.description,
            Set: e.set,
            Rep: e.rep,
            Weight: e.weight,
            RPE: e.RPE,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt
        }
    }

    static ExerciseWorkoutItemToExerciseWorkoutDto(ew: ExerciseWorkoutItem, e: ExerciseItem): ExerciseWorkoutDto {
        return {
            // ExerciseWorkoutItem
            exercise_WorkoutID: ew.Exercise_WorkoutID,
            workoutID: ew.WorkoutID,
            description: ew.Description,
            set: ew.Set,
            rep: ew.Rep,
            weight: ew.Weight,
            RPE: ew.RPE,
            RM: ew.RM,
            percentage: ew.Percentage,
            statusID: ew.StatusID,

            // ExerciseItem
            exerciseID: e.ExerciseID,
            name: e.Name
        } as ExerciseWorkoutDto
    }

    static ExerciseWorkoutItemToExerciseWorkoutCreateDto(ew: ExerciseWorkoutItem, e: ExerciseItem, dateDB: DateDB | null = null): ExerciseCreateDTO {
        let _dateDB: DateDB = dateDB ?? {createdAt: new Date(), updatedAt: new Date()};
        return {
            exerciseID: e.ExerciseID ?? 0,
            description: ew.Description,
            set: ew.Set,
            rep: ew.Rep,
            weight: ew.Weight,
            RPE: ew.RPE,
            createdAt: _dateDB.createdAt,
            updatedAt: _dateDB.updatedAt
        }
    }

    static ExerciseItemToExerciseDto(e: ExerciseItem): ExerciseDto {
        return {
            // ExerciseItem
            exerciseID: e.ExerciseID,
            name: e.Name
        } as ExerciseDto
    }

    static ExerciseItemListToExerciseDtoList(eList: ExerciseItem[]): ExerciseDto[] {
        let dtoList: ExerciseDto[] = [];
        for (let e of eList) {
            dtoList.push(this.ExerciseItemToExerciseDto(e));
        }
        return dtoList;
    }

    static PlainProgramItemListToProgramDtoList(ppList: PlainProgramItem[]): ProgramDto[] {
        let programList: ProgramDto[] = [];
        let old_programID = -1;
        let old_groupID = -1; // può essere zero
        let old_workoutID = -1;
        for (let pp of ppList) {
            if (pp.p.ProgramID != null && old_programID !== pp.p.ProgramID) {
                // Nuovo Programma
                old_programID = pp.p.ProgramID;
                old_groupID = -1; // Per ogni programma resetto la variabile che indica il gruppo
                programList.push(this.ProgramItemToProgramDto(pp.p));
            }
            if (pp.w.GroupID != null && old_groupID !== pp.w.GroupID) {
                // Nuovo Gruppo di allenamenti
                old_groupID = pp.w.GroupID;
                programList.at(-1)?.workoutGroupList.push({workoutList: []});
            }
            if (pp.w.WorkoutID != null && old_workoutID !== pp.w.WorkoutID) {
                // Nuovo allenamento
                old_workoutID = pp.w.WorkoutID;
                programList.at(-1)?.workoutGroupList.at(-1)?.workoutList.push(this.WorkoutItemToWorkoutDto(pp.w));
            }
            // Nuovo esercizio
            programList.at(-1)?.workoutGroupList.at(-1)?.workoutList.at(-1)?.exerciseList.push(this.ExerciseWorkoutItemToExerciseWorkoutDto(pp.e_w, pp.e));
        }
        return programList;
    }


    static PlainProgramItemListToProgramCreateDtoList(ppList: PlainProgramItem[], UserID: number = 0): ProgramCreateDTO[] {
        let programList: ProgramCreateDTO[] = [];
        let old_programID = -1;
        let old_groupID = -1; // può essere zero
        let old_workoutID = -1;
        for (let pp of ppList) {
            if (pp.p.ProgramID != null && old_programID !== pp.p.ProgramID) {
                // Nuovo Programma
                old_programID = pp.p.ProgramID;
                old_groupID = -1; // Per ogni programma resetto la variabile che indica il gruppo
                programList.push(this.ProgramItemToProgramCreateDto(pp.p, UserID));
            }
            if (pp.w.GroupID != null && old_groupID !== pp.w.GroupID) {
                // Nuovo Gruppo di allenamenti
                old_groupID = pp.w.GroupID;
                programList.at(-1)?.workoutGroupList.push({workoutList: []});
            }
            if (pp.w.WorkoutID != null && old_workoutID !== pp.w.WorkoutID) {
                // Nuovo allenamento
                old_workoutID = pp.w.WorkoutID;
                programList.at(-1)?.workoutGroupList.at(-1)?.workoutList.push(this.WorkoutItemToWorkoutCreateDto(pp.w));
            }
            // Nuovo esercizio
            programList.at(-1)?.workoutGroupList.at(-1)?.workoutList.at(-1)?.exerciseList.push(this.ExerciseWorkoutItemToExerciseWorkoutCreateDto(pp.e_w, pp.e));
        }
        return programList;
    }

    static PlainWorkoutItemToWorkoutDtoList(pwList: PlainWorkoutItem[]): WorkoutDto[] {
        let old_workoutID = 0;
        let wList: WorkoutDto[] = [];
        for (let pw of pwList) {
            if (pw.w.WorkoutID && old_workoutID !== pw.w.WorkoutID) {
                // Nuovo allenamento
                old_workoutID = pw.w.WorkoutID;
                wList.push(this.WorkoutItemToWorkoutDto(pw.w));
            }
            // Nuovo esercizio
            wList.at(-1)?.exerciseList.push(this.ExerciseWorkoutItemToExerciseWorkoutDto(pw.e_w, pw.e));
        }
        return wList;
    }

    static editProgramDtoToEditProgramItem(epDto: EditProgramDto): EditProgramItem {
        return {
            programID: epDto.programID,
            programStateID: epDto.programState,
            programTitle: epDto.programTitle
        } as EditProgramItem
    }

    static shareProgramDtoToShareProgramItem(userID: number, clonedProgramID: number, dto: ShareProgramDto): ShareProgram {
        return {
            FromUserID: userID,
            ToUserID: dto.toUserID,
            OriginalProgramID: dto.originalProgramID,
            ClonedProgramID: clonedProgramID,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        } as ShareProgram
    }
}
