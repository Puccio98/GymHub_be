import * as yup from "yup";

export const editProgramType = yup.object().shape({
    programID: yup.number().required(),
    programTitle: yup.string().required().nonNullable(),
    programState: yup.boolean().required()
});
