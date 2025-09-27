import "dotenv/config"
import express from 'express'
import { Request, Response, NextFunction } from "express";
import cors from 'cors'
import { DB_URI, PORT, NODE_ENV, APP_ORIGIN } from "./constants/env";
import { connecttoDb } from "./config/db";
import { errorHandler } from "./midwares/errorHandler";
import catchError from "./utils/catchErrorWrapper";
import { authRouter } from "./router/authRouter";
import cookieParser from 'cookie-parser'
import { userRouter } from "./router/userRouter";
import { authenticate } from "./midwares/authenticate";
import { sessionRouter } from "./router/sessionRouter";
const app = express();
app.use(cors({
    // origin: APP_ORIGIN,
    // credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.get("/error", catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Hello")
    throw new Error("booo");
    return res.json({
        msg: "Welcome Home!"
    })
})
)
app.use('/auth'  , authRouter)

// protected routes 
app.use('/user' , authenticate , userRouter)
app.use('/sessions' , authenticate , sessionRouter)

//Error Midware at the End
app.use(errorHandler)
app.listen(PORT, async () => {
    try {
        console.log("Running  on PORT " + PORT + " in " + NODE_ENV + " environment")
        await connecttoDb(DB_URI);
    } catch (e) {
        console.log("Error in Joining to DB")
    }

})