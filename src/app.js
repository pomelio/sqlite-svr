const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const conf  = require('./conf.json');

const app = express();
const port = conf.port;

const dbRouter = require('./DBRouter');


app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(cors());

app.use(bodyParser.json());

app.use(express.static('public'));

app.use((req, res, next) => {
	console.log(req.originalUrl);
	next();
});

app.use(function(req, res, next){
	if (req.is('text/*')) {
	  req.text = '';
	  req.setEncoding('utf8');
	  req.on('data', function(chunk){ req.text += chunk });
	  req.on('end', next);
	} else {
	  next();
	}
});

app.use( (err, req, res, next) => {
	console.log(err);
	next(err)
});

app.use((req, res, next) => {
	res.setHeader('Last-Modified', (new Date()).toUTCString());
	next();
});

app.use('/db', dbRouter);

app.listen(port, () => {
	console.log(`db server listening at http://localhost:${port}`);
});

process.on('SIGINT', function() {
    console.log('shutdown...');
    const db = require('./db');
    db.close().then(msg => {
        console.log('shutdown...done');
        process.exit();
    }).catch(err =>{
        console.log('shutdown...error');
        process.exit();
    });
   
});