import * as yup from "yup";

export const updateWorkoutType = yup.object().shape({
    workoutID: yup.number().required(),
    programID: yup.number().required(),
});

export {};
