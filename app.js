var credentials = require('./app/credentials'),
	express = require('express'),
	app = express();

app.use(express.static(__dirname + '/public'));

function startServer(auth) {
	app.set('google_auth', auth);
	app.listen(process.env.PORT || 3000);
}

credentials(startServer);
