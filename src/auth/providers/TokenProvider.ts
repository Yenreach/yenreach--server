import { sign } from 'jsonwebtoken';
import { addHours } from 'date-fns'
import { JWT_SECRET_KEY, JWT_EXPIRATION_HOURS, JWT_ISSUER } from '@config';
import { HttpException } from '@/core/exceptions/HttpException';
import { Token as IToken, TokenPayload, TokenResponse } from '../interfaces';
import { Token } from '../models'
import { HttpCodes } from '@/core/constants';
import { logger } from '@/core/utils';
import { User } from '../../user/models';

class TokenProvider {
    public tokenModel = Token

    public async createToken(userId: string): Promise<TokenResponse> {
        try {
            const dataStoredInToken = { userId }

            const expirationDate: Date = addHours(
                new Date(),
                Number(JWT_EXPIRATION_HOURS),
            )

            const payload: TokenPayload = {
                ...dataStoredInToken,
                iat: Math.floor(Date.now() / 1000),
                exp:
                    Math.floor(Date.now() / 1000) +
                    60 * 60 * Number(JWT_EXPIRATION_HOURS), // 24 h
                issuer: JWT_ISSUER,
            }

            const token: string = sign(payload, JWT_SECRET_KEY)

            const createdToken: Token = await this.tokenModel.create({
                token,
                expirationDate,
                ...dataStoredInToken,
                isBlacklisted: false
            })

            return {
                token: createdToken.token,
                expirationDate: createdToken.expirationDate
            }
        } catch (err) {
            logger.error(err)
        }
    }

    public async findToken(token: string): Promise<Token> {
        const tokenResponse: Token = await this.tokenModel.findOne({ token })

        return tokenResponse
    }

    public async invalidateToken(token: string): Promise<void> {
        const tokenResponse: Token = await this.findToken(token)

        if (!tokenResponse) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Token not found')
        }

        // @ts-ignore
        await User.updateOne({ _id: tokenResponse.userId }, { $set: { tokens: [] } })
        await Token.findByIdAndUpdate(tokenResponse._id, { isBlacklisted: true })
    }
}

export { TokenProvider }
