const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin');

const {
	getAllScreams,
	postOneScream,
	getScream,
	commentOnScream,
	likeScream,
	unLikeScream,
	deleteScream
} = require('./handlers/screams');

const {
	signup,
	login,
	uploadImage,
	addUserDetails,
	getAuthenticatedUser,
	getUserDetails,
	markNotificationsRead
} = require('./handlers/users');

// Screams Route
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unLikeScream);

// Users Route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/{id}').onCreate((snapshot) => {
	db
		.doc(`/screams/${snapshot.data().screamId}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return db.doc(`/notifications/${snapshot.id}`).set({
					createdAt: new Date().toISOString(),
					receipent: doc.data().userHandle,
					sender: snapshot.data().userHandle,
					type: 'like',
					read: false,
					screamId: doc.id
				});
			}
		})
		.then(() => {
			return;
		})
		.catch((err) => {
			console.error(err);
			return;
		});
});

exports.deleteNotificationOnUnLike = functions.firestore.document('likes/{id}').onDelete((snapshot) => {
	db
		.doc(`/notifications/${snapshot.id}`)
		.delete()
		.then(() => {
			return;
		})
		.catch((err) => {
			console.error(err);
			return;
		});
});

exports.createNotificationOnComment = functions.firestore.document('comments/{id}').onCreate((snapshot) => {
	db
		.doc(`/screams/${snapshot.data().screamId}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return db.doc(`/notifications/${snapshot.id}`).set({
					createdAt: new Date().toISOString(),
					receipent: doc.data().userHandle,
					sender: snapshot.data().userHandle,
					type: 'comment',
					read: false,
					screamId: doc.id
				});
			}
		})
		.then(() => {
			return;
		})
		.catch((err) => {
			console.error(err);
			return;
		});
});
