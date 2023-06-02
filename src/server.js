
const app = require('./app');

//const WebSocket = require("ws");
const logger = require("./logger");


const port = parseInt(process.env.PORT, 10) || 4010;

app.listen(port, () => {
	logger.info(`> Ready on http://localhost:${port}`);
});




