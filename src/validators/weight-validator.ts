const yup = require('yup');

module.exports = yup.object().shape({
    weight: yup.number().required().min(0, "Weight must be a positive number"),
    date: yup.lazy(() => {
        return yup.date().required().max(new Date(), "Cannot use future date")
    }),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
});

export {};
