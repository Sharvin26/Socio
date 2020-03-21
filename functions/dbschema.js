let db = {
	users: [
		{
			userId: 'eqe29wbjdjkwian',
			email: 'user@email.com',
			handle: 'user',
			createdAt: '2020-03-19T14:29:38.852Z',
			imageUrl: 'image/adaawdwd/fwqeqweq',
			bio: 'Sample bio info',
			website: 'https://user.com',
			location: 'Sample country'
		}
	],
	screams: [
		{
			userHandle: 'user',
			body: 'scream body',
			createdAt: '2020-03-18T14:29:38.852Z',
			likeCount: 5,
			commentCount: 2
		}
	],
	comments: [
		{
			userHandle: 'user',
			screamId: 'dbwkjdbwjbdkj',
			body: 'scream body',
			createdAt: '2020-03-20T14:29:38.852Z'
		}
	],
	notifications: [
		{
			receipent: 'user',
			sender: 'user2',
			read: 'true | False',
			screamId: 'dbwkjdbwjbdkj',
			type: 'like | comment',
			createdAt: '2020-03-20T14:29:38.852Z'
		}
	]
};

const userDetails = {
	// Redux data
	credentials: {
		userId: 'awjkbajdbjandjand',
		email: 'user@email.com',
		handle: 'user',
		createdAt: '2020-03-19T14:29:38.852Z',
		imageUrl: 'image/adaawdwd/fwqeqweq',
		bio: 'Sample bio info',
		website: 'https://user.com',
		location: 'Sample country'
	},
	Likes: [
		{
			userHandle: 'user',
			screamId: 'wdjidjiawljdl'
		},
		{
			userHandle: 'user',
			screamId: 'dbwkjdbwjbdkj'
		}
	]
};
