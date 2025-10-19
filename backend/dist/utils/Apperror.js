"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Apperror extends Error {
    constructor(s, msg) {
        super(msg);
        this.statusCode = s;
    }
}
exports.default = Apperror;
