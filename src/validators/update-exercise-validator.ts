import * as yup from "yup";

export const updateExerciseType = yup.object().shape({
    exercise_WorkoutID: yup.number().required(),
    workoutID: yup.number().required(),
    programID: yup.number().required(),
    description: yup.string().nullable(),
    set: yup.number().required().min(0),
    rep: yup.number().required().min(0),
    weight: yup.number().required().min(0),
    RPE: yup.number().min(0).nullable(),
    RM: yup.number().min(0).nullable(),
    percentage: yup.number().min(0).max(100).nullable(),
    statusID: yup.number().required()
});

export {};
