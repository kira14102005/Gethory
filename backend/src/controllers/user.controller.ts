import { HTTP } from "../constants/http";
import User from "../models/UserCollection";
import { appAssert } from "../utils/appAssert";
import catchError from "../utils/catchErrorWrapper";

export const getUserController = catchError(async (req, res, next) => {
    const { userId, sessionId } = req
    const user = await User.findById(userId);
    appAssert(user, HTTP.NOT_FOUND, "User Not Exists");
    res.json({
        msg: "Your Details",
        // @ts-ignore
        User: user.omitPassword()
    })

})