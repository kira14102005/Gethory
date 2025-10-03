import { Router } from "express";
import { fetchAllRoomController, roomCreateController } from "../controllers/room.controllers";
const rt = Router()

rt.post('/create' , roomCreateController)

rt.get('/fetchall' , fetchAllRoomController)
export {rt as roomRouter}