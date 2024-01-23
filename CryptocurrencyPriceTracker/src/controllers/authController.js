const userService = require('../services/userService');

async function register(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const result = await userService.registerUser(username, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const result = await userService.loginUser(username, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

module.exports = { register, login };
