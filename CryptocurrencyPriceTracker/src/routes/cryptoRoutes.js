const express = require('express');
const cryptoController = require('../controllers/cryptoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/dashboard', cryptoController.getCryptoDashboard);
router.get('/realTimeDashboard', cryptoController.getCryptoPricesRealTime);
router.get('/favorites', authMiddleware.isAuthenticated, cryptoController.getFavoriteCryptos);
router.post('/add', authMiddleware.isAuthenticated, cryptoController.addFavoriteCrypto);
router.delete('/remove/:cryptoId', authMiddleware.isAuthenticated, cryptoController.removeFavoriteCrypto);

module.exports = router;
