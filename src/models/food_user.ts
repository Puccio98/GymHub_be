export interface Food_UserItem {
    /**
     * Id in inserimento è un campo nullo.
     */
    Food_UserID?: number,
    UserID: number,
    Quantity: number,
    MealID: number,
    Date: string,
    createdAt: Date,
    updatedAt: Date
}
