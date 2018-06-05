const app = require('./app');

const port = process.env.port || '3000';

const server = app.listen(port, () => {
    console.log('Express server listening on Port: ' + port);
});