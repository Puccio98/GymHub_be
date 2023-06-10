import * as yup from "yup";

export const shareProgramType = yup.object().shape({
    toUserID: yup.number().required(),
    originalProgramID: yup.number().required(),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
});
