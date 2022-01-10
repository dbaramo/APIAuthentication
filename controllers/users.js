const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Post = require("../models/post");
const { JWT_SECRET } = require("../configuration");

signToken = user => {
	return JWT.sign(
		{
			iss: "CodeWorkr",
			sub: user.id,
			iat: new Date().getTime(),
			exp: new Date().setDate(new Date().getDate() + 1) //current time + 1 day
		},
		JWT_SECRET
	);
};

module.exports = {
	signUp: async (req, res, next) => {
		const { email, password } = req.value.body;

		// Check if email already exist in database
		const foundUser = await User.findOne({ "local.email": email });
		if (foundUser) {
			return res.status(409).json({ error: "Email already in use" });
		}

		// Creates a new user
		const newUser = new User({
			method: "local",
			local: {
				email: email,
				password: password
			}
		});
		await newUser.save();

		// Generate the token
		const token = signToken(newUser);

		// Respond with token
		res.status(200).json({ token });
	},

	signIn: async (req, res, next) => {
		// Generate token
		console.log("frontendmaster", req.user);
		const token = signToken(req.user);
		res.status(200).json({ token });
	},

	googleOAuth: async (req, res, next) => {
		//  Generate token
		const token = signToken(req.user);

		// Respond with token
		res.status(200).json({ token });
	},

	secret: async (req, res, next) => {
		res.json({ secret: "resource" });
		console.log(req.user.id);
	},

	getUserPosts: async (req, res, next) => {
		const { userId } = req.value.params;
		const user = await User.findById(userId).populate("posts");
		res.status(200).json(user.posts);
	},

	newUserPost: async (req, res, next) => {
		const { userId } = req.value.params;
		// Create a new post
		const newPost = new Post(req.value.body);
		// Get user
		const user = await User.findById(userId);
		// Assign user as the posts author
		newPost.author = user;
		// Save the car
		await newPost.save();
		// Add post to the user's posts array 'posts'
		user.posts.push(newPost);
		// Save the user
		await user.save();
		res.status(201).json(newPost);
	}
};
