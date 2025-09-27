import { Router } from "express";
import { loginController, logoutController, refreshController, registerController, resetPasswordController, sendPasswordResetEmailController, verifyController } from "../controllers/auth.controllers";
const rt = Router();

rt.post('/register', registerController)


rt.post('/login', loginController)


rt.get('/logout', logoutController)


rt.get('/refresh', refreshController);

rt.get('/email/verify', verifyController)

rt.get('/password/forgot', sendPasswordResetEmailController);

rt.post('/password/reset', resetPasswordController);



export { rt as authRouter };