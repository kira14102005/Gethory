import { HTTP } from "../constants/http";
import User from "../models/UserCollection"
import { appAssert } from "../utils/appAssert";
import Jimp from 'jimp'
import path from 'path'

export const updateUser = async (
    userId: any,
    username: string,
    name: string,
    avatar?: string
) => {
    console.log("Update Object : ", userId, username);

    let imgPath: string | undefined;

    if (avatar) {
        const buffer = Buffer.from(avatar.split(",")[1], "base64");
        const image = await Jimp.read(buffer);

        image.resize(150, Jimp.AUTO);

        imgPath = `${Date.now()}.${Math.floor(Math.random() * 1e6)}.png`;
        await image.writeAsync(path.resolve(__dirname, `../storage/${imgPath}`));
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                username,
                name,
                avatar: imgPath,
                profileCompleted: true,
            },
        },
        { new: true }
    )

    appAssert(updatedUser, HTTP.NOT_FOUND, "User not found or update failed");

    return updatedUser;
};
