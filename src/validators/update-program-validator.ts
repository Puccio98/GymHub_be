import * as yup from "yup";

export const updateProgramType = yup.object().shape({
    programID: yup.number().required(),
});

export {};
