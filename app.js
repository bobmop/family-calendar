var credentials = require('./app/credentials'),
	express = require('express'),
	app = express(),
	auth;

app.use(express.static(__dirname + '/public'));

function startServer(auth) {
	auth = auth;
	app.listen(process.env.PORT || 3000);
}

credentials(startServer);
