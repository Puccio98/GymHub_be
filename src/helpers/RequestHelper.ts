import {RequestState} from "../enums/request-state.enum";


export class RequestHelper {

    /**
     * Restituisce true se il numero passato in input è contenuto tra i tipi di richiesta possibili, altrimenti false,
     * @param requestID
     */
    static isRequestStateValid(requestID: number | undefined): boolean {
        return !requestID ? false : requestID in RequestState
    }
}
