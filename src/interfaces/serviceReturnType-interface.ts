export interface ServiceResponse<T> {
    message?: string;
    data?: T;
    status: ServiceStatusEnum;
}


export enum ServiceStatusEnum {
    SUCCESS = 0,
    ERROR = 1
}

export function response<T>(status: ServiceStatusEnum, message?: string, data?: T): ServiceResponse<T> {
    return {
        message: message,
        data: data,
        status: status
    }

}