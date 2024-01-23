const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cryptoSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    createdAt: {type: Date, default: Date.now},
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;
