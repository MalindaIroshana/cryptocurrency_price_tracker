const Crypto = require('../models/Crypto');
const cryptoService = require('../services/cryptoService');
const {verifyToken} = require("../utils/jwtUtils");

// Get Crypto Dashboard
async function getCryptoDashboard(req, res) {
    const param = {
        "ids": req.body.ids,
        "vs_currencies": req.body.vs_currencies,
        "include_market_cap": req.body.include_market_cap,
        "include_24hr_vol": req.body.include_24hr_vol
    };
    try {
        const cryptoPrices = await cryptoService.getCryptoPrices(param);
        res.json({cryptoPrices});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// Get Crypto Dashboard
async function getCryptoPricesRealTime(req, res) {
    const paramR = {
        "ids": req.body.ids,
        "vs_currencies": req.body.vs_currencies,
        "include_market_cap": req.body.include_market_cap,
        "include_24hr_vol": req.body.include_24hr_vol
    };
    try {
        const cryptoPrices = await cryptoService.getCryptoPricesRealTime(paramR);
        res.json({cryptoPrices});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// Get user's favorite cryptocurrencies
async function getFavoriteCryptos(req, res) {
    try {
        const userId = req.user._id; // Assuming you have user information in the request object
        const favoriteCryptos = await Crypto.find({userId});
        res.json({favoriteCryptos});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Add a favorite cryptocurrency for the user
async function addFavoriteCrypto(req, res) {
    const token = req.header('Authorization');
    const userData = verifyToken(token.replace('Bearer ', ''));
    try {
        const userId = userData.userId;
        const {name, symbol} = req.body;

        // Check if the cryptocurrency is already added as a favorite
        const existingCrypto = await Crypto.findOne({userId, name});
        if (existingCrypto) {
            return res.status(400).json({error: 'Cryptocurrency already added as a favorite.'});
        }

        // Add the cryptocurrency to favorites
        const newCrypto = new Crypto({userId, name, symbol});
        await newCrypto.save();

        res.json({message: 'Cryptocurrency added to favorites successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Remove a favorite cryptocurrency for the user
async function removeFavoriteCrypto(req, res) {
    try {
        const userId = req.user._id; // Assuming you have user information in the request object
        const cryptoId = req.params.cryptoId;

        // Check if the cryptocurrency exists in favorites
        const existingCrypto = await Crypto.findOne({userId, _id: cryptoId});
        if (!existingCrypto) {
            return res.status(404).json({error: 'Cryptocurrency not found in favorites.'});
        }

        // Remove the cryptocurrency from favorites
        await Crypto.findByIdAndDelete(cryptoId);

        res.json({message: 'Cryptocurrency removed from favorites successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = {
    getCryptoDashboard,
    getCryptoPricesRealTime,
    getFavoriteCryptos,
    addFavoriteCrypto,
    removeFavoriteCrypto
};
