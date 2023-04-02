const yup = require('yup');

module.exports = yup.object().shape({
    weight: yup.number().required().min(0, "Weight must be a positive number"),
    date: yup.date().required().transform((data: Date) => {
        data.setHours(0, 0, 0, 0);


        console.log('original date', data);
        data.setHours(0, 0, 0, 0);
        console.log('date 0000', data);
        console.log('formatted date 0000', new Date(data));
        console.log('new date', new Date());

        console.log('confronti --------------');
        console.log(data < new Date());


        return data;
    }).max(new Date(), "Cannot use future date"),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
});

export {};
