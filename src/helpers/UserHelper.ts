import {UserType} from "../enums/user-type.enum";

export class UserHelper {
    /**
     * Restituisce true se il numero passato in input è contenuto tra i tipi di utenti possibili, altrimenti false,
     * @param userType
     */
    static isUserTypeValid(userType: number | undefined): boolean {
        return !userType ? false : userType in UserType
    }
}