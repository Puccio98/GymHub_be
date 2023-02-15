import {Request, Response} from "express";

export class SchedaController {
    static fetchExercises = async (req: Request, res: Response) => {
        return res.status(501).json({error: "Method not implemented :'c"});
        // per prima cosa sarebbe meglio verificare l'esistenza dell'utente
    }
    static postNewScheda = (req: Request, res: Response) => {
        return res.status(501).json({error: "Method not implemented :'c"});
        /**
         * Se l'utente non ha la scheda, creane una nuova e posta gli esercizi,
         * altrimenti aggiorna la scheda.
         */
    };
}