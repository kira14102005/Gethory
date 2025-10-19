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
exports.updateUser = void 0;
const http_1 = require("../constants/http");
const UserCollection_1 = __importDefault(require("../models/UserCollection"));
const appAssert_1 = require("../utils/appAssert");
const jimp_1 = __importDefault(require("jimp"));
const path_1 = __importDefault(require("path"));
const updateUser = (userId, username, name, avatar) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Update Object : ", userId, username);
    let imgPath;
    if (avatar) {
        const buffer = Buffer.from(avatar.split(",")[1], "base64");
        const image = yield jimp_1.default.read(buffer);
        image.resize(150, jimp_1.default.AUTO);
        imgPath = `${Date.now()}.${Math.floor(Math.random() * 1e6)}.png`;
        yield image.writeAsync(path_1.default.resolve(__dirname, `../storage/${imgPath}`));
    }
    const updatedUser = yield UserCollection_1.default.findByIdAndUpdate(userId, {
        $set: {
            username,
            name,
            avatar: imgPath,
            profileCompleted: true,
        },
    }, { new: true });
    (0, appAssert_1.appAssert)(updatedUser, http_1.HTTP.NOT_FOUND, "User not found or update failed");
    return updatedUser;
});
exports.updateUser = updateUser;
