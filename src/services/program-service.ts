import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ProgramDao} from "../dao/program-dao";
import {ProgramLib} from "../lib_mapping/programLib";

export class ProgramService {

    static async getProgramListByUserID(userID: number): Promise<ServiceResponse<ProgramDto[]>> {
        const programList = await ProgramDao.getProgramListByUserID(userID);
        if (programList.length) {
            return {
                data: ProgramLib.PlainProgramItemListToProgramDtoList(programList),
                status: ServiceStatusEnum.SUCCESS,
                message: 'User found'
            }
        } else {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'Programs not found'
            };
        }

    }
}