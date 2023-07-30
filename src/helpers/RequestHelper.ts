import {RequestStateEnum} from "../enums/request-state.enum";
import {RequestType} from "../enums/request-type.enum";


export class RequestHelper {

    /**
     * Restituisce true se il numero passato in input è contenuto tra i tipi di richiesta possibili, altrimenti false,
     * @param stateID
     */
    static isRequestStateValid(stateID: number | undefined): boolean {
        return !stateID ? false : stateID in RequestStateEnum
    }

    /**
     * Restituisce true se il numero passato in input è contenuto tra i tipi di richiesta possibili, altrimenti false,
     * @param typeID
     */
    static isRequestTypeValid(typeID: number | undefined): boolean {
        return !typeID ? false : typeID in RequestType
    }
}
