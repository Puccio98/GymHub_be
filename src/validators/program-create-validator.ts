const yup = require('yup');

let exerciseType = yup.object().shape({
    exerciseID: yup.number().required().min(0),
    set: yup.number().required().min(0),
    rep: yup.number().required().min(0),
    weight: yup.number().required().min(0),
    RPE: yup.number().min(0).nullable(true),
    RM: yup.number().min(0).nullable(true),
    percentage: yup.number().min(0).max(100).nullable(true),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
})

let workoutType = yup.object().shape({
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
    exerciseList: yup.array().of(
        exerciseType
    ).required().min(1)
})

module.exports = yup.object().shape({
    userID: yup.number().required(),
    title: yup.string().required().min(1),
    numberOfWorkout: yup.number().required().min(1).max(7),
    programType: yup.number().required(),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
    workoutList: yup.array().of(workoutType).required().min(1)
});

export {};
