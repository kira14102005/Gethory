import { getUserController, updateuserProfileController } from "../controllers/user.controller";
import catchError from "../utils/catchErrorWrapper";
import { Router } from "express";
const rt = Router();

rt.get('/', getUserController)
rt.put('/profile' , updateuserProfileController)
export { rt as userRouter }