import * as yup from "yup";

export const deleteExerciseType = yup.object().shape({
    exerciseID: yup.number().required(),
    workoutID: yup.number().required(),
    programID: yup.number().required()
});

