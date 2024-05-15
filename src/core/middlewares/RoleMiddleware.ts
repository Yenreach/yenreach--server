import { Response, NextFunction } from "express"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RequestWithUser } from "@/interfaces"
import { HttpException } from "@/core/exceptions"
import { HttpCodes } from "@/core/constants"
import { FilterQuery, Model } from "mongoose"
import { sendResponse } from "../utils"

const checkOwnership = (model: Model<any>) => {
    return async function (req: RequestWithUser, res: Response, next: NextFunction) {
        const params = String(req.params['id'])

        if (params.length < 24) {
            return sendResponse(res, HttpCodes.BAD_REQUEST, 'Invalid id')
        }

        const response = await model.findById(params)

        console.log(response)

        if (String(req.user._id) !== String(response.user)) {
            return sendResponse(res, HttpCodes.BAD_REQUEST, 'Resource not found')
        }

        next()
    }
}

export { checkOwnership }
