const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const {handleUpgrade} = require('./src/utils/webSocketUtils');
const http = require('http');
const YAML = require("yamljs");
const swaggerUi = require('swagger-ui-express');

const app = express();
const server = http.createServer(app);
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

try {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log.bind("Connected to MongoDB");
} catch (error) {
    console.error.bind('Error connecting to MongoDB:', error);
}


mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Load routes
const authRoutes = require('./src/routes/authRoutes');
const cryptoRoutes = require('./src/routes/cryptoRoutes');


// Use routes
app.use('/auth', authRoutes);
app.use('/crypto', cryptoRoutes);
app.use('/authentication', authRoutes);

server.on('upgrade', (request, socket, head) => {
    handleUpgrade(request, socket, head);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Swagger Configuration
// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Cryptocurrency Price Tracking API',
//             version: '1.0.0',
//             description: 'API for retrieving cryptocurrency prices with user authentication',
//         },
//     },
//     apis: ['./src/routes/*.js'], // Your route files
// };
//
// const specs = swaggerJsdoc(options);
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = {server, app}