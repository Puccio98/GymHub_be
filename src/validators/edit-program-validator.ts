import * as yup from "yup";
import {ProgramHelper} from "../helpers/ProgramHelper";

export const editProgramType = yup.object().shape({
    programID: yup.number().required(),
    programTitle: yup.string().required().nonNullable(),
    programState: yup.number().required(), // è una enum quindi un number
    statusID: yup.number().required('StatusID required').test({
        name: 'isStatusValid',
        message: 'Status non valido',
        test: value => ProgramHelper.isStatusValid(value)
    })
});
