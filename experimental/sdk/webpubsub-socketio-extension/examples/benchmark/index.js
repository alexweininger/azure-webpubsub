const wpsExt = require("@azure/web-pubsub-socket.io")
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')
const { instrument } = require("@socket.io/admin-ui");

const wpsOptions = {
  hub: "eio_hub",
  connectionString: process.argv[2] || process.env.WebPubSubConnectionString,
}

const samplingInterval = 20;

async function main() {
    const server = await io(http).useAzureSocketIO(wpsOptions)
    instrument(server, { auth: false, mode: "production", });
    const benchmarkNs = server.of("/benchmark");

    var lastReceivedIndex = 0;

    // Client -> Server time
    var min = 10000, max = 0, sum = 0;
    
    benchmarkNs.on('connection', (socket) => {
        socket.on('client to server event', (data) => {
            var index = data.split(",")[0];
            var cost = new Date().getTime() - data.split(",")[1];

            min = Math.min(min, cost);
            max = Math.max(max, cost);
            sum += cost;
            if (index % samplingInterval == 0) {

                console.log(`client -> Server (Last ${samplingInterval}) | \
min: ${min.toString().padEnd(7)} ms | \
max: ${max.toString().padEnd(7)} ms | \
avg: ${(sum / samplingInterval).toFixed(1).padEnd(7)} ms | \
idx: ${(lastReceivedIndex + 1).toString().padEnd(5)} -> ${index.toString().padEnd(5)} |`);

                min = 10000, max = 0, sum = 0;
            }
            socket.emit("server to client event", (data));

            lastReceivedIndex = index;
        });
    });

    server.httpServer.listen(3000, () => {
        console.log('Visit http://localhost:%d', 3000);
    });
}

main()