const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllScreams, postOneScream  } = require('./handlers/screams');
const {signup, login, uploadImage, addUserDetails } = require('./handlers/users');

// Screams Route
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);

// Users Route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);

exports.api = functions.https.onRequest(app)