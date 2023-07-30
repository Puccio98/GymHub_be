export interface USDA_Dto {
    totalHits: number;
    foods: itemUSDA[];
}

export interface itemUSDA {
    fdcId: number;
    description: string;
    dataType: string;
    gtinUpc: string;
    publishedDate: string;
    brandOwner: string;
    brandName: string;
    ingredients: string;
    marketCountry: string;
    foodCategory: string;
    modifiedDate: string;
    dataSource: string;
    packageWeight: string;
    servingSizeUnit: string;
    servingSize: number;
    tradeChannels?: (string)[] | null;
    allHighlightFields: string;
    score: number;
    microbes?: (null)[] | null;
    foodNutrients: FoodNutrientsEntity[];
    finalFoodInputFoods?: (null)[] | null;
    foodMeasures?: (null)[] | null;
    foodAttributes?: (null)[] | null;
    foodAttributeTypes?: (null)[] | null;
    foodVersionIds?: (null)[] | null;
}

export interface FoodNutrientsEntity {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    derivationCode: string;
    derivationDescription: string;
    derivationId: number;
    value: number;
    foodNutrientSourceId: number;
    foodNutrientSourceCode: string;
    foodNutrientSourceDescription: string;
    rank: number;
    indentLevel: number;
    foodNutrientId: number;
    percentDailyValue?: number | null;
}

export interface Aggregations {
    dataType: DataType;
    nutrients: Nutrients;
}

export interface DataType {
    Branded: number;
}

export interface Nutrients {
}
