var credentials = require('./app/credentials'),
	express = require('express'),
	fs = require('fs'),
	morgan = require('morgan'),
	google = require('googleapis'),
	calendar = google.calendar('v3'),
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

//calendar list
app.get('/calendar', function(req, res) {
	calendar.calendarList.list({
		auth: app.get('google_auth'),
		minAccessRole: 'owner'
	}, function(err, response) {
		if (err) {
			next(err);
		} else {
			res.send(response);
		}
	});
});

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
