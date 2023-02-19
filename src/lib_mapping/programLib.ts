import {PlainProgramItem} from "../models/plainProgram";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramItem} from "../models/program";
import {WorkoutDto} from "../dto/programDto/workout-dto";
import {WorkoutItem} from "../models/workout";
import {ExerciseWorkoutItem} from "../models/exercise_workout";
import {ExerciseItem} from "../models/exercise";
import {ExerciseWorkoutDto} from "../dto/programDto/exercises_workout-dto";

export class ProgramLib {
    static ProgramItemToProgramDto(programItem: ProgramItem): ProgramDto {
        return {
            programID: programItem.ProgramID,
            userID: programItem.UserID,
            title: programItem.Title,
            description: programItem.Description,
            programStateID: programItem.ProgramStateID,
            numberOfWorkout: programItem.NumberOfWorkout,
            workoutList: []
        } as ProgramDto
    }

    static WorkoutItemToWorkoutDto(workoutItem: WorkoutItem): WorkoutDto {
        return {
            workoutID: workoutItem.WorkoutID,
            programID: workoutItem.ProgramID,
            isDone: workoutItem.IsDone,
            exerciseList: []
        } as WorkoutDto
    }

    static ExerciseWorkoutItemToExerciseWorkoutDto(ew: ExerciseWorkoutItem, e: ExerciseItem): ExerciseWorkoutDto {
        return {
            // ExerciseWorkoutItem
            exercise_WorkoutID: ew.Exercise_WorkoutID,
            workoutID: ew.WorkoutID,
            set: ew.Set,
            rep: ew.Rep,
            weight: ew.Weight,
            RPE: ew.RPE,
            RM: ew.RM,
            percentage: ew.Percentage,

            // ExerciseItem
            exerciseID: e.ExerciseID,
            title: e.Title,
            subtitle: e.Subtitle,
            description: e.Description
        } as ExerciseWorkoutDto
    }

    static PlainProgramItemListToProgramDtoList(ppList: PlainProgramItem[]): ProgramDto[] {
        let programList: ProgramDto[] = [];
        let old_programID = 0;
        let old_workoutID = 0;
        for (let pp of ppList) {
            if (old_programID !== pp.p.ProgramID) {
                // Nuovo Programma
                old_programID = pp.p.ProgramID;
                programList.push(this.ProgramItemToProgramDto(pp.p));
            }
            if (old_workoutID !== pp.w.WorkoutID) {
                // Nuovo allenamento
                old_workoutID = pp.w.WorkoutID;
                programList.at(-1)?.workoutList.push(this.WorkoutItemToWorkoutDto(pp.w));
            }
            // Nuovo esercizio
            programList.at(-1)?.workoutList.at(-1)?.exerciseList.push(this.ExerciseWorkoutItemToExerciseWorkoutDto(pp.e_w, pp.e));
        }
        return programList;
    }
}
