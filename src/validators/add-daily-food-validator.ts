import * as yup from "yup";
import {DateHelper} from "../helpers/date.helper";

export const addDailyFoodType = yup.object().shape({
    foodID: yup.number().required("foodID obbligatorio"),
    quantity: yup.number().required().min(0, "Quantità minima deve essere positiva"),
    mealID: yup.number().required().min(1, "mealID invalido").max(4, "mealID invalido"),
    date: yup.string().default(() => DateHelper.today_string()),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date())
});