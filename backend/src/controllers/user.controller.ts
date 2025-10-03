import { HTTP } from "../constants/http";
import User from "../models/UserCollection";
import { updateUser } from "../services/user.service";
import { appAssert } from "../utils/appAssert";
import catchError from "../utils/catchErrorWrapper";
import { UpdateUserSchema } from "./user.schema";

export const getUserController = catchError(async (req, res, next) => {
    const { userId, sessionId } = req
    const user = await User.findById(userId)
    appAssert(user, HTTP.NOT_FOUND, "User Not Exists");
    res.json({
        msg: "Your Details",
        // @ts-ignore
        user: user.omitPassword()
    })

})

export const updateuserProfileController = catchError(async function (req, res, next) {
    const userId = req.userId;
    appAssert(userId, HTTP.UNAUTHORIZED, "User ID not found in request (Auth token issue)");

    const { name, username, avatar } = UpdateUserSchema.parse(req.body);
    const updatedUser = await updateUser(userId, username, name, avatar)

    res.status(HTTP.OK).json({
        msg: "Profile setup complete",
        // @ts-ignore
        user: updatedUser.omitPassword()
    });

})