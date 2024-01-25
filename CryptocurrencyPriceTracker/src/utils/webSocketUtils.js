const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

// Increase the limit to, say, 15
wss.setMaxListeners(15);

// Handle incoming WebSocket connections
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    // Handle WebSocket messages if needed
    ws.on('message', (message) => {
        console.log(`Received WebSocket message: ${message}`);
    });

    // Simulate sending updates every 5 seconds
    const updateInterval = setInterval(() => {
        const randomData = {
            type: 'cryptoUpdate',
            data: {
                Bitcoin: Math.random() * 50000,
                Ethereum: Math.random() * 3000,
            },
        };
        ws.send(JSON.stringify(randomData));
    }, 5000);

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        clearInterval(updateInterval);
    });
});

function handleUpgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
}

module.exports = { wss, handleUpgrade };
