import * as yup from "yup";
import {UserHelper} from "../helpers/UserHelper";

export const signupType = yup.object().shape({
    name: yup.string().required(),
    lastName: yup.string().required(),
    userName: yup.string().required(),
    userTypeID: yup.number().required('UserTypeID required').test({
        name: 'isUserTypeValid',
        message: 'User Type non valido',
        test: value => UserHelper.isUserTypeValid(value)
    }),
    email: yup.string().required().email(),
    password: yup.string().required().min(8),
    confirmPassword: yup.string().required().min(8).oneOf([yup.ref('password')], "passwords don't match"),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
});

