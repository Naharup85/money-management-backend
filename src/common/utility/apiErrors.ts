class ApiError extends Error {
    public statusCode: number;
    constructor(
        message: string,
        statusCode: number,
    ) {
        super(message);
        this.statusCode = statusCode;

        if(Error.captureStackTrace){
            Error.captureStackTrace(this, this.constructor);
        }
    }
    public static notFound(message: string = 'Resource not found') {
        return new ApiError(message, 404);
    }

    public static badRequest(message: string = 'Bad Request') {
        return new ApiError(message, 400);
    }

    public static unprocessableEntity(message: string = 'Unprocessable Entity') {
        return new ApiError(message, 422);
    }

    public static internalServerError(message: string = 'Internal Server Error') {
        return new ApiError(message, 500);
    }

    public static envError(message: string = 'Environment variable not found') {
        return new ApiError(message, 500);
    }
}

export default ApiError;