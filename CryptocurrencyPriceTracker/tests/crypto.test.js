const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const Crypto = require('../src/models/Crypto');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Cryptocurrency', () => {
    // Clear the Crypto collection before running tests
    before(async () => {
        await Crypto.deleteMany({});
    });

    describe('GET /crypto/favorites', () => {
        it('should get user\'s favorite cryptocurrencies', async () => {
            const res = await chai
                .request(server)
                .get('/crypto/favorites')
                .set('Authorization', 'Bearer YOUR_VALID_TOKEN'); // Replace with a valid token

            expect(res).to.have.status(200);
            // Add more assertions based on the actual response format
        });
    });

    describe('POST /crypto/add', () => {
        it('should add a cryptocurrency to user\'s favorites', async () => {
            const res = await chai
                .request(server)
                .post('/crypto/add')
                .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Replace with a valid token
                .send({ name: 'Bitcoin', symbol: 'BTC' });

            expect(res).to.have.status(200);
            // Add more assertions based on the actual response format
        });
    });

    describe('DELETE /crypto/remove/:cryptoId', () => {
        it('should remove a cryptocurrency from user\'s favorites', async () => {
            // Assuming you have a cryptoId to test with
            const cryptoId = 'YOUR_VALID_CRYPTO_ID';

            const res = await chai
                .request(server)
                .delete(`/crypto/remove/${cryptoId}`)
                .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Replace with a valid token

            expect(res).to.have.status(200);
            // Add more assertions based on the actual response format
        });
    });
});
