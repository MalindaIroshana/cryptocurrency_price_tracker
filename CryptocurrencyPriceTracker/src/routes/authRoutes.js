const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route example
router.get('/protected', authMiddleware.isAuthenticated, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
