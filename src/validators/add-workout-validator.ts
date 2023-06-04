import * as yup from "yup";

import {exerciseType} from "./add-exercise-validator";

export const addWorkoutType = yup.object().shape({
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
    groupID: yup.number().required("GroupID obbligatorio").min(0, "GroupID non valido"),
    programID: yup.number().required("ProgramID obbligatorio").min(1, "ProgramID non valido"),
    exerciseList: yup.array().of(
        exerciseType
    ).required().min(1)
});