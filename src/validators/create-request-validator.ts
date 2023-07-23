import * as yup from "yup";
import {RequestState} from "../enums/request-state.enum";
import {RequestHelper} from "../helpers/RequestHelper";

export const createRequestType = yup.object().shape({
    toUserID: yup.number().required(),
    requestTypeID: yup.number().required('Request type required').test({
        name: 'isRequestTypeValid',
        message: 'Request type non valido',
        test: value => RequestHelper.isRequestStateValid(value)
    }),
    requestStateID: yup.number().default(RequestState.PENDING),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
});
