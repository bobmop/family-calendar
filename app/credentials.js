var fs = require('fs'),
    readline = require('readline'),
    google = require('googleapis'),
    googleAuth = require('google-auth-library'),

    SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'],
    TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
        process.env.USERPROFILE) + '/.credentials/',
    GOOGLE_TOKEN_PATH = TOKEN_DIR + 'familiy-calendar-google.json';


/**
 * Based on google's quickstart for nodejs.
 * It will try to get a stored token and give the possibility to get a new one.
 *
 * @param {function} callback The callback will get the token for the google api
 */
module.exports = function(callback) {

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    function getNewGoogleToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
       });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function(code) {
            rl.close();
            oauth2Client.getToken(code, function(err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                storeGoogleToken(token);
                callback(oauth2Client);
            });
        });
    }

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    function storeGoogleToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(GOOGLE_TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + GOOGLE_TOKEN_PATH);
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the autho else {
        console.log('Found')
    }rized client.
     */
    function authorize(credentials, callback) {
        var clientSecret = credentials.installed.client_secret,
            clientId = credentials.installed.client_id,
            redirectUrl = credentials.installed.redirect_uris[0],
            auth = new googleAuth(),
            oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(GOOGLE_TOKEN_PATH, function(err, token) {
            if (err) {
                getNewGoogleToken(oauth2Client, callback);
            } else {
                console.log('Found credentials in ' + GOOGLE_TOKEN_PATH + '...');
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
        });
    }

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials,
        // run given callback on success
        authorize(JSON.parse(content), callback);
    });
}
