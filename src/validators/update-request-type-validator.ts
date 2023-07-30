import * as yup from "yup";
import {RequestStateEnum} from "../enums/request-state.enum";

export const updateRequestType = yup.object().shape({
    requestID: yup.number().required(),
    requestStateID: yup.number().default(RequestStateEnum.PENDING),
});
