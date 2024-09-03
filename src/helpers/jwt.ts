import jwt from "jsonwebtoken"
const secret = "secret-fp"

function signToken (payload: {id: string, role: string}) {
    return jwt.sign(payload, secret)
}

function verifyToken (token: string) {
    return jwt.verify(token, secret)
}

export {
    signToken,
    verifyToken
}