import mongoose from "mongoose";

declare global{
    namespace Express{
        interface Request{
            userId : mongoose.Types.ObjectId | undefined;
            sessionId : any | undefined
        }
    }
}

export {}