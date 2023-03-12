const yup = require('yup');

module.exports = yup.object().shape({
    refreshToken: yup.string().required()
});

export {};