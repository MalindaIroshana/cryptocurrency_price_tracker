const axios = require('axios');
const {wss} = require('../utils/webSocketUtils');
const WebSocket = require('ws');
const Crypto = require('../models/Crypto');

const coinGeckoApiUrl = 'https://api.coingecko.com/api/v3';

async function getCryptoPrices(param) {
    try {
        const response = await axios.get(`${coinGeckoApiUrl}/coins/markets`, {
            params: {
                ids: param.ids,
                vs_currency: param.vs_currencies,
                include_market_cap: param.include_market_cap,
                include_24hr_vol: param.include_24hr_vol
            },
        });

        const cryptoPrices = response.data;

        return cryptoPrices;
    } catch (error) {
        console.error('Error fetching cryptocurrency prices:', error.message);
        throw error;
    }
}

async function getCryptoPricesRealTime(param) {
    try {
        // Simulate sending updates every 5 seconds
        const updateInterval = setInterval(async () => {
            const response = await axios.get(`${coinGeckoApiUrl}/coins/markets`, {
                params: {
                    ids: param.ids,
                    vs_currency: param.vs_currencies,
                },
            });

            const cryptoPrices = response.data;

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: 'cryptoUpdate', data: cryptoPrices}));
                }
            });
            wss.on('close', () => {
                console.log('WebSocket connection closed');
                clearInterval(updateInterval);
            });
            return cryptoPrices;
        }, 30000);
        // Broadcast the real-time updates to all connected WebSocket clients
    } catch (error) {
        console.error('Error fetching cryptocurrency prices:', error.message);
        throw error;
    }
}

// Get User's Favorite Cryptocurrencies
async function getUserFavorites(userId) {
    try {
        return await Crypto.find({userId});
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching user\'s favorite cryptocurrencies');
    }
}

// Add Favorite Cryptocurrency for the User
async function addFavoriteCrypto(userId, name, symbol) {
    try {
        const existingCrypto = await Crypto.findOne({userId, name});
        if (existingCrypto) {
            throw new Error('Cryptocurrency already added as a favorite.');
        }

        const newCrypto = new Crypto({userId, name, symbol});
        await newCrypto.save();

        return 'Cryptocurrency added to favorites successfully.';
    } catch (error) {
        console.error(error);
        throw new Error('Error adding cryptocurrency to favorites');
    }
}

// Remove Favorite Cryptocurrency for the User
async function removeFavoriteCrypto(userId, cryptoId) {
    try {
        const existingCrypto = await Crypto.findOne({userId, _id: cryptoId});
        if (!existingCrypto) {
            throw new Error('Cryptocurrency not found in favorites.');
        }

        await Crypto.findByIdAndDelete(cryptoId);

        return 'Cryptocurrency removed from favorites successfully.';
    } catch (error) {
        console.error(error);
        throw new Error('Error removing cryptocurrency from favorites');
    }
}

module.exports = {
    getCryptoPrices, getCryptoPricesRealTime, getUserFavorites,
    addFavoriteCrypto,
    removeFavoriteCrypto,
};
