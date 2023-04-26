import {PlainProgramItem} from "../dto/programDto/plainProgram";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramItem} from "../models/program";
import {WorkoutDto} from "../dto/programDto/workout-dto";
import {WorkoutItem} from "../models/workout";
import {ExerciseWorkoutItem} from "../models/exercise_workout";
import {ExerciseItem} from "../models/exercise";
import {ExerciseWorkoutDto} from "../dto/programDto/exercises_workout-dto";
import {ExerciseDto} from "../dto/programDto/exercise-dto";
import {ExerciseCreateDTO, ProgramCreateDTO, WorkoutCreateDTO} from "../dto/programDto/program-create-dto";
import {ProgramStateEnum} from "../enums/program-state-enum";
import {PlainWorkoutItem} from "../dto/programDto/plainWorkout";
import {EditProgramDto} from "../dto/programDto/edit-program.dto";
import {EditProgramItem} from "../models/edit-program-item";

export class ProgramLib {
    static ProgramItemToProgramDto(programItem: ProgramItem): ProgramDto {
        return {
            programID: programItem.ProgramID,
            userID: programItem.UserID,
            title: programItem.Title,
            description: programItem.Description,
            programStateID: programItem.ProgramStateID,
            numberOfWorkout: programItem.NumberOfWorkout,
            workoutList: [],
        } as ProgramDto
    }

    static ProgramCreateDtoToProgramItem(p: ProgramCreateDTO): ProgramItem {
        return {
            UserID: p.userID,
            Title: p.title,
            ProgramStateID: ProgramStateEnum.ACTIVE,
            NumberOfWorkout: p.numberOfWorkout,
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

    static WorkoutCreateDtoListToWorkoutItemList(wList: WorkoutCreateDTO[], programID: number): WorkoutItem[] {
        let workoutItemList: WorkoutItem[] = [];
        for (let w of wList) {
            workoutItemList.push(ProgramLib.WorkoutCreateDtoToWorkoutItem(w, programID));
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

    static WorkoutCreateDtoToWorkoutItem(w: WorkoutCreateDTO, programID: number): WorkoutItem {
        return {
            ProgramID: programID,
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
        let old_programID = 0;
        let old_workoutID = 0;
        for (let pp of ppList) {
            if (pp.p.ProgramID && old_programID !== pp.p.ProgramID) {
                // Nuovo Programma
                old_programID = pp.p.ProgramID;
                programList.push(this.ProgramItemToProgramDto(pp.p));
            }
            if (pp.w.WorkoutID && old_workoutID !== pp.w.WorkoutID) {
                // Nuovo allenamento
                old_workoutID = pp.w.WorkoutID;
                programList.at(-1)?.workoutList.push(this.WorkoutItemToWorkoutDto(pp.w));
            }
            // Nuovo esercizio
            programList.at(-1)?.workoutList.at(-1)?.exerciseList.push(this.ExerciseWorkoutItemToExerciseWorkoutDto(pp.e_w, pp.e));
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
            programStateID: epDto.programState? ProgramStateEnum.ACTIVE : ProgramStateEnum.INACTIVE,
            programTitle: epDto.programTitle
        } as EditProgramItem
    }
}
