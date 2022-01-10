const Joi = require("joi");

module.exports = {
	validateParam: (schema, name) => {
		return (req, res, next) => {
			const result = Joi.validate({ param: req["params"][name] }, schema);
			if (result.error) {
				return res.status(400).json(result.error);
			} else {
				if (!req.value) req.value = {};

				if (!req.value["params"]) req.value["params"] = {};

				req.value["params"][name] = result.value.param;
				next();
			}
		};
	},

	validateBody: schema => {
		return (req, res, next) => {
			const result = Joi.validate(req.body, schema);
			if (result.error) {
				return res.status(400).json(result.error);
			}

			if (!req.value) {
				req.value = {};
			}
			req.value["body"] = result.value;
			next();
		};
	},

	schemas: {
		authSchema: Joi.object().keys({
			email: Joi.string()
				.email()
				.required(),
			password: Joi.string().required()
		}),

		userPostSchema: Joi.object().keys({
			title: Joi.string().required(),
			content: Joi.string().required(),
			datePosted: Joi.date().timestamp()
		}),

		idSchema: Joi.object().keys({
			param: Joi.string()
				.regex(/^[0-9a-fA-F]{24}$/)
				.required()
		})
	}
};
