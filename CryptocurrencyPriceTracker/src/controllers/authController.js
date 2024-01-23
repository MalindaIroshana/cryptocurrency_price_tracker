const bcrypt = require('bcrypt');
const User = require('../models/User');
const {generateToken} = require('../utils/jwtUtils');

async function register(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username,password);
    try {
        // Check if the username is already taken
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({error: 'Username is already taken'});
        }

        // Hash the password before saving it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({username, password: hashedPassword});
        await newUser.save();

        // Generate JWT token
        const token = generateToken({userId: newUser._id, username: newUser.username});

        res.status(200).json({token});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

async function login(req, res) {
    const username = req.body.username;
    const password = req.body.password;
console.log(username, password)
    try {
        // Check if the user exists
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // Generate JWT token
        const token = generateToken({userId: user._id, username: user.username});

        res.status(200).json({token});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = {register, login};
