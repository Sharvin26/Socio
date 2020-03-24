const { admin, db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignUpData, validateLoginData, reduceUserDetails } = require('../util/validators');
// User signUp
exports.signup = (request, response) => {
	const newUser = {
		email: request.body.email,
		password: request.body.password,
		confirmPassword: request.body.confirmPassword,
		handle: request.body.handle
	};

	const { valid, errors } = validateSignUpData(newUser);

	if (!valid) return response.status(400).json({ errors });

	const noImage = 'noImage.png';

	let token, userId;
	db
		.doc(`/users/${newUser.handle}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return response.status(400).json({ handle: 'this handle is already taken' });
			} else {
				return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
			}
		})
		.then((data) => {
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then((idtoken) => {
			token = idtoken;
			const userCredentials = {
				handle: newUser.handle,
				email: newUser.email,
				createdAt: new Date().toISOString(),
				imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
				userId
			};
			return db.doc(`/users/${newUser.handle}`).set(userCredentials);
		})
		.then(() => {
			return response.status(201).json({ token });
		})
		.catch((err) => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return response.status(400).json({ email: 'Email already in use' });
			} else {
				return response.status(500).json({ general: 'Something went wrong, please try again' });
			}
		});
};
// User Login
exports.login = (request, response) => {
	const user = {
		email: request.body.email,
		password: request.body.password
	};

	const { valid, errors } = validateLoginData(user);
	if (!valid) return response.status(400).json(errors);

	firebase
		.auth()
		.signInWithEmailAndPassword(user.email, user.password)
		.then((data) => {
			return data.user.getIdToken();
		})
		.then((token) => {
			return response.json({ token });
		})
		.catch((err) => {
			console.error(err);
			return response.status(403).json({ general: 'wrong credentials, please try again' });
		});
};
// Add User details
exports.addUserDetails = (request, response) => {
	let userDetails = reduceUserDetails(request.body);
	db
		.doc(`/users/${request.user.handle}`)
		.update(userDetails)
		.then(() => {
			return response.json({ message: 'Details added successfully' });
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: error.code });
		});
};
// Upload profile image
exports.uploadImage = (request, response) => {
	const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os');
	const fs = require('fs');
	const busboy = new BusBoy({ headers: request.headers });

	let imageFileName;
	let imageToBeUploaded = {};

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
			return response.status(400).json({ error: 'Wrong file type submited' });
		}
		const imageExtension = filename.split('.')[filename.split('.').length - 1];
		imageFileName = `${Math.round(Math.random() * 1000000000)}.${imageExtension}`;
		const filePath = path.join(os.tmpdir(), imageFileName);
		imageToBeUploaded = { filePath, mimetype };
		file.pipe(fs.createWriteStream(filePath));
	});
	busboy.on('finish', () => {
		admin
			.storage()
			.bucket()
			.upload(imageToBeUploaded.filePath, {
				resumable: false,
				metadata: {
					metadata: {
						contentType: imageToBeUploaded.mimetype
					}
				}
			})
			.then(() => {
				const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
				return db.doc(`/users/${request.user.handle}`).update({
					imageUrl
				});
			})
			.then(() => {
				return response.json({ message: 'Image uploaded successfully' });
			})
			.catch((err) => {
				console.error(err);
				return response.status(500).json({ error: error.code });
			});
	});
	busboy.end(request.rawBody);
};
// Get any user details
exports.getUserDetails = (request, response) => {
	let userData = {};
	db
		.doc(`/users/${request.params.handle}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				userData.user = doc.data();
				return db
					.collection('screams')
					.where('userHandle', '==', request.params.handle)
					.orderBy('createdAt', 'desc')
					.get();
			} else {
				return response.status(404).json({ error: 'user not found' });
			}
		})
		.then((data) => {
			userData.screams = [];
			data.forEach((doc) => {
				userData.screams.push({
					body: doc.data().body,
					userHandle: doc.data().userHandle,
					createdAt: doc.data().createdAt,
					userImage: doc.data().userImage,
					likeCount: doc.data().likeCount,
					commentCount: doc.data().commentCount,
					screamId: doc.id
				});
			});
			return response.json(userData);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code });
		});
};
// Get own user details
exports.getAuthenticatedUser = (request, response) => {
	let userData = {};
	db
		.doc(`/users/${request.user.handle}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				userData.userCredentials = doc.data();
				return db.collection('likes').where('userHandle', '==', request.user.handle).get();
			}
		})
		.then((data) => {
			userData.likes = [];
			data.forEach((doc) => {
				userData.Likes.push(doc.data());
			});
			return db
				.collection('notifications')
				.where('receipent', '==', request.user.handle)
				.orderBy('createdAt', 'desc')
				.limit(10)
				.get();
		})
		.then((data) => {
			userData.notifications = [];
			data.forEach((doc) => {
				userData.notifications.push({
					receipent: doc.data().receipent,
					sender: doc.data().sender,
					createdAt: doc.data().createdAt,
					screamId: doc.data().screamId,
					type: doc.data().type,
					read: doc.data().read,
					notificationId: doc.id
				});
			});
			return response.json(userData);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: error.code });
		});
};
// Mark notifications read
exports.markNotificationsRead = (request, response) => {
	let batch = db.batch();
	request.body.forEach((notificationId) => {
		const notification = db.doc(`/notifications/${notificationId}`);
		batch.update(notification, { read: true });
	});
	batch
		.commit()
		.then(() => {
			return response.json({ message: 'Notification mark read' });
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code });
		});
};
