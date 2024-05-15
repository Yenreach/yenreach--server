import { Request } from 'express'
import { User } from '../../user/interfaces/UserInterface'

interface RequestWithUser extends Request {
    user: User
}

export { RequestWithUser }