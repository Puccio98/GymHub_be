import {StatusEnum} from "../enums/status.enum";


export class ProgramHelper {

    /**
     * Restituisce true se il numero passato in input è contenuto tra i tipi di stato possibili, altrimenti false,
     * @param status
     */
    static isStatusValid(status: number | undefined): boolean {
        return !status ? false : status in StatusEnum
    }
}
