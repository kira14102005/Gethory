import { Router } from "express";
import { loginController, logoutController, refreshController, registerController, resetPasswordController, sendPasswordResetEmailController, verifyController, resendEmailVerificationController } from "../controllers/auth.controllers";
import { oauthCallbackController, oauthStartController } from "../controllers/oauth.controllers";
const rt = Router();

rt.post('/register', registerController)


rt.post('/login', loginController)


rt.get('/logout', logoutController)


rt.get('/refresh', refreshController);

rt.post('/email/verify', verifyController)

rt.post('/email/resend-verification', resendEmailVerificationController)

rt.get('/password/forgot', sendPasswordResetEmailController);

rt.post('/password/reset', resetPasswordController);

rt.get('/google', oauthStartController("google"));
rt.get('/google/callback', oauthCallbackController("google"));
rt.get('/github', oauthStartController("github"));
rt.get('/github/callback', oauthCallbackController("github"));



export { rt as authRouter };