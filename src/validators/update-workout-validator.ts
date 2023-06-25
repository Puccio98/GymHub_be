import * as yup from "yup";
import {ProgramHelper} from "../helpers/ProgramHelper";

export const updateWorkoutType = yup.object().shape({
    statusID: yup.number().required('StatusID required').test({
        name: 'isStatusValid',
        message: 'Status non valido',
        test: value => ProgramHelper.isStatusValid(value)
    })
});

export {};
