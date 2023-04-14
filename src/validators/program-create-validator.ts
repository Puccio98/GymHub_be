const yup = require('yup');

let exerciseType = yup.object().shape({
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
