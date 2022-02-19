"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@avanda/http");
const User_1 = __importDefault(require("../models/User"));
const ValidateLogin_1 = __importDefault(require("../middlewares/forms/ValidateLogin"));
const ValidateRegistration_1 = __importDefault(require("../middlewares/forms/ValidateRegistration"));
const app_1 = require("@avanda/app");
const LoggedUserOnly_1 = __importDefault(require("../middlewares/LoggedUserOnly"));
// @ts-ignore
const email_veriff_1 = __importDefault(require("../mail-templates/email-veriff"));
const password_retrieval_1 = __importDefault(require("../mail-templates/password-retrieval"));
const Wallet_1 = __importDefault(require("../models/Wallet"));
const ValidateUpdatePassword_1 = __importDefault(require("../middlewares/forms/ValidateUpdatePassword"));
const Address_1 = __importDefault(require("../models/Address"));
const AdminOnly_1 = __importDefault(require("../middlewares/AdminOnly"));
const ShouldHaveActiveSession_1 = __importDefault(require("../middlewares/ShouldHaveActiveSession"));
const ValidatePasswordRetrieval_1 = __importDefault(require("../middlewares/forms/ValidatePasswordRetrieval"));
const ValidatePasswordReset_1 = __importDefault(require("../middlewares/forms/ValidatePasswordReset"));
class User extends http_1.Controller {
    constructor() {
        super(...arguments);
        this.exclude = [
            'password',
            'email_verification_token',
            'createdAt',
            'updatedAt'
        ];
    }
    async get(res, req) {
        const session = await this.model.getActiveSession(req);
        const user = new User_1.default().find(session.user_id);
        return res.success('you are logged in', user);
    }
    async login(res, req, isAdmin = false) {
        var _a;
        let user = await ((_a = this.model) === null || _a === void 0 ? void 0 : _a.where({
            email: req.getData('email')
        }).first());
        if (!user) {
            return res.error('Invalid email or password');
        }
        if (user.type != 'admin' && isAdmin) {
            return res.error('Unauthorized access');
        }
        let password = req.getData('password');
        let isValidPassword = await app_1.Hash.verify(user.password, password);
        if (!isValidPassword) {
            return res.error('Invalid login details');
        }
        let token = null;
        let next = "/dashboard";
        if (user.email_verification_token) {
            //    user not verified email
            token = await this.model.createSession(user.id, "email-verification");
            next = "/email-verification";
        }
        else {
            token = await this.model.createSession(user.id, "logged-in");
        }
        // create new session
        return res.success('login successful', { token, next, nextRequired: false });
    }
    async adminLogin(res, req) {
        return this.login(res, req, true);
    }
    async updatePassword(res, req) {
        let user = req.getAttrs('user');
        let password = req.getData('password');
        let isValidPassword = await app_1.Hash.verify(user.password, password);
        if (isValidPassword) {
            await new User_1.default().ofId(user.id).update({
                password: await app_1.Hash.make(req.getData('new_password'))
            });
            return res.success('Password successfully updated', {
                next: '/'
            });
        }
        else {
            return res.error('Invalid Old Password');
        }
    }
    async initiatePasswordRetrieval(res, req) {
        let token = app_1.Hash.random(15);
        let email = req.getData('email');
        let user = await this.model.where({ email }).first();
        //update the user's password token token
        await this.model.ofId(user.id).update({
            password_retrieval_token: token
        });
        try {
            let mailer = await app_1.Mail.send((msg) => {
                msg.from('hello@tyfarms.com');
                msg.subject('Tyfarms password retrieval!');
                msg.to(user.email);
                msg.htmlBody(password_retrieval_1.default);
            }, {
                user,
                link: app_1.Env.get('BASE_URL') + '/change-password?token=' + token
            });
            return res.success('Please check your email for password retrieval link');
        }
        catch (e) {
            return res.error(e.message);
        }
    }
    async resetPassword(res, req) {
        let password_retrieval_token = req.getData('token');
        let user = await new User_1.default().where({ password_retrieval_token }).first();
        //    check for token validity
        if (!password_retrieval_token || !user) {
            return res.error('Invalid or expired password retrieval link');
        }
        let newPassword = req.getData('new_password');
        await new User_1.default().ofId(user.id).update({
            password: await app_1.Hash.make(newPassword),
            password_retrieval_token: null
        });
        return res.success('Password successfully updated', {
            next: '/'
        });
    }
    async register(res, req) {
        var _a;
        const user = await ((_a = this.model) === null || _a === void 0 ? void 0 : _a.create({
            email: req.getData('email'),
            password: await app_1.Hash.make(req.getData('password')),
            full_name: req.getData('full_name'),
        }));
        const emailToken = await app_1.Token.generate({ id: user.id, email: user.email });
        //update the user's token
        await this.model.where({ id: user.id }).update({
            email_verification_token: emailToken
        });
        //create wallet for user
        await new Wallet_1.default().create({
            user_id: user.id,
            balance: 0,
            holding_balance: 0
        });
        const token = await this.model.createSession(user.id, "email-verification");
        const link = app_1.Env.get('BASE_URL') + '/email-verification?token=' + emailToken;
        await app_1.Mail.send((msg) => {
            msg.from('hello@tyfarms.com');
            msg.subject('Tyfarms account email verification!');
            msg.to(user.email);
            msg.htmlBody(email_veriff_1.default);
        }, {
            user,
            link
        });
        //
        return res.success('Registration was successful', {
            token,
            next: '/email-verification'
        });
    }
    async verifyEmail(res, req) {
        let token = req.getData('token');
        if (!token) {
            return res.error('Token not found');
        }
        //get related user
        try {
            let deToken = await app_1.Token.decode(token);
            let user = await new User_1.default().find(deToken.id);
            if (!user)
                throw new Error('User associated with this link does not exist');
            if (!user.email_verification_token)
                throw new Error('Link already used or expired');
            await new User_1.default().where({ id: deToken.id }).update({
                email_verification_token: null
            });
            let loginToken = await this.model.createSession(user.id, "logged-in");
            return res.success('Congrats!, email verification successful', { token: loginToken, next: '/dashboard' });
        }
        catch (e) {
            return res.error(e.message);
        }
    }
    async getLoggedInUser(res, req) {
        try {
            const session = await this.model.getActiveSession(req);
            if ((session === null || session === void 0 ? void 0 : session.user_id) && session.auth_stage == 'logged-in') {
                try {
                    let user = await new User_1.default().find(session.user_id);
                    if (!user)
                        return res.error('you are not logged');
                    return res.success('you are logged in', user);
                }
                catch (e) {
                    return res.error(e.message);
                }
            }
        }
        catch (e) {
            return res.error('You are not logged');
        }
    }
    async setDefaultAddress(res, req) {
        let user = req.getAttrs('user');
        let address_id = req.getData('address_id');
        if (!address_id || !await new Address_1.default().find(address_id))
            return res.error('Address not found');
        await this.model.ofId(user.id).update({
            default_address_id: address_id
        });
        return res.success('Successfully set default address');
    }
    async addAddress(res, req) {
        let userId = req.getAttrs('user_id');
        req.setData(Object.assign(Object.assign({}, req.data), { user_id: userId }));
        await new Address_1.default().create(req.data);
        return res.success('Address successfully updated');
    }
    async getAllByPage(response, request) {
        return super.getAllByPage(response, request);
    }
    async resendEmailLink(response, request) {
        let user = request.getAttrs('user');
        console.log({ user });
        const emailToken = await app_1.Token.generate({ id: user.id, email: user.email });
        //update the user's token
        await this.model.where({ id: user.id }).update({
            email_verification_token: emailToken
        });
        let mailer = await app_1.Mail.send((msg) => {
            msg.from('hello@tyfarms.com');
            msg.subject('Tyfarms account email verification!');
            msg.to(user.email);
            msg.htmlBody(email_veriff_1.default);
        }, {
            user,
            link: app_1.Env.get('BASE_URL') + '/email-verification?token=' + emailToken
        });
        console.log({ mailer });
        return response.success('Email link successfully sent');
    }
}
__decorate([
    (0, http_1.Get)(new LoggedUserOnly_1.default())
], User.prototype, "get", null);
__decorate([
    (0, http_1.Post)(new ValidateLogin_1.default())
], User.prototype, "login", null);
__decorate([
    (0, http_1.Post)(new ValidateLogin_1.default())
], User.prototype, "adminLogin", null);
__decorate([
    (0, http_1.Post)(new LoggedUserOnly_1.default(), new ValidateUpdatePassword_1.default())
], User.prototype, "updatePassword", null);
__decorate([
    (0, http_1.Post)(new ValidatePasswordRetrieval_1.default())
], User.prototype, "initiatePasswordRetrieval", null);
__decorate([
    (0, http_1.Post)(new ValidatePasswordReset_1.default())
], User.prototype, "resetPassword", null);
__decorate([
    (0, http_1.Post)(new ValidateRegistration_1.default())
], User.prototype, "register", null);
__decorate([
    (0, http_1.Post)()
], User.prototype, "verifyEmail", null);
__decorate([
    (0, http_1.Get)()
], User.prototype, "getLoggedInUser", null);
__decorate([
    (0, http_1.Post)(new LoggedUserOnly_1.default())
], User.prototype, "setDefaultAddress", null);
__decorate([
    (0, http_1.Post)(new LoggedUserOnly_1.default())
], User.prototype, "addAddress", null);
__decorate([
    (0, http_1.Get)(new LoggedUserOnly_1.default(), new AdminOnly_1.default())
], User.prototype, "getAllByPage", null);
__decorate([
    (0, http_1.Post)(new ShouldHaveActiveSession_1.default())
], User.prototype, "resendEmailLink", null);
exports.default = User;
