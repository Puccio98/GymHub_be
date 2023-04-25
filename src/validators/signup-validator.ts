import * as yup from "yup";

export const signupType = yup.object().shape({
    name: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(8),
    phoneNumber: yup.string().required(),
    country: yup.string().required(),
    region: yup.string().required(),
    city: yup.string().required(),
    address: yup.string().required(),
    cap: yup.string().required(),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
});

export {};
