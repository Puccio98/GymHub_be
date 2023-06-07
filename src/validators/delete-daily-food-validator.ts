import * as yup from "yup";
import {DateHelper} from "../helpers/DateHelper";

export const baseDailyFoodType = yup.object().shape({
    foodID: yup.number().required("foodID obbligatorio"),
    mealID: yup.number().required().min(1, "mealID invalido").max(4, "mealID invalido"),
    date: yup.string().default(() => DateHelper.today_string()),
});