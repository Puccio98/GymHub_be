const yup = require('yup');

module.exports = yup.object().shape({
    workoutID: yup.number().required(),
    programID: yup.number().required(),
});

export {};
