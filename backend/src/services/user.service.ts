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
        const [header, data] = avatar.split(",");
        const buffer = Buffer.from(data, "base64");
        // ponytail: ext from client-sent mime, allowlisted so it only ever picks a static-served image suffix
        const sub = (header.split(";")[0].split(":")[1] ?? "image/png").split("/")[1]?.split("+")[0] ?? "png";
        const ext = ["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(sub) ? sub : "png";

        imgPath = `${Date.now()}.${Math.floor(Math.random() * 1e6)}.${ext}`;

        const storageDir = path.join(process.cwd(), "storage");

        await fs.promises.mkdir(storageDir, { recursive: true });

        const filePath = path.join(storageDir, imgPath);

        console.log("Saving avatar to:", filePath);

        try {
            const image = await Jimp.read(buffer);
            image.resize(150, Jimp.AUTO);
            await image.writeAsync(filePath);
        } catch {
            // ponytail: Jimp can't decode webp and friends, stores original unresized; add sharp if uniform 150px for all formats matters
            await fs.promises.writeFile(filePath, buffer);
        }
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