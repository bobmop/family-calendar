var credentials = require('./app/credentials'),
	request = require('request'),
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
	var g = app.get('google_auth');
	g.getAccessToken(function() {
		calendar.calendarList.list({
			auth: g,
			minAccessRole: 'owner'
		}, function(err, response) {
			if (err) {
				next(err);
			} else {
				res.send(response);
			}
		});
	});
});
// calendar events
app.get('/events/:calendarId', function(req, res, next) {
	var g = app.get('google_auth');
	g.getAccessToken(function() {
		calendar.events.list({
			auth: g,
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
});

app.get('/weather', function(req, res, next) {
	var uri = 'http://api.openweathermap.org/data/2.5/forecast/city'
			+ '?q=' + app.get('weather_config').city
			+ '&APPID=' + app.get('weather_config').token
	req.pipe(request.get(uri))
	.pipe(res);
});

// common error handling
app.use(function(err, req, res, next) {
	res.status(err.code || 500);
	res.send({
		error: err,
		message: err.message
	})
});

function startServer(config) {
	app.set('google_auth', config.google);
	app.set('weather_config', config.weather);
	app.listen(process.env.PORT || 3000);
}

credentials(startServer);
