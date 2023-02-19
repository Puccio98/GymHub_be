export interface ServiceResponse<T> {
    message?: string;
    data?: T;
    status: ServiceStatusEnum;
}


export enum ServiceStatusEnum {
    SUCCESS = 0,
    ERROR = 1

}

