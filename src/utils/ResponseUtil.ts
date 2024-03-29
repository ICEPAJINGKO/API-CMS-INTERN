export class ResponseUtil {
    public static getSuccessResponse(msg: string, value: any): any {
        if (value !== null || value !== undefined || value !== '') {
            const sucessRes: any = {
                status: 1,
                message: msg,
                data: value,
            };
            return sucessRes;
        } else {
            const sucessRes: any = {
                status: 1,
                message: msg,
            };
            return sucessRes;
        }

    }
    public static getErrorResponse(msg: string, err: any): any {
        if (err !== null || err !== undefined || err !== '') {
            const errorResponse: any = {
                status: 0,
                message: msg,
                error: err,
            };
            return errorResponse;
        } else {
            const errorResponse: any = {
                status: 0,
                message: msg,
            };
            return errorResponse;
        }
    }
}
