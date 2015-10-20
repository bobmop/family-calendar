var credentials = require('./app/credentials'),
	express = require('express'),
	fs = require('fs'),
	morgan = require('morgan'),
	app = express();

app.use(express.static(__dirname + '/public'));

// logging
var logToDir = __dirname + '/logs/';
try {
	fs.mkdirSync(logToDir);
} catch(e) {
	if (e.code != 'EEXIST') {
		throw e;
	}
}
var accessLogStream = fs.createWriteStream(logToDir + '/access.log', {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

// common error handling
app.use(function(err, req, res, next) {
	res.status(err.code || 500);
	res.send({
		error: err,
		message: err.message
	})
});

function startServer(auth) {
	app.set('google_auth', auth);
	app.listen(process.env.PORT || 3000);
}

credentials(startServer);
