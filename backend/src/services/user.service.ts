import { HTTP } from "../constants/http";
import User from "../models/UserCollection"
import { appAssert } from "../utils/appAssert";

export const updateUser = async (userId: any, username: string, name: string) => {
    const updatedUser = await User.findByIdAndUpdate(userId, {
        $set: {
            username,
            name,
            profileCompleted: true
        }
    }, { new: true })
    console.log(updatedUser)
    appAssert(updatedUser, HTTP.NOT_FOUND, "User not found or update failed");
    return updatedUser

}
