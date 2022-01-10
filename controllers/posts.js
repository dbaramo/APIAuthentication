const Post = require("../models/post");

module.exports = {
	index: async (req, res, next) => {
		// Get all the cars!
		const posts = await Post.find({});
		res.status(200).json(posts);
	}
};
