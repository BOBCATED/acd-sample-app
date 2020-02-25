require('dotenv').config();
const express = require('express'),
      bodyParser = require('body-parser'),
      path = require('path');

const { loadConfig, testConnections } = require('./initdb')

const conn = loadConfig();

// initialize the express app object
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// init router
var router = express.Router();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);

const APP_PORT = process.env.PORT;

require('./routes')(conn, router);

testConnections(conn)
    .then(()=>{
        app.listen(APP_PORT, function(){
            console.log(`App is running on port ${APP_PORT}`);
        })
    }).catch(error =>{
        console.error(error);
        process.exit(-1);
    })

