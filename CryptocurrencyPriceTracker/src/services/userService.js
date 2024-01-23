const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

async function registerUser(username, password) {
    try {
        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Username is already taken');
        }

        // Hash the password before saving it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = generateToken({ userId: newUser._id, username: newUser.username });

        return { token };
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
}

async function loginUser(username, password) {
    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Invalid username or password');
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid username or password');
        }

        // Generate JWT token
        const token = generateToken({ userId: user._id, username: user.username });

        return { token };
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
}

module.exports = { registerUser, loginUser };
