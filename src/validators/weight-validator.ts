const yup = require('yup');

module.exports = yup.object().shape({
    weight: yup.number().required().min(0, "Weight must be a positive number"),
    date: yup.date().required().transform((data: Date) => {
        console.log('data originale: ' + data);
        data.setHours(0, 0, 0, 0);
        console.log('data settata a 0: ' + data);
        console.log('data corrente server: ' + new Date());

        const result: boolean = data < new Date();

        console.log('data è minore di new Date()? ' + result.toString());

        return data;
    }).max(new Date(), "Cannot use future date"),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
});

export {};
