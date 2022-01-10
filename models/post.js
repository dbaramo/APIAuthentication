const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
	title: String,
	content: String,
	datePosted: Date,
	author: {
		type: Schema.Types.ObjectId,
		ref: "user"
	}
});

const Post = mongoose.model("post", postSchema);
module.exports = Post;
