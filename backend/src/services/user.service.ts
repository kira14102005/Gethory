import { HTTP } from "../constants/http";
import User from "../models/UserCollection"
import { appAssert } from "../utils/appAssert";
import Jimp from 'jimp'
import path from 'path'
import fs from "fs";
const updateData: any = {
    username,
    name,
    profileCompleted: true,
};

if (avatar) {
    const buffer = Buffer.from(avatar.split(",")[1], "base64");
    const image = await Jimp.read(buffer);

    image.resize(150, Jimp.AUTO);

    imgPath = `${Date.now()}.${Math.floor(Math.random() * 1e6)}.png`;

    const storageDir = path.join(process.cwd(), "storage");

    await fs.promises.mkdir(storageDir, { recursive: true });

    await image.writeAsync(path.join(storageDir, imgPath));

    updateData.avatar = imgPath;
}

const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
);