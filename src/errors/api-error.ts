class ApiError {
    // region Properties
    code: number;
    message: string;

    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }

    static badRequest(msg: string) {
        return new ApiError(400, msg);
    }

    static unauthorized(msg: string) {
        return new ApiError(401, msg);
    }
}

module.exports = ApiError;