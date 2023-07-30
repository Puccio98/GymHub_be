import {WorkoutCreateDTO} from "./program-create.dto";

export interface WorkoutAddDTO extends WorkoutCreateDTO {
    programID: number;
    groupID: number;
}
