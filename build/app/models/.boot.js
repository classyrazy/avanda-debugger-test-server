"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const Wallet_1 = __importDefault(require("./Wallet"));
exports.default = {
    User: User_1.default,
    Wallet: Wallet_1.default,
};
