import {ProgramType} from "../../enums/program-type";

export interface ProgramCreateDTO {
    userID: number;
    title: string;
    numberOfWorkout: number;
    programType: ProgramType;
    workoutList: WorkoutCreateDTO[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WorkoutCreateDTO {
    isDone: boolean;
    exerciseList: ExerciseCreateDTO[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ExerciseCreateDTO {
    exerciseID: number;
    set: number;
    rep: number;
    weight: number;
    RPE?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
