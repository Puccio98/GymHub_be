import {Request, Response} from "express";

const User = require('../models/user');
const Scheda = require('../models/scheda');
const Exercise = require('../models/exercise');

exports.fetchExercises = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const scheda = await Scheda.findOne({raw: false, where: {userId: userId}});
    let schedaId;
    if (!userId || userId === -1) {
        throw new Error('User not found!');
    }
    if (!scheda) {
        // UTENTE NON HA ESERCIZI, PERCHE' NON HA UNA SCHEDA
        res.json({message: 'Non hai nessuna scheda pronta'});
    }
    schedaId = scheda.dataValues.id;
    Exercise.findAll({where: {schedaId: schedaId}})
        .then((e: typeof Exercise[]) => {
            res.json({message: 'La tua scheda:', exercises: e});
        })
        .catch((err: Error) => {
            console.log(err);
            res.json({message: err.message});
        });
}

exports.postNewScheda = (req: Request, res: Response) => {
    /**
     * Se l'utente non ha la scheda, creane una nuova e posta gli esercizi,
     * altrimenti aggiorna la scheda.
     */
};
