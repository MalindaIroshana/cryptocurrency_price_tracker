const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const User = require('../src/models/User');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Authentication', () => {
    // Clear the User collection before running tests
    before(async () => {
        await User.deleteMany({});
    });

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await chai
                .request(server)
                .post('/auth/register')
                .send({ username: 'testuser', password: 'testpassword' });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
        });
    });

    describe('POST /auth/login', () => {
        it('should login an existing user', async () => {
            const res = await chai
                .request(server)
                .post('/auth/login')
                .send({ username: 'testuser', password: 'testpassword' });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
        });
    });

    describe('GET /auth/protected', () => {
        it('should access a protected route with valid token', async () => {
            const registerRes = await chai
                .request(server)
                .post('/auth/register')
                .send({ username: 'testuser_protected', password: 'testpassword' });

            const token = registerRes.body.token;

            const res = await chai
                .request(server)
                .get('/auth/protected')
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').eql('This is a protected route');
        });

        it('should not access a protected route without a token', async () => {
            const res = await chai.request(server).get('/auth/protected');
            expect(res).to.have.status(401);
        });
    });
});
