import {WorkoutItem} from "../models/workout";

const Workout = require('../models/workout');

export class BOWorkout {
    // region Properties
    WorkoudID: number;
    ProgramID: number;
    IsDone: boolean;
    // endregion

    //region Constructor
    constructor(w: { workoutId?: number, workoutItem: WorkoutItem }) {
        if (w.workoutItem) {
            this.initByEntity(w.workoutItem);
        } else if (w.workoutId) {
            Workout.findOne({where: {workoutID: w.workoutId}})
                .then((workoutItem: WorkoutItem) => {
                    if (!workoutItem) {
                        throw  new Error('Workout not found');
                    }
                    return this.initByEntity(workoutItem);
                })
                .catch((err: Error) => {
                    throw  new Error(err.message);
                });
        }
        throw  new Error('Se non ho l\'ID e non ho l\'entity come pensi che io possa creare l\'allenamento?');
    }

    private initByEntity(workoutItem: WorkoutItem) {
        this.WorkoudID = workoutItem.WorkoutID;
        this.ProgramID = workoutItem.ProgramID;
        this.IsDone = workoutItem.IsDone;
    }

    // endregion

    //region Metodi Pubblici
    // endregion

    //region Metodi Privati
    // endregion
}

