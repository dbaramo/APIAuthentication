module.exports = (req, res, next) => {
	if (!req.user) {
		return res.status(401).send({ error: "You must log in!" });
	}
	if (req.params.userId != req.user.id) {
		return res
			.status(401)
			.send({ error: "You are not logged in as that user!" });
	}

	next();
};
