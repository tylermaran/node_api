const http = require('http');
const app = require('./app');
// apparently require('...') is old syntax for js, but still required for node

const port = process.env.PORT || 3000;

const server = http.createServer(app)
// to create a server we need to pass a listener
// a function that is excecuted whenever we get a new request - and then returns a response

server.listen(port);



