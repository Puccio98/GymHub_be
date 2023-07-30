import * as yup from "yup";
import {RequestState} from "../enums/request-state.enum";

export const updateRequestType = yup.object().shape({
    requestID: yup.number().required(),
    requestStateID: yup.number().default(RequestState.PENDING),
});
