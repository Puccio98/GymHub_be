export interface ff {
    totalHits: number;
    currentPage: number;
    totalPages: number;
    pageList?: (number)[] | null;
    foodSearchCriteria: FoodSearchCriteria;
    foods: FoodsEntity[];
    aggregations: Aggregations;
}

export interface FoodSearchCriteria {
    dataType?: (string)[] | null;
    query: string;
    generalSearchInput: string;
    pageNumber: number;
    sortBy: string;
    sortOrder: string;
    numberOfResultsPerPage: number;
    pageSize: number;
    requireAllWords: boolean;
    foodTypes?: (string)[] | null;
}

export interface FoodsEntity {
    fdcId: number;
    description: string;
    commonNames: string;
    additionalDescriptions: string;
    dataType: string;
    ndbNumber: number;
    publishedDate: string;
    foodCategory: string;
    mostRecentAcquisitionDate: string;
    allHighlightFields: string;
    score: number;
    microbes?: (null)[] | null;
    foodNutrients?: (FoodNutrientsEntity)[] | null;
    finalFoodInputFoods?: (null)[] | null;
    foodMeasures?: (null)[] | null;
    foodAttributes?: (null)[] | null;
    foodAttributeTypes?: (null)[] | null;
    foodVersionIds?: (null)[] | null;
    scientificName?: string | null;
}

export interface FoodNutrientsEntity {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName?: string | null;
    derivationCode?: string | null;
    derivationDescription?: string | null;
    derivationId?: number | null;
    value?: number | null;
    foodNutrientSourceId?: number | null;
    foodNutrientSourceCode?: string | null;
    foodNutrientSourceDescription?: string | null;
    rank: number;
    indentLevel: number;
    foodNutrientId: number;
    dataPoints?: number | null;
    min?: number | null;
    max?: number | null;
    median?: number | null;
}

export interface Aggregations {
    nutrients: Nutrients;
}

export interface Nutrients {
}
