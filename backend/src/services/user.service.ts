import { HTTP } from "../constants/http";
import User from "../models/UserCollection";
import { appAssert } from "../utils/appAssert";
import Jimp from "jimp";
import path from "path";
import fs from "fs";

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

        const storageDir = path.join(process.cwd(), "storage");

        await fs.promises.mkdir(storageDir, { recursive: true });

        const filePath = path.join(storageDir, imgPath);

        console.log("Saving avatar to:", filePath);

        await image.writeAsync(filePath);
    }

    const updateObject: any = {
        username,
        name,
        profileCompleted: true,
    };

    if (imgPath) {
        updateObject.avatar = imgPath;
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: updateObject,
        },
        { new: true }
    );

    appAssert(
        updatedUser,
        HTTP.NOT_FOUND,
        "User not found or update failed"
    );

    return updatedUser;
};