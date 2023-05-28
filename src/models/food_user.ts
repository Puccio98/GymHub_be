export interface BaseFood_UserItem {
    FoodID: number,
    MealID: number,
}

export interface Food_UserItem extends BaseFood_UserItem {
    /**
     * Id in inserimento è un campo nullo.
     */
    Food_UserID?: number,
    UserID: number,
    Quantity: number,
    Date: string,
    createdAt: Date,
    updatedAt: Date
}
