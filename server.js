require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || '3000';

//Start server
const server = app.listen(port, () => {
    console.log('Express server listening on Port: ' + port);
});