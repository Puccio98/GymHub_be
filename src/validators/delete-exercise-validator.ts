const yup = require('yup');

module.exports = yup.object().shape({
    exerciseID: yup.number().required(),
    workoutID: yup.number().required(),
    programID: yup.number().required()
});

export {};
