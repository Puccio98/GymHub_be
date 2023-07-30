import * as yup from "yup";
import {ProgramHelper} from "../helpers/program.helper";

export const updateWorkoutType = yup.object().shape({
    statusID: yup.number().required('StatusID required').test({
        name: 'isStatusValid',
        message: 'Status non valido',
        test: value => ProgramHelper.isStatusValid(value)
    })
});

export {};
