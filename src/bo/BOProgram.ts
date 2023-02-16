import {ProgramItem} from "../models/program";
import {ProgramStateEnum} from "../enums/program-state-enum";

const Program = require('../models/program');

export class BOProgram {
    // region Properties
    ProgramID: number;
    UserID: number;
    Title: string;
    Description?: string;
    ProgramStateID: ProgramStateEnum;
    NumberOfWorkout?: number;
    // endregion

    //region Constructor
    constructor(p: { programId?: number, programItem?: ProgramItem }) {
        if (p.programItem) {
            this.initByEntity(p.programItem);
        } else if (p.programId) {
            Program.findOne({where: {programID: p.programId}})
                .then((programItem: ProgramItem) => {
                    if (!programItem) {
                        throw  new Error('Program not found');
                    }
                    return this.initByEntity(programItem);
                })
                .catch((err: Error) => {
                    throw  new Error(err.message);
                });
        }
        throw  new Error('Se non ho l\'ID e non ho l\'entity come pensi che io possa creare la scheda?');
    }

    private initByEntity(programItem: ProgramItem) {
        this.ProgramID = programItem.ProgramID;
        this.UserID = programItem.UserID;
        this.Title = programItem.Title;
        this.Description = programItem.Description;
        this.ProgramStateID = programItem.ProgramStateID;
        this.NumberOfWorkout = programItem.NumberOfWorkout;
    }

    // endregion

    //region Metodi Pubblici
    // endregion

    //region Metodi Privati
    // endregion
}

