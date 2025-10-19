"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateuserProfileController = exports.getUserController = void 0;
const http_1 = require("../constants/http");
const UserCollection_1 = __importDefault(require("../models/UserCollection"));
const user_service_1 = require("../services/user.service");
const appAssert_1 = require("../utils/appAssert");
const catchErrorWrapper_1 = __importDefault(require("../utils/catchErrorWrapper"));
const user_schema_1 = require("./user.schema");
exports.getUserController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, sessionId } = req;
    const user = yield UserCollection_1.default.findById(userId);
    (0, appAssert_1.appAssert)(user, http_1.HTTP.NOT_FOUND, "User Not Exists");
    res.json({
        msg: "Your Details",
        // @ts-ignore
        user: user.omitPassword()
    });
}));
exports.updateuserProfileController = (0, catchErrorWrapper_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        (0, appAssert_1.appAssert)(userId, http_1.HTTP.UNAUTHORIZED, "User ID not found in request (Auth token issue)");
        const { name, username, avatar } = user_schema_1.UpdateUserSchema.parse(req.body);
        const updatedUser = yield (0, user_service_1.updateUser)(userId, username, name, avatar);
        res.status(http_1.HTTP.OK).json({
            msg: "Profile setup complete",
            // @ts-ignore
            user: updatedUser.omitPassword()
        });
    });
});
