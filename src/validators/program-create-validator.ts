const yup = require('yup');

module.exports = yup.object().shape({
    userID: yup.number().required(),
    title: yup.string().required().min(1),
    numberOfWorkout: yup.number().required().min(1).max(7),
    programType: yup.number().required(),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
    workoutList: yup.array().of(
        yup.object().shape({
            isDone: yup.boolean().required(),
            createdAt: yup.date().default(() => new Date()),
            updatedAt: yup.date().default(() => new Date()),
            exerciseList: yup.array().of(
                yup.object().shape({
                    createdAt: yup.date().default(() => new Date()),
                    updatedAt: yup.date().default(() => new Date())
                })
            ).required().min(1)
        })
    ).required().min(1)

});

export {};