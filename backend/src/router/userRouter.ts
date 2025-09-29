import { getUserController, updateuserProfileController } from "../controllers/user.controller";
import { Router } from "express";
const rt = Router();

rt.get('/', getUserController)
rt.put('/update_profile' , updateuserProfileController)
export { rt as userRouter }