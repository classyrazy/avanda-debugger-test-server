"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidateLogin {
    boot(res, req) {
        return req.validate((Rule) => ({
            email: new Rule().required().email(),
            password: new Rule().required()
        }));
    }
}
exports.default = ValidateLogin;
