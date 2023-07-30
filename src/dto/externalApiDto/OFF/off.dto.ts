export interface OFF_Dto {
    code: string;
    product: itemOFF;
    status: number;
    status_verbose: string;
}

export interface itemOFF {
    categories_old: string;
    nutriments: Nutriments;
    product_name: string;
    product_name_it: string;
    product_quantity: string;
    quantity: string;
    serving_size: string;
    code: string;
}

export interface Nutriments {
    proteins_100g: number;
    carbohydrates_100g: number;
    fat_100g: number;
    fiber_100g: number;
    sugars_100g: number;
    energy_kcal_100g: number;
}
