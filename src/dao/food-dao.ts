import {db} from "../database";
import {itemOFF, OFF_Dto} from "../dto/externalApiDto/OFF/off-dto";
import {itemUSDA, USDA_Dto} from "../dto/externalApiDto/USDA/usda-dto";
import {FoodItem} from "../models/food";

const usda_key: string = 'EoYBMJ5Trk0D5qe40cCewrHdeWuagtPMGg8sB3wq';
const usda_server: string = 'https://api.nal.usda.gov/fdc'
const esempio_chiamata_usda_barcode: string = 'https://api.nal.usda.gov/fdc/v1/foods/search'
//const off = require('openfoodfacts-nodejs');
//const client = new off();
const axios = require("axios");


export class FoodDao {
    // region Public Methods
    //find by name


    // get by barcode
    static async get(barcode: string): Promise<FoodItem> {
        const foods: FoodItem[] = await db('Food').where({Barcode: barcode}).select();
        return foods[0];
    }

    // Ricerca il codice a barre sul database di open food facts
    static async getFromOFF(barcode: string): Promise<itemOFF | null> {
        const getParams: string = '?fields=product_name,product_name_it,nutriments,product_quantity,quantity,serving_size,categories_old';
        const config: any = {headers: {'User-Agent': 'GymHub - Version 1.0'}};
        try {
            const res = await axios.get(`https://it-it.openfoodfacts.org/api/v2/product/${barcode}` + getParams, config);
            const itemOff: OFF_Dto = res.data;
            // @ts-ignore Sono costretto a fare questa schifezza
            itemOff.product.nutriments.energy_kcal_100g = itemOff.product.nutriments['energy-kcal_100g'];
            itemOff.product.code = itemOff.code;
            return itemOff.product
        } catch (e) {
            return null;
        }
    }

    // Ricerca il codice a barre sul database di USDA FoodData Central
    static async getFromUSDA(barcode: string): Promise<itemUSDA | null> {
        const getParams: string = `?query=${barcode}&pageSize=1&api_key=${usda_key}`;
        try {
            const res = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search` + getParams);
            const itemUSDA: USDA_Dto = res.data;
            if (itemUSDA.totalHits > 0) {
                return itemUSDA.foods[0];
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    // Verifica che un alimento abbia i campi necessari per l'inserimento
    static checkCreate(food: FoodItem): boolean {
        // Nome deve essere valorizzato
        if (!food.Description) {
            return false;
        }
        // Macronutrienti devono essere valorizzati
        if (food.Calories == null || food.Fat == null || food.Protein == null) {
            return false;
        }
        if (food.Carbo == null && food.Starch == null) {
            return false;
        }

        return true;
    }

    static async create(userFood: FoodItem): Promise<number> {
        const f = await db('Food').insert(userFood);
        // Ritorno l'id del record appena creato
        return f[0];
    }

    //endregion
}
