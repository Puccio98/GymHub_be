import {ProgramTypeEnum} from "../../enums/program-type.enum";

export interface ProgramCreateDto {
    userID: number,
    title: string,
    statusID: number,
    programTypeID: ProgramTypeEnum,
    workoutGroupList: WorkoutGroupCreateDto[],
    createdAt?: Date,
    updatedAt?: Date,
}

export interface WorkoutGroupCreateDto {
    workoutList: WorkoutCreateDTO[]
}

export interface WorkoutCreateDTO {
    exerciseList: ExerciseCreateDTO[],
    createdAt?: Date,
    updatedAt?: Date,
}

export interface ExerciseCreateDTO {
    exerciseID: number,
    description: string,
    set: number,
    rep: number,
    weight: number,
    RPE?: number,
    createdAt?: Date,
    updatedAt?: Date,
}
