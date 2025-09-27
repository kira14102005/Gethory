import { getUserController } from "../controllers/user.controller";
import catchError from "../utils/catchErrorWrapper";
import { Router } from "express";
const rt = Router();

rt.get('/', getUserController)

export { rt as userRouter }