const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(data) {
    return jwt.sign(data, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
