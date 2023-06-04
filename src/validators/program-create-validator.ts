import * as yup from "yup";

export const createExerciseType = yup.object().shape({
    exerciseID: yup.number().required().min(0),
    set: yup.number().required().min(0),
    rep: yup.number().required().min(0),
    weight: yup.number().required().min(0),
    RPE: yup.number().min(0).nullable(),
    RM: yup.number().min(0).nullable(),
    percentage: yup.number().min(0).max(100).nullable(),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
})

export const createWorkoutType = yup.object().shape({
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
    exerciseList: yup.array().of(
        createExerciseType
    ).required().min(1)
})
export const createWorkoutGroupType = yup.object().shape({
    workoutList: yup.array().of(
        createWorkoutType
    ).required().min(1)
})

export const createProgramType = yup.object().shape({
    userID: yup.number().required(),
    title: yup.string().required().min(1),
    programTypeID: yup.number().required(),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
    workoutGroupList: yup.array().of(createWorkoutGroupType).required().min(1)
});

export {};
