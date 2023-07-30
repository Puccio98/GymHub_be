export interface FoodDto {
    foodID: number,
    description: string,
    category: string | null,
    protein: number,
    carbo: number | null,
    fat: number,
    calories: number,
    fiber: number | null,
    starch: number | null,
    sugar: number | null,
    fdcId: number | null,
    barcode: string | null
}