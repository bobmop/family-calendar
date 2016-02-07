var credentials = require('./app/credentials'),
	express = require('express'),
	fs = require('fs'),
	morgan = require('morgan'),
	livereload = require("express-livereload"),
	google = require('googleapis'),
	calendar = google.calendar('v3'),
	app = express();

app.use(express.static(__dirname + '/public'));

livereload(app, {
	watchDir: process.cwd() + "/public"
});

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
app.get('/calendar', function(req, res, next) {
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
// calendar events
app.get('/events/:calendarId', function(req, res, next) {
	calendar.events.list({
		auth: app.get('google_auth'),
		calendarId: req.params.calendarId,
		// current Date and the next 31 days
		timeMax: (new Date(Date.now() + (1000 * 60 * 60 * 24 * 31))).toISOString(),
		// now
		timeMin: (new Date()).toISOString(),
		singleEvents: true,
		orderBy: 'startTime'
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
