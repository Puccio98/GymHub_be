const yup = require('yup');

module.exports = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required().min(8)
});

export {};