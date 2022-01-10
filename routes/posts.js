const express = require("express");
const router = require("express-promise-router")();

const PostsController = require("../controllers/posts");

router.route("/").get(PostsController.index);

module.exports = router;
