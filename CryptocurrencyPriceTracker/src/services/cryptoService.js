const axios = require('axios');
const {wss} = require('../utils/webSocketUtils');
const WebSocket = require('ws');

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
        }, 20000);
        // Broadcast the real-time updates to all connected WebSocket clients
    } catch (error) {
        console.error('Error fetching cryptocurrency prices:', error.message);
        throw error;
    }
}

module.exports = {getCryptoPrices, getCryptoPricesRealTime};
