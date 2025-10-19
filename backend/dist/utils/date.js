"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiveMinsAgo = exports.ONE_DAY_MILIS = void 0;
exports.getOneYearFromNow = getOneYearFromNow;
exports.get30daysfromNow = get30daysfromNow;
exports.getOneHourFromNow = getOneHourFromNow;
exports.get7daysfromNow = get7daysfromNow;
function getOneYearFromNow() {
    return Date.now() + 1000 * 60 * 60 * 24 * 365;
}
function get30daysfromNow() {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
}
function getOneHourFromNow() {
    return new Date(Date.now() + 1000 * 60 * 60);
}
function get7daysfromNow() {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
}
exports.ONE_DAY_MILIS = 24 * 60 * 60 * 1000;
const getFiveMinsAgo = () => new Date(Date.now() - 5 * 60 * 1000);
exports.getFiveMinsAgo = getFiveMinsAgo;
