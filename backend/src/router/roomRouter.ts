import { Router } from "express";
import { roomCreateController } from "../controllers/room.controllers";
const rt = Router()

rt.post('/create' , roomCreateController)


export {rt as roomRouter}