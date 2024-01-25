const request = require('supertest');
const { app, server } = require('../app');
const userService = require('../src/services/userService');

afterAll(async () => {
    server.close();
});

describe('Auth Controller Tests', () => {
    describe('POST /auth/register', () => {
        it('should register a new user and return 200', async () => {
            // Mocking userService.registerUser function
            userService.registerUser = jest.fn().mockResolvedValue({ _id: 'someUserId' });

            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    password: 'testpassword',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');

            expect(userService.registerUser).toHaveBeenCalledWith('testuser', 'testpassword');
        });
    });

    describe('POST /auth/login', () => {
        it('should login an existing user and return 200', async () => {
            // Mocking userService.loginUser function
            userService.loginUser = jest.fn().mockResolvedValue({ token: 'someToken' });

            const response = await request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'testpassword',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');

            expect(userService.loginUser).toHaveBeenCalledWith('testuser', 'testpassword');
        });
    });
});

