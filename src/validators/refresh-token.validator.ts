import * as yup from "yup";

export const refreshTokenType = yup.object().shape({
    refreshToken: yup.string().required()
});

export {};