const cryptoService = require('../services/cryptoService');
const { verifyToken } = require("../utils/jwtUtils");

async function getCryptoDashboard(req, res) {
    const param = {
        "ids": req.body.ids,
        "vs_currencies": req.body.vs_currencies,
        "include_market_cap": req.body.include_market_cap,
        "include_24hr_vol": req.body.include_24hr_vol
    };
    try {
        const cryptoPrices = await cryptoService.getCryptoPrices(param);
        res.json({ cryptoPrices });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function getCryptoPricesRealTime(req, res) {
    const paramR = {
        "ids": req.body.ids,
        "vs_currencies": req.body.vs_currencies,
        "include_market_cap": req.body.include_market_cap,
        "include_24hr_vol": req.body.include_24hr_vol
    };
    try {
        const cryptoPrices = await cryptoService.getCryptoPricesRealTime(paramR);
        res.json({ cryptoPrices });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function getFavoriteCryptos(req, res) {
    try {
        const userId = req.user._id;
        const favoriteCryptos = await cryptoService.getUserFavorites(userId);
        res.json({ favoriteCryptos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function addFavoriteCrypto(req, res) {
    const token = req.header('Authorization');
    const userData = verifyToken(token.replace('Bearer ', ''));
    try {
        const userId = userData.userId;
        const { name, symbol } = req.body;

        const message = await cryptoService.addFavoriteCrypto(userId, name, symbol);
        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function removeFavoriteCrypto(req, res) {
    try {
        const userId = req.user._id;
        const cryptoId = req.params.cryptoId;

        const message = await cryptoService.removeFavoriteCrypto(userId, cryptoId);
        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getCryptoDashboard,
    getCryptoPricesRealTime,
    getFavoriteCryptos,
    addFavoriteCrypto,
    removeFavoriteCrypto
};
