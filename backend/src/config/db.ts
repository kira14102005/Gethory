import mongoose from "mongoose";

export async function connecttoDb(DB_URI: string) {
    try {
        await mongoose.connect(DB_URI)
        console.log("Connected Securely")
    } catch (e) {
        throw new Error("Error in connection")
    }

}

