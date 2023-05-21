export interface FoodItem {
    /**
     * Id in inserimento è un campo nullo.
     */
    FoodID?: number,
    Description: string,
    Category: string | null,
    Protein: number | null,
    Carbo: number | null,
    Fat: number | null,
    Calories: number | null,
    Fiber: number | null,
    Starch: number | null,
    Sugar: number | null,
    fdcId: number | null,
    Barcode: string | null
}


export {}
