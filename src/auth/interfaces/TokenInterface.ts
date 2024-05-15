interface Token {
    _id: any
    token: string
    userId: string
    isBlacklisted: boolean
    expirationDate: Date
}

interface TokenResponse {
    token: string
    expirationDate: Date
}

interface TokenPayload {
    userId: string
    iat: number
    exp: number
    issuer: string
}

export { Token, TokenResponse, TokenPayload }
