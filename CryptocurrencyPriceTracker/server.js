const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { handleUpgrade } = require('./src/utils/webSocketUtils');
const http = require('http');

const app = express();
const server = http.createServer(app);
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("DB Connected"));
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Load routes
const authRoutes = require('./src/routes/authRoutes');
const cryptoRoutes = require('./src/routes/cryptoRoutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/crypto', cryptoRoutes);

server.on('upgrade', (request, socket, head) => {
    handleUpgrade(request, socket, head);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
