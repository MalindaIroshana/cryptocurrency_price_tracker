const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const userService = require('../src/services/userService');
const User = require('../src/models/User');
const { generateToken } = require('../src/utils/jwtUtils');

const expect = chai.expect;

describe('userService Tests', () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    after(() => {
        sandbox.restore();
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            // Stub User.findOne to return null, indicating that the username is not taken
            sandbox.stub(User, 'findOne').resolves(null);

            // Stub bcrypt.hash to return a hashed password
            sandbox.stub(bcrypt, 'hash').resolves('hashedPassword');

            // Stub User.prototype.save to resolve successfully
            sandbox.stub(User.prototype, 'save').resolves();

            // Stub generateToken to return a dummy token
            sandbox.stub(generateToken).returns('dummyToken');

            const result = await userService.registerUser('testuser', 'testpassword');

            expect(result).to.deep.equal({ token: 'dummyToken' });
        });

        it('should throw an error when the username is already taken', async () => {
            // Stub User.findOne to return a user, indicating that the username is taken
            sandbox.stub(User, 'findOne').resolves({});

            // Ensure that userService.registerUser throws an error
            await expect(userService.registerUser('testuser', 'testpassword')).to.be.rejectedWith('Username is already taken');
        });

        it('should throw an error for internal server error during registration', async () => {
            // Stub User.findOne to throw an error
            sandbox.stub(User, 'findOne').rejects(new Error('Some internal error'));

            // Ensure that userService.registerUser throws an internal server error
            await expect(userService.registerUser('testuser', 'testpassword')).to.be.rejectedWith('Internal Server Error');
        });
    });

    describe('loginUser', () => {
        it('should log in an existing user successfully', async () => {
            const mockUser = {
                _id: 'mockUserId',
                username: 'testuser',
                password: '$2b$10$y7t1YvUq3TmN88FXbpoD4eZtYxMgzsiC2qF/3T7c8JrMLO7QQ6A4e', // Mocked hashed password
            };

            // Stub User.findOne to return the mockUser
            sandbox.stub(User, 'findOne').resolves(mockUser);

            // Stub bcrypt.compare to return true, indicating a password match
            sandbox.stub(bcrypt, 'compare').resolves(true);

            // Stub generateToken to return a dummy token
            sandbox.stub(generateToken).returns('dummyToken');

            const result = await userService.loginUser('testuser', 'testpassword');

            expect(result).to.deep.equal({ token: 'dummyToken' });
        });

        it('should throw an error for invalid username or password during login', async () => {
            // Stub User.findOne to return null, indicating that the user does not exist
            sandbox.stub(User, 'findOne').resolves(null);

            // Ensure that userService.loginUser throws an error
            await expect(userService.loginUser('nonexistentuser', 'testpassword')).to.be.rejectedWith('Invalid username or password');

            // Reset the stub to return a user, but stub bcrypt.compare to return false
            sandbox.restore();
            sandbox = sinon.createSandbox();

            sandbox.stub(User, 'findOne').resolves({ username: 'testuser', password: 'somehashedpassword' });
            sandbox.stub(bcrypt, 'compare').resolves(false);

            await expect(userService.loginUser('testuser', 'wrongpassword')).to.be.rejectedWith('Invalid username or password');
        });

        it('should throw an error for internal server error during login', async () => {
            // Stub User.findOne to throw an error
            sandbox.stub(User, 'findOne').rejects(new Error('Some internal error'));

            // Ensure that userService.loginUser throws an internal server error
            await expect(userService.loginUser('testuser', 'testpassword')).to.be.rejectedWith('Internal Server Error');
        });
    });
});
