const yup = require('yup');

module.exports = yup.object().shape({
    programID: yup.number().required(),
});

export {};
