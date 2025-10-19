"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const user_controller_1 = require("../controllers/user.controller");
const express_1 = require("express");
const rt = (0, express_1.Router)();
exports.userRouter = rt;
rt.get('/', user_controller_1.getUserController);
rt.put('/update_profile', user_controller_1.updateuserProfileController);
