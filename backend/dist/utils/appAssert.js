"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appAssert = appAssert;
const Apperror_1 = __importDefault(require("./Apperror"));
const node_assert_1 = __importDefault(require("node:assert"));
function appAssert(condition, httpStatusCode, msg, appErrorCode) {
    (0, node_assert_1.default)(condition, new Apperror_1.default(httpStatusCode, msg));
}
