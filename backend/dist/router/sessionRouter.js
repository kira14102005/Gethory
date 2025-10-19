"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
const express_1 = require("express");
const session_controller_1 = require("../controllers/session.controller");
const rt = (0, express_1.Router)();
exports.sessionRouter = rt;
rt.get('/', session_controller_1.getSessionsController);
rt.delete('/:id', session_controller_1.deleteSessionController);
