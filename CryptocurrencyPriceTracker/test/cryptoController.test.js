const request = require('supertest');
const { app, server} = require('../app'); // Update the path as per your project structure
const cryptoService = require('../src/services/cryptoService'); // Update the path as per your project structure
const { verifyToken } = require('../src/utils/jwtUtils'); // Update the path as per your project structure


let token = '';
beforeAll(async () => {
    // this '/authentication/test' endpoint returns a test token
    const response = await request(app).get('/authentication/test');
    token = response.body.token;
});

afterAll(() =>
{
    server.close();
});

describe('Crypto Controller Tests', () => {
    describe('GET /crypto/dashboard', () => {
        it('should get crypto dashboard data', async () => {
            // Mocking cryptoService.getCryptoPrices function
            cryptoService.getCryptoPrices = jest.fn().mockResolvedValue({ /* mock data */ });

            const response = await request(app)
                .get('/crypto/dashboard')
                .send({
                    ids: ['bitcoin', 'ethereum'],
                    vs_currencies: ['usd'],
                    include_market_cap: true,
                    include_24hr_vol: true,
                });

            expect(response.status).toBe(200);
        });
    });

    describe('GET /crypto/favorites', () => {
        it('should get user favorite cryptos', async () => {
            // Mocking cryptoService.getUserFavorites function
            cryptoService.getUserFavorites = jest.fn().mockResolvedValue({ /* mock data */ });

            const response = await request(app)
                .get('/crypto/favorites')
                .set('Authorization', 'Bearer ' + token);

            expect(response.status).toBe(200);
        });
    });
});
