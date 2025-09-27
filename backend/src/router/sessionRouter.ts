import { Router } from "express";
import { deleteSessionController, getSessionsController } from "../controllers/session.controller";

const rt = Router();


rt.get('/', getSessionsController);

rt.delete('/:id', deleteSessionController)

export { rt as sessionRouter }