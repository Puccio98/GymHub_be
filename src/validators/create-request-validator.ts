import * as yup from "yup";
import {RequestStateEnum} from "../enums/request-state.enum";
import {RequestHelper} from "../helpers/request.helper";

export const createRequestType = yup.object().shape({
    toUserID: yup.number().required(),
    requestTypeID: yup.number().required('Request type required').test({
        name: 'isRequestTypeValid',
        message: 'Request type non valido',
        test: value => RequestHelper.isRequestTypeValid(value)
    }),
    requestStateID: yup.number().default(RequestStateEnum.PENDING),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
});
