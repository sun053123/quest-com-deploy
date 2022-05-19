const http = require("http");
const { createTerminus, HealthCheckError } = require('@godaddy/terminus');

module.exports = (app) => {

    function onSignal() {
        console.log('Received SIGTERM, shutting down gracefully');
        return Promise.all([
            new Promise((resolve) => {
                setTimeout(resolve, 1000);
            }),
            new Promise((resolve) => {
                server.close(resolve);
            }),
        ]);
    }

    function onShutdown() {
        console.log('Shutdown complete');
    }

    function onError(err) {
        //get logger to log file
        //throw err;
        if (err instanceof HealthCheckError) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    }
    // curl -X GET http://localhost:8000/health

    async function onHealthCheck() {
        // checks if the system is healthy, like the db connection is live
        return new Promise((resolve, reject) => {
            resolve();
        });
      }

    const server = http.createServer(app);

    const options = {
        signals: ['SIGTERM'],
        healthChecks: {
            '/health': onHealthCheck,
        },
        onSignal,
        onShutdown,
        onError,
    };

    createTerminus(server, options);

    return server;
}

