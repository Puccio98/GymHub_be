const yup = require('yup');

module.exports = yup.object().shape({
    exercise_WorkoutID: yup.number().required(),
    workoutID: yup.number().required(),
    programID: yup.number().required(),
    set: yup.number().required().min(0),
    rep: yup.number().required().min(0),
    weight: yup.number().required().min(0),
    RPE: yup.number().min(0),
    RM: yup.number().min(0),
    percentage: yup.number().min(0).max(100),
    statusID: yup.number().required().max(3),
});

export {};
