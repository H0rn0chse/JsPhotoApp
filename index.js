// Import the library
const server = require('server');

// Launch the server to always answer "Hello world"
server(ctx => 'Hello world!');
