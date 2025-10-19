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
const mongoose_1 = __importDefault(require("mongoose"));
const hash_1 = require("../utils/hash");
const env_1 = require("../constants/env");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        get: (avatar) => {
            return `${env_1.BACKEND_URL}/storage/${avatar}`;
        }
    },
    verified: {
        type: Boolean,
        default: false,
        required: true,
    },
    profileCompleted: {
        type: Boolean,
        default: false,
        required: true,
    }
}, {
    timestamps: true,
    toJSON: { getters: true }
});
// Adding Some Mongoose Hoooks thar act as triggers
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield (0, hash_1.hashValue)(this.password);
        console.log(this.password);
        next();
    });
});
// Also add a method to the USer Schema to check if the password is matches the hash stored in the database
userSchema.methods.isPasswordMatch = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, hash_1.compareHash)(password, this.password);
    });
};
userSchema.methods.omitPassword = function () {
    const obj = this.toObject ? this.toObject({ getters: true }) : this;
    delete obj.password;
    return obj;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
