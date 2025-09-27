import { Request, NextFunction, Response } from 'express'

type AsyncController =
    (req: Request, res: Response, next: NextFunction) => Promise<any>

const catchError = (control: AsyncController): AsyncController => {
    return async (req, res, next) => {
        try {
            await control(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

export default catchError