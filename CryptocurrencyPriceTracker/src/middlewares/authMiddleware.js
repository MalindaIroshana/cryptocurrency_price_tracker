const { verifyToken } = require('../utils/jwtUtils');
const SECRET_KEY = process.env.SECRET_KEY;

function isAuthenticated(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    try {
        // Verify the token and check expiration
        const userData = verifyToken(token.replace('Bearer ', ''));
        const currentTime = Math.floor(Date.now() / 1000);

        if (userData.exp <= currentTime) {
            // Token has expired
            return res.status(401).json({ error: 'Unauthorized: Token has expired' });
        }

        req.user = userData;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}

module.exports = { isAuthenticated };
