import 'reflect-metadata';
import jwt from 'jsonwebtoken';
import { env } from '../../env';
import { JsonController, Res, Body, Req, Post, Get, Authorized } from 'routing-controllers';
import { LoginLogService } from '../services/LoginLogService';
import { LoginUserRequest } from './requests/LoginUserRequest';
import { AccessTokenService } from '../services/AccessTokenService';
import { CreateUserRequest } from './requests/CreateUserRequest';
import { User } from '../models/User';
import { LoginLog } from '../models/LoginLog';
import { ResponseUtil } from '../../utils/ResponseUtil';
import { UserService } from '../services/UserService';
import { ObjectID } from 'mongodb';
import { LogService } from '../services/LogService';
import { Log } from '../models/Log';

@JsonController('/auth')
export class AuthController {
    constructor(
        private loginLogService: LoginLogService,
        private accessTokenService: AccessTokenService,
        private userService: UserService,
        private logService: LogService) {
    }

    // Login API
    /**
     * @api {post} /api/auth/login Login
     * @apiGroup Authentication
     * @apiParam (Request body) {String} username User Username
     * @apiParam (Request body) {String} password User Password
     * @apiParamExample {json} Input
     * {
     *      "username" : "",
     *      "password" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "data": "{
     *         "token":''
     *      }",
     *      "message": "Successfully login",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/login
     * @apiErrorExample {json} Login error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/login')
    public async login(@Body({ validate: true }) body: LoginUserRequest, @Res() res: any): Promise<any> {
        let userLogin = await this.userService.findOne({ where: { username: body.username } });

        if (userLogin) {
            const userObjId = new ObjectID(userLogin.id);
            const loginPassword = body.password;
            if (loginPassword === null && loginPassword === undefined && loginPassword === '') {
                const errorResponse = ResponseUtil.getErrorResponse('Invalid password', undefined);
                return res.status(400).send(errorResponse);
            }

            if (await User.comparePassword(userLogin, loginPassword)) {
                // create a token
                const token = jwt.sign({ id: userObjId }, env.SECRET_KEY);

                if (userLogin.banned === true) {
                    const errorResponse = ResponseUtil.getErrorResponse('User Banned', undefined);
                    return res.status(400).send(errorResponse);
                }

                const loginLog = new LoginLog();
                loginLog.userId = userObjId.id;
                loginLog.emailId = userObjId.email;
                loginLog.firstName = userObjId.firstName;
                await this.loginLogService.create(loginLog);

                userLogin = await this.userService.cleanUserField(userLogin);

                const result = { token, user: userLogin };
                const successResponse = ResponseUtil.getSuccessResponse('Loggedin successful', result);
                return res.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Invalid Password', undefined);
                return res.status(400).send(errorResponse);
            }
        } else {
            const errorResponse: any = { status: 0, message: 'Invalid username' };
            return res.status(400).send(errorResponse);
        }
    }

    // Logout API
    /**
     * @api {get} /api/auth/logout Log Out API
     * @apiGroup Authentication
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully logout",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/logout
     * @apiErrorExample {json} Logout error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/logout')
    @Authorized('user')
    public async logout(@Req() request: any, @Res() response: any): Promise<any> {
        const user = await this.accessTokenService.findOne({
            where: {
                userId: request.user.id,
            },
        });
        if (!user) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid token',
            };
            return response.status(400).send(errorResponse);
        }
        const deleteToken = await this.accessTokenService.delete(user);
        if (!deleteToken) {
            const successResponse: any = {
                status: 1,
                message: 'Successfully Logout',
            };
            return response.status(200).send(successResponse);
        }
    }

    /**
     * @api {post} /api/auth/register Create User
     * @apiGroup Guest API
     * @apiParam (Request body) {String} username username
     * @apiParam (Request body) {String} password password
     * @apiParam (Request body) {String} email email
     * @apiParam (Request body) {String} firstName firstName
     * @apiParam (Request body) {String} lastName lastName
     * @apiParam (Request body) {String} citizenId citizenId
     * @apiParam (Request body) {number} gender gender
     * @apiParamExample {json} Input
     * {
     *      "username" : "",
     *      "password" : "",
     *      "email" : "",
     *      "firstname" : "",
     *      "lastname" : "",
     *      "citizenId" : "",
     *      "gender" : ""
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully create User",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/register
     * @apiErrorExample {json} Error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/register')
    public async register(@Body({ validate: true }) body: CreateUserRequest, @Res() response: any, @Req() req: any): Promise<any> {
        // const mode = req.headers.mode;
        const registerUsername = body.username.toLowerCase();
        const registerEmail = body.email.toLowerCase();
        let registerPassword = body.password;
        const type = body.type.toLocaleLowerCase();
        
        const dataUsername: User = await this.userService.findOne({ where: { username: registerUsername } });
        if (dataUsername) {
            const errorResponse = ResponseUtil.getErrorResponse('This Username already exists', dataUsername);
            return response.status(400).send(errorResponse);
        }

        const dataEmail: User = await this.userService.findOne({ where: { email: registerEmail } });
        if (dataEmail) {
            const errorResponse = ResponseUtil.getErrorResponse('This Email already exists', dataEmail);
            return response.status(400).send(errorResponse);
        }

        if (registerPassword === null || registerPassword === undefined) {
            const errorResponse = ResponseUtil.getErrorResponse('Password is Empty', dataEmail);
            return response.status(400).send(errorResponse);
        } else {
            registerPassword = await User.hashPassword(registerPassword);
        }

        if (type !== 'superadmin' && type !== 'admin' && type !== 'author') {
            const errorResponse = ResponseUtil.getErrorResponse('Invalid type', type);
            return response.status(400).send(errorResponse);
        }

        const user: User = new User();
        user.username = registerUsername;
        user.password = registerPassword;
        user.firstname = body.firstname;
        user.lastname = body.lastname;
        user.email = registerEmail;
        user.type = type;
        user.image = body.image;
        user.nickname = body.nickname;
        user.is_deleted = false;

        let result = await this.userService.create(user);

        if (result) {
            const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});
            const log: Log = new Log();
            log.action = 'create';
            log.collection = 'user';
            log.document = result.id;
            log.description = owner.firstname + ' สมัครสมาชิก username : ' + result.username + ' เป็น ' + result.type;
            log.user_id = new ObjectID(body.user_id);
            await this.logService.create(log);
            result = this.userService.cleanUserField(result);
            const successResponse = ResponseUtil.getSuccessResponse('Register Success', result);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('Register Failed', undefined);
            return response.status(400).send(errorResponse);
        }
        
    }
}
