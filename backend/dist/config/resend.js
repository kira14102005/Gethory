"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resend_1 = require("resend");
const env_1 = require("../constants/env");
const resend_client = new resend_1.Resend(env_1.RESEND_API_KEY);
exports.default = resend_client;
