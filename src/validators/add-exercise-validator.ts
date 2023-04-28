import * as yup from "yup";

export const exerciseType = yup.object().shape({
    set: yup.number().required().min(0),
    rep: yup.number().required().min(0),
    weight: yup.number().required().min(0),
    RPE: yup.number().min(0).nullable(),
    RM: yup.number().min(0).nullable(),
    percentage: yup.number().min(0).max(100).nullable(),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
})

export const addExerciseType = yup.object().shape({
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
    programID: yup.number().required("ProgramID obbligatorio").min(1, "ProgramID non valido"),
    workoutID: yup.number().required("WorkoutID obbligatorio").min(1, "WorkoutID non valido"),
    exercise: exerciseType.required()
});