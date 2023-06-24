import {Request, Response} from "express";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramService} from "../services/program-service";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramCreateDTO} from "../dto/programDto/program-create-dto";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {EditProgramDto} from "../dto/programDto/edit-program.dto";
import {PayloadJWT} from "../interfaces/payloadJWT";

export class ProgramController {
    static getListByUserID = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const programList: ServiceResponse<ProgramDto[]> = await ProgramService.getListByUserID(userJWT.UserID);

        switch (programList.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(programList.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: programList.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
    static getShared = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const toUserID: number = Number(req.params['user_id']);
        const programList: ServiceResponse<ProgramDto[]> = await ProgramService.getSharedListByUserID(userJWT.UserID, toUserID);

        switch (programList.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(programList.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: programList.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static create = async (req: Request, res: Response) => {
        const program: ProgramCreateDTO = req.body;
        const programList: ServiceResponse<ProgramDto[]> = await ProgramService.create(program);

        switch (programList.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(programList.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: programList.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    /**
     * Metodo che effettua la cancellazione di una scheda, pulendo anche le tabelle che contengono gli allenamenti e gli esercizi per ogni allenamento.
     * La cancellazione avviene solamente se l'utente che ha richiesto l'eliminazione della scheda è anche colui che la possiede.
     * @param req
     * @param res
     */
    static delete = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const programID: number = Number(req.params['program_id']);
        const userJWT = req.AccessPayloadJWT;

        //TODO creare metodo per verificare i parametri i query params cosi come verifichiamo i DTO tramite YUP
        //TODO DEVE STARE IN UNA TRANSACTION MADONNA DI DIO SONO DUE MESI CHE DICO DI DOVERLO FARE E ANCORA NON L'HO FATTO
        const deleteResponse: ServiceResponse<boolean> = await ProgramService.delete(programID, userJWT.UserID);

        switch (deleteResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(deleteResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: deleteResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static reset = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const programID: number = Number(req.params['program_id']);
        const userJWT = req.AccessPayloadJWT;
        const refreshProgramResponse: ServiceResponse<ProgramDto> = await ProgramService.reset(userJWT.UserID, programID);
        switch (refreshProgramResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(refreshProgramResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: refreshProgramResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static edit = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const editProgramDto = req.body;
        const userJWT = req.AccessPayloadJWT;

        const editProgramResponse: ServiceResponse<EditProgramDto> = await ProgramService.edit(userJWT.UserID, editProgramDto);
        switch (editProgramResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(editProgramResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: editProgramResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
    static share = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const shareProgramDto = req.body;
        const userJWT: PayloadJWT = req.AccessPayloadJWT;

        const editProgramResponse: ServiceResponse<EditProgramDto> = await ProgramService.share(userJWT, shareProgramDto);
        switch (editProgramResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(editProgramResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: editProgramResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
}

