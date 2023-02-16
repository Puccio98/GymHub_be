import {ExerciseItem} from "../models/exercise";

const Exercise = require('../models/exercise');

export class BOExercise {
    // region Properties
    ExerciseID: number;
    Title: string;
    Subtitle: string;
    Description?: string;
    // endregion

    //region Constructor
    constructor(e: { exerciseId?: number, exerciseItem?: ExerciseItem }) {
        if (e.exerciseItem) {
            this.initByEntity(e.exerciseItem);
        } else if (e.exerciseId) {
            Exercise.findOne({where: {exerciseID: e.exerciseId}})
                .then((exerciseItem: ExerciseItem) => {
                    if (!exerciseItem) {
                        throw  new Error('Exercise not found');
                    }
                    return this.initByEntity(exerciseItem);
                })
                .catch((err: Error) => {
                    throw  new Error(err.message);
                });
        }
        throw  new Error('Se non ho l\'ID e non ho l\'entity come pensi che io possa creare l\'esercizio?');
    }

    private initByEntity(exerciseItem: ExerciseItem) {
        this.ExerciseID = exerciseItem.ExerciseID;
        this.Title = exerciseItem.Title;
        this.Subtitle = exerciseItem.Subtitle;
        this.Description = exerciseItem.Description;
    }

    // endregion

    //region Metodi Pubblici
    // endregion

    //region Metodi Privati
    // endregion
}
