const jwt = require("jsonwebtoken");
const jose = require("jose");
const secret = process.env.JWT_SECRET;

function signToken(payload) {
  return jwt.sign(payload, secret);
}

async function verifyToken(token) {
  const secretJose = new TextEncoder().encode(secret);
  const { payload } = await jose.jwtVerify(token, secretJose);
  return payload;
}

module.exports = {
  signToken,
  verifyToken,
};
