const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const logger = require('morgan');
const cors  = require('cors');


//rutas 
const users = require('./routes/usersRoutes');

const port = process.env.PORT || 3000;

app.set('port', port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.disable('x-powered-by');



//error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.stack || 'Internal server error');
});

//llamando las rutas
users(app);


app.listen(port, '192.168.100.102'|| 'localhost' ,() => {
    console.log(`Server running on port ${port}`);
});


module.exports = {
    app,
    server
};