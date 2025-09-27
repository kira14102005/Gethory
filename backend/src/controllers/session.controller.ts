import { HTTP } from "../constants/http";
import SessionModel from "../models/SessionModel";
import { appAssert } from "../utils/appAssert";
import catchError from "../utils/catchErrorWrapper";
import z from 'zod';

export const getSessionsController = catchError(async (req, res, next) => {
    const { userId, sessionId } = req;
    console.log(userId)
    const SessionList = await SessionModel.find({
        userId,
        expiresAt: { $gt: new Date() }
    },
        {
            _id: 1,
            createdAt: 1,
            userAgent: 1
        },
        { sort: { createdAt: -1 } }
    );
    console.log(SessionList)
    return res.json({
        msg: "Sessions List",
        sessions: SessionList.map((ses) => {
            const sesObject = ses.toObject();
            if (ses._id == sessionId) return { ...sesObject, currentSession: true }
            else return sesObject
        })
    })



})


export const deleteSessionController = catchError(async (req, res, next) => {
    const sessionId = z.string().parse(req.params.id);
    appAssert(sessionId, HTTP.BAD_REQUEST, "No session Id passed as parameter");
    const deletedRecord = await SessionModel.deleteOne({ _id: sessionId, userId: req.userId });
    appAssert(deletedRecord, HTTP.NOT_FOUND, "Not valid Session to be Deleted")
    return res.json({ msg: "Session Deleted SuccessFully" })
})